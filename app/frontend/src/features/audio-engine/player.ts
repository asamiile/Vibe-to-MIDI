import { getAudioContext } from './adapter';
import { noteFreq } from '../../lib/notes';
import type { MusicalSuggestion } from '../vibe-map/types';
import { getMidBpm } from '../vibe-map/engine';

interface PlayOptions {
  gain?: number;
}

export interface PlayerHandle {
  stop: () => void;
}

const NO_OP_HANDLE: PlayerHandle = { stop: () => {} };

type AudioCtx = NonNullable<Awaited<ReturnType<typeof getAudioContext>>>;
type Oscillator = ReturnType<AudioCtx['createOscillator']>;
type Gain = ReturnType<AudioCtx['createGain']>;

interface ScheduledNode {
  oscillator: Oscillator;
  gain: Gain;
}

function scheduleNote(
  ctx: AudioCtx,
  freq: number,
  startTime: number,
  duration: number,
  gainValue: number,
  type: OscillatorType,
  scheduledNodes: ScheduledNode[]
): void {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.value = freq;

  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(gainValue, startTime + 0.01);
  gain.gain.linearRampToValueAtTime(0, startTime + duration - 0.01);

  osc.connect(gain);
  gain.connect(ctx.destination);
  scheduledNodes.push({ oscillator: osc, gain });

  osc.start(startTime);
  osc.stop(startTime + duration);
}

export async function playPreview(
  suggestion: MusicalSuggestion,
  options: PlayOptions = {}
): Promise<PlayerHandle> {
  const ctxOrNull = await getAudioContext();
  // Audio unavailable on web / Expo Go — return no-op handle
  if (!ctxOrNull) return NO_OP_HANDLE;
  const ctx: AudioCtx = ctxOrNull;

  const bpm = getMidBpm(suggestion);
  const stepDuration = 60 / bpm / 4;
  const { gain = 0.3 } = options;
  const now = ctx.currentTime + 0.05;
  const scheduledNodes: ScheduledNode[] = [];

  suggestion.bassNotes.forEach((midi, i) => {
    const start = now + i * stepDuration * 4;
    scheduleNote(ctx, noteFreq(midi), start, stepDuration * 3.5, gain, 'sawtooth', scheduledNodes);
    scheduleNote(ctx, noteFreq(midi + 12), start, stepDuration * 3.5, gain * 0.28, 'triangle', scheduledNodes);
  });

  suggestion.rhythmPattern.forEach((hit, step) => {
    if (!hit) return;
    const start = now + step * stepDuration;
    scheduleNote(ctx, 80, start, stepDuration * 0.4, gain * 0.5, 'square', scheduledNodes);
    scheduleNote(ctx, 1200, start, stepDuration * 0.12, gain * 0.16, 'square', scheduledNodes);
  });

  const loopDuration = stepDuration * 16;
  let loopStart = now;
  let stopped = false;
  let loopTimer: ReturnType<typeof setTimeout>;

  function scheduleLoop() {
    if (stopped) return;
    suggestion.bassNotes.forEach((midi, i) => {
      const start = loopStart + i * stepDuration * 4;
      scheduleNote(ctx, noteFreq(midi), start, stepDuration * 3.5, gain, 'sawtooth', scheduledNodes);
      scheduleNote(ctx, noteFreq(midi + 12), start, stepDuration * 3.5, gain * 0.28, 'triangle', scheduledNodes);
    });
    suggestion.rhythmPattern.forEach((hit, step) => {
      if (!hit) return;
      const start = loopStart + step * stepDuration;
      scheduleNote(ctx, 80, start, stepDuration * 0.4, gain * 0.5, 'square', scheduledNodes);
      scheduleNote(ctx, 1200, start, stepDuration * 0.12, gain * 0.16, 'square', scheduledNodes);
    });
    loopStart += loopDuration;
    loopTimer = setTimeout(scheduleLoop, loopDuration * 1000 - 100);
  }

  scheduleLoop();
  return {
    stop: () => {
      stopped = true;
      clearTimeout(loopTimer);
      scheduledNodes.splice(0).forEach(({ oscillator, gain }) => {
        gain.gain.cancelScheduledValues(ctx.currentTime);
        gain.gain.setValueAtTime(0, ctx.currentTime);
        try {
          oscillator.stop(ctx.currentTime);
        } catch {
          // Already stopped or not yet startable on this native implementation.
        }
        oscillator.disconnect?.();
        gain.disconnect?.();
      });
    },
  };
}
