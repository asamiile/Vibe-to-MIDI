import { getAudioContext } from './adapter';
import { noteFreq } from '../../lib/notes';
import { getChordNotes } from '../../lib/chords';
import type { MusicalSuggestion } from '../vibe-map/types';
import { getMidBpm } from '../vibe-map/engine';
import { AUDIO_PARAMS } from './constants';
import type { AudioLayer } from './constants';

interface PlayOptions {
  gain?: number;
  activeLayers?: ReadonlySet<AudioLayer>;
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

function scheduleBass(
  ctx: AudioCtx,
  freq: number,
  startTime: number,
  duration: number,
  gainValue: number,
  filterFreq: number,
  filterQ: number,
  scheduledNodes: ScheduledNode[]
): void {
  const osc = ctx.createOscillator();
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();

  osc.type = 'sawtooth';
  osc.frequency.value = freq;

  filter.type = 'lowpass';
  filter.frequency.value = filterFreq;
  filter.Q.value = filterQ;

  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(gainValue, startTime + 0.01);
  gain.gain.linearRampToValueAtTime(0, startTime + duration - 0.01);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  scheduledNodes.push({ oscillator: osc, gain });

  osc.start(startTime);
  osc.stop(startTime + duration);
}

function scheduleKick(
  ctx: AudioCtx,
  startTime: number,
  gainValue: number,
  scheduledNodes: ScheduledNode[],
  kickFilter?: { cutoff: number; q: number }
): void {
  const osc = ctx.createOscillator();
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(120, startTime);
  osc.frequency.linearRampToValueAtTime(30, startTime + 0.14);

  filter.type = 'lowpass';
  filter.frequency.value = kickFilter?.cutoff ?? AUDIO_PARAMS.kick.filterFreq;
  filter.Q.value = kickFilter?.q ?? AUDIO_PARAMS.kick.filterQ;

  gain.gain.setValueAtTime(gainValue, startTime);
  gain.gain.linearRampToValueAtTime(0, startTime + 0.45);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  scheduledNodes.push({ oscillator: osc, gain });

  osc.start(startTime);
  osc.stop(startTime + 0.5);
}

// Inharmonic high-frequency series for noise texture
const NOISE_OSC_FREQS = [7800, 9100, 11300] as const;

function scheduleNoise(
  ctx: AudioCtx,
  startTime: number,
  duration: number,
  gainValue: number,
  noiseFilter: { cutoff: number; q: number },
  cleanupFns: Array<(t: number) => void>
): void {
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();

  filter.type = 'bandpass';
  filter.frequency.value = noiseFilter.cutoff;
  filter.Q.value = noiseFilter.q;

  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(gainValue, startTime + 0.001);
  gain.gain.linearRampToValueAtTime(0, startTime + duration);

  filter.connect(gain);
  gain.connect(ctx.destination);

  const oscs = NOISE_OSC_FREQS.map((freq) => {
    const osc = ctx.createOscillator();
    osc.type = 'square';
    osc.frequency.value = freq;
    osc.connect(filter);
    osc.start(startTime);
    osc.stop(startTime + duration + 0.01);
    return osc;
  });

  cleanupFns.push((t) => {
    gain.gain.cancelScheduledValues(t);
    gain.gain.setValueAtTime(0, t);
    oscs.forEach((osc) => { try { osc.stop(t); } catch {} });
  });
}

function scheduleSynth(
  ctx: AudioCtx,
  freq: number,
  startTime: number,
  duration: number,
  gainValue: number,
  filterFreq: number,
  filterQ: number,
  scheduledNodes: ScheduledNode[]
): void {
  const osc = ctx.createOscillator();
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();

  osc.type = 'sawtooth';
  osc.frequency.value = freq;

  filter.type = 'lowpass';
  filter.frequency.value = filterFreq;
  filter.Q.value = filterQ;

  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(gainValue, startTime + 0.006);
  gain.gain.linearRampToValueAtTime(gainValue * 0.35, startTime + 0.18);
  gain.gain.linearRampToValueAtTime(0, startTime + duration - 0.02);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  scheduledNodes.push({ oscillator: osc, gain });

  osc.start(startTime);
  osc.stop(startTime + duration);
}

interface MelodyStep {
  midiNotes: readonly number[];
  step: number;
  durationSteps: number;
}

function buildMelodySteps(suggestion: MusicalSuggestion): MelodyStep[] {
  const midiNotes: readonly number[] = getChordNotes(suggestion.chord.root, suggestion.chord.quality, 3);
  const pattern = suggestion.chordStabPattern ?? suggestion.rhythmPattern;
  return pattern
    .map((hit, step) => (hit ? { midiNotes, step, durationSteps: 1 } : null))
    .filter((step): step is MelodyStep => step !== null);
}

function scheduleChordStab(
  ctx: AudioCtx,
  midiNotes: readonly number[],
  startTime: number,
  duration: number,
  gainValue: number,
  filterFreq: number,
  filterQ: number,
  scheduledNodes: ScheduledNode[]
): void {
  midiNotes.forEach((midi, index) => {
    scheduleSynth(ctx, noteFreq(midi), startTime, duration, gainValue / midiNotes.length, filterFreq, filterQ, scheduledNodes);
    if (index === 0) {
      scheduleSynth(ctx, noteFreq(midi - 12), startTime, duration, gainValue * 0.25, filterFreq, filterQ, scheduledNodes);
    }
  });
}

export async function playPreview(
  suggestion: MusicalSuggestion,
  options: PlayOptions = {}
): Promise<PlayerHandle> {
  const ctxOrNull = await getAudioContext();
  if (!ctxOrNull) return NO_OP_HANDLE;
  const ctx: AudioCtx = ctxOrNull;

  const rawBpm = getMidBpm(suggestion);
  const bpm = Math.max(AUDIO_PARAMS.bpmMin, Math.min(AUDIO_PARAMS.bpmMax, rawBpm));
  const stepDuration = 60 / bpm / 4;
  const { gain = 0.3, activeLayers } = options;

  const playKick   = !activeLayers || activeLayers.has('kick');
  const playBass   = !activeLayers || activeLayers.has('bass');
  const playNoise  = !activeLayers || activeLayers.has('noise');
  const playMelody = (suggestion.melodySuggested ?? false) &&
                     (!activeLayers || activeLayers.has('melody'));

  const bassFilterFreq  = suggestion.bassFilter?.cutoff   ?? AUDIO_PARAMS.bass.filterFreq;
  const bassFilterQ     = suggestion.bassFilter?.q        ?? AUDIO_PARAMS.bass.filterQ;
  const noiseFilterSpec = suggestion.noiseFilter          ?? { cutoff: AUDIO_PARAMS.noise.filterFreq, q: AUDIO_PARAMS.noise.filterQ };
  const stabFilterSpec  = suggestion.chordStabFilter      ?? { cutoff: AUDIO_PARAMS.melody.filterFreq, q: AUDIO_PARAMS.melody.filterQ };
  const dubDelay        = suggestion.dubDelay             ?? { repeats: 2, stepOffset: 2, feedbackGain: 0.3 };
  const noiseDuration   = AUDIO_PARAMS.noise.decayMs / 1000;
  const melodySteps     = playMelody ? buildMelodySteps(suggestion) : [];

  const now = ctx.currentTime + 0.05;
  const scheduledNodes: ScheduledNode[] = [];
  const cleanupFns: Array<(t: number) => void> = [];

  function schedulePattern(loopAt: number) {
    if (playBass) {
      suggestion.bassNotes.forEach((midi, i) => {
        const start = loopAt + i * stepDuration * 4;
        scheduleBass(ctx, noteFreq(midi), start, stepDuration * 3.5, gain, bassFilterFreq, bassFilterQ, scheduledNodes);
        scheduleNote(ctx, noteFreq(midi + 12), start, stepDuration * 3.5, gain * 0.28, 'triangle', scheduledNodes);
      });
    }
    if (playKick) {
      suggestion.rhythmPattern.forEach((hit, step) => {
        if (!hit) return;
        scheduleKick(ctx, loopAt + step * stepDuration, gain * 1.8, scheduledNodes, suggestion.kickFilter);
      });
    }
    if (playNoise && suggestion.noisePattern) {
      suggestion.noisePattern.forEach((hit, step) => {
        if (!hit) return;
        scheduleNoise(ctx, loopAt + step * stepDuration, noiseDuration, gain * AUDIO_PARAMS.noise.gainRatio, noiseFilterSpec, cleanupFns);
      });
    }
    if (playMelody) {
      melodySteps.forEach(({ midiNotes, step, durationSteps }) => {
        const start = loopAt + step * stepDuration;
        scheduleChordStab(ctx, midiNotes, start, durationSteps * stepDuration, gain * AUDIO_PARAMS.melody.gainRatio, stabFilterSpec.cutoff, stabFilterSpec.q, scheduledNodes);
        for (let repeat = 1; repeat <= dubDelay.repeats; repeat += 1) {
          scheduleChordStab(
            ctx,
            midiNotes,
            start + repeat * dubDelay.stepOffset * stepDuration,
            durationSteps * stepDuration,
            gain * AUDIO_PARAMS.melody.gainRatio * Math.pow(dubDelay.feedbackGain, repeat),
            stabFilterSpec.cutoff,
            stabFilterSpec.q,
            scheduledNodes
          );
        }
      });
    }
  }

  const loopDuration = stepDuration * 16;
  let loopStart = now;
  let stopped = false;
  let loopTimer: ReturnType<typeof setTimeout>;

  function scheduleLoop() {
    if (stopped) return;
    schedulePattern(loopStart);
    loopStart += loopDuration;
    loopTimer = setTimeout(scheduleLoop, loopDuration * 1000 - 100);
  }

  scheduleLoop();
  return {
    stop: () => {
      stopped = true;
      clearTimeout(loopTimer);
      const t = ctx.currentTime;
      scheduledNodes.splice(0).forEach(({ oscillator, gain }) => {
        gain.gain.cancelScheduledValues(t);
        gain.gain.setValueAtTime(0, t);
        try { oscillator.stop(t); } catch {}
        oscillator.disconnect?.();
        gain.disconnect?.();
      });
      cleanupFns.splice(0).forEach((fn) => fn(t));
    },
  };
}
