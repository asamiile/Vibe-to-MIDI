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

type AudioCtx = NonNullable<ReturnType<typeof getAudioContext>>;
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

export function playPreview(
  suggestion: MusicalSuggestion,
  options: PlayOptions = {}
): PlayerHandle {
  const ctxOrNull = getAudioContext();
  // Audio unavailable on web / Expo Go — return no-op handle
  if (!ctxOrNull) return NO_OP_HANDLE;
  const ctx: AudioCtx = ctxOrNull;

  const bpm = getMidBpm(suggestion);
  const stepDuration = 60 / bpm / 4;
  const { gain = 0.3 } = options;
  const now = ctx.currentTime + 0.05;
  const scheduledNodes: ScheduledNode[] = [];

  suggestion.bassNotes.forEach((midi, i) => {
    scheduleNote(ctx, noteFreq(midi), now + i * stepDuration * 4, stepDuration * 3.5, gain, 'sawtooth', scheduledNodes);
  });

  suggestion.rhythmPattern.forEach((hit, step) => {
    if (!hit) return;
    scheduleNote(ctx, 80, now + step * stepDuration, stepDuration * 0.4, gain * 0.5, 'square', scheduledNodes);
  });

  const loopDuration = stepDuration * 16;
  let stopped = false;

  function loop() {
    if (stopped) return;
    const loopStart = now + loopDuration;
    suggestion.bassNotes.forEach((midi, i) => {
      scheduleNote(ctx, noteFreq(midi), loopStart + i * stepDuration * 4, stepDuration * 3.5, gain, 'sawtooth', scheduledNodes);
    });
    suggestion.rhythmPattern.forEach((hit, step) => {
      if (!hit) return;
      scheduleNote(ctx, 80, loopStart + step * stepDuration, stepDuration * 0.4, gain * 0.5, 'square', scheduledNodes);
    });
  }

  const loopTimer = setTimeout(loop, loopDuration * 1000 - 100);
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
