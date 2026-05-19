import { getAudioContext } from './adapter';
import { noteFreq } from '../../lib/notes';
import { getChordNotes } from '../../lib/chords';
import type { MusicalSuggestion } from '../vibe-map/types';
import { getMidBpm } from '../vibe-map/engine';
import { DEFAULT_SOUND_VARIANTS } from '../vibe-map/sound-palette';
import type { KickVariantId, NoiseVariantId, StabVariantId } from '../vibe-map/sound-palette';
import {
  getBassPlaybackVoices,
  DEFAULT_SOUND_MIX,
  getEffectiveDubDelay,
  getKickPlaybackProfile,
  getNoisePlaybackProfile,
} from '../vibe-map/sound-playback';
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

function scheduleBass(
  ctx: AudioCtx,
  freq: number,
  startTime: number,
  duration: number,
  gainValue: number,
  filterFreq: number,
  filterQ: number,
  type: OscillatorType,
  scheduledNodes: ScheduledNode[]
): void {
  const osc = ctx.createOscillator();
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();

  osc.type = type;
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
  variant: KickVariantId,
  kickFilter?: { cutoff: number; q: number }
): void {
  const profile = getKickPlaybackProfile(variant);
  const osc = ctx.createOscillator();
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(profile.startFreq, startTime);
  osc.frequency.linearRampToValueAtTime(profile.endFreq, startTime + profile.pitchDecay);

  filter.type = 'lowpass';
  filter.frequency.value = (kickFilter?.cutoff ?? AUDIO_PARAMS.kick.filterFreq) * profile.cutoffRatio;
  filter.Q.value = kickFilter?.q ?? AUDIO_PARAMS.kick.filterQ;

  gain.gain.setValueAtTime(gainValue * profile.gainRatio, startTime);
  gain.gain.linearRampToValueAtTime(0, startTime + profile.decay);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  scheduledNodes.push({ oscillator: osc, gain });

  osc.start(startTime);
  osc.stop(startTime + profile.decay + 0.05);
}

function scheduleNoise(
  ctx: AudioCtx,
  startTime: number,
  duration: number,
  gainValue: number,
  noiseFilter: { cutoff: number; q: number },
  variant: NoiseVariantId,
  cleanupFns: Array<(t: number) => void>
): void {
  const profile = getNoisePlaybackProfile(variant);
  const bandpass = ctx.createBiquadFilter();
  const lowpass = ctx.createBiquadFilter();
  const gain = ctx.createGain();
  const cutoff = Math.min(noiseFilter.cutoff * profile.cutoffRatio, 8200);
  const effectiveDuration = duration * profile.durationRatio;

  bandpass.type = 'bandpass';
  bandpass.frequency.value = cutoff;
  bandpass.Q.value = Math.max(0.7, noiseFilter.q * profile.qRatio);

  lowpass.type = 'lowpass';
  lowpass.frequency.value = Math.min(cutoff * 1.35, 9000);
  lowpass.Q.value = 0.5;

  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(gainValue, startTime + 0.006);
  gain.gain.linearRampToValueAtTime(0, startTime + effectiveDuration);

  bandpass.connect(lowpass);
  lowpass.connect(gain);
  gain.connect(ctx.destination);

  const oscs = profile.freqs.map((freq, index) => {
    const osc = ctx.createOscillator();
    osc.type = profile.type(index);
    osc.frequency.value = freq;
    osc.connect(bandpass);
    osc.start(startTime);
    osc.stop(startTime + effectiveDuration + 0.01);
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
  type: OscillatorType,
  scheduledNodes: ScheduledNode[]
): void {
  const osc = ctx.createOscillator();
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();

  osc.type = type;
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
  variant: StabVariantId,
  scheduledNodes: ScheduledNode[]
): void {
  midiNotes.forEach((midi, index) => {
    const baseFreq = noteFreq(midi);
    const voiceGain = gainValue / midiNotes.length;
    if (variant === 'square-saw') {
      scheduleSynth(ctx, baseFreq, startTime, duration, voiceGain * 0.58, filterFreq, filterQ, 'sawtooth', scheduledNodes);
      scheduleSynth(ctx, baseFreq, startTime, duration, voiceGain * 0.42, filterFreq * 0.88, filterQ, 'square', scheduledNodes);
    } else if (variant === 'sampled-chord-like') {
      scheduleSynth(ctx, baseFreq, startTime, duration * 0.72, voiceGain, filterFreq * 0.82, filterQ * 0.9, 'sawtooth', scheduledNodes);
    } else if (variant === 'wide-detuned') {
      scheduleSynth(ctx, baseFreq * 0.997, startTime, duration, voiceGain * 0.5, filterFreq, filterQ, 'sawtooth', scheduledNodes);
      scheduleSynth(ctx, baseFreq * 1.003, startTime, duration, voiceGain * 0.5, filterFreq, filterQ, 'sawtooth', scheduledNodes);
    } else {
      scheduleSynth(ctx, baseFreq, startTime, duration, voiceGain, filterFreq, filterQ, 'sawtooth', scheduledNodes);
    }
    if (index === 0) {
      scheduleSynth(ctx, noteFreq(midi - 12), startTime, duration, gainValue * 0.25, filterFreq, filterQ, 'sawtooth', scheduledNodes);
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
  const soundVariants = suggestion.soundVariants ?? DEFAULT_SOUND_VARIANTS;
  const soundMix = suggestion.soundMix ?? DEFAULT_SOUND_MIX;

  const playKick   = !activeLayers || activeLayers.has('kick');
  const playBass   = !activeLayers || activeLayers.has('bass');
  const playNoise  = !activeLayers || activeLayers.has('noise');
  const playMelody = (suggestion.melodySuggested ?? false) &&
                     (!activeLayers || activeLayers.has('melody'));

  const bassFilterFreq  = suggestion.bassFilter?.cutoff   ?? AUDIO_PARAMS.bass.filterFreq;
  const bassFilterQ     = suggestion.bassFilter?.q        ?? AUDIO_PARAMS.bass.filterQ;
  const noiseFilterSpec = suggestion.noiseFilter          ?? { cutoff: AUDIO_PARAMS.noise.filterFreq, q: AUDIO_PARAMS.noise.filterQ };
  const stabFilterSpec  = suggestion.chordStabFilter      ?? { cutoff: AUDIO_PARAMS.melody.filterFreq, q: AUDIO_PARAMS.melody.filterQ };
  const dubDelay        = getEffectiveDubDelay(
    suggestion.dubDelay ?? { repeats: 2, stepOffset: 2, feedbackGain: 0.3 },
    soundVariants.space
  );
  const noiseDuration   = AUDIO_PARAMS.noise.decayMs / 1000;
  const melodySteps     = playMelody ? buildMelodySteps(suggestion) : [];

  const now = ctx.currentTime + 0.05;
  const activeNodes: ScheduledNode[] = [];
  const activeCleanupFns: Array<(t: number) => void> = [];

  function schedulePattern(
    loopAt: number,
    nodeAcc: ScheduledNode[],
    cleanupAcc: Array<(t: number) => void>
  ) {
    if (playBass) {
      suggestion.bassNotes.forEach((midi, i) => {
        const start = loopAt + i * stepDuration * 4;
        getBassPlaybackVoices(soundVariants.bass).forEach((voice) => {
          scheduleBass(
            ctx,
            noteFreq(midi + voice.octaveOffset),
            start,
            stepDuration * 3.5,
            gain * soundMix.bass * voice.gainRatio,
            bassFilterFreq * voice.cutoffRatio,
            bassFilterQ,
            voice.type,
            nodeAcc
          );
        });
      });
    }
    if (playKick) {
      suggestion.rhythmPattern.forEach((hit, step) => {
        if (!hit) return;
        scheduleKick(ctx, loopAt + step * stepDuration, gain * soundMix.kick, nodeAcc, soundVariants.kick, suggestion.kickFilter);
      });
    }
    if (playNoise && suggestion.noisePattern) {
      suggestion.noisePattern.forEach((hit, step) => {
        if (!hit) return;
        const noiseProfile = getNoisePlaybackProfile(soundVariants.noise);
        scheduleNoise(
          ctx,
          loopAt + step * stepDuration,
          noiseDuration,
          gain * soundMix.noise * AUDIO_PARAMS.noise.gainRatio * noiseProfile.gainRatio,
          noiseFilterSpec,
          soundVariants.noise,
          cleanupAcc
        );
      });
    }
    if (playMelody) {
      melodySteps.forEach(({ midiNotes, step, durationSteps }) => {
        const start = loopAt + step * stepDuration;
        scheduleChordStab(ctx, midiNotes, start, durationSteps * stepDuration, gain * soundMix.stab * AUDIO_PARAMS.melody.gainRatio, stabFilterSpec.cutoff, stabFilterSpec.q, soundVariants.stab, nodeAcc);
        for (let repeat = 1; repeat <= dubDelay.repeats; repeat += 1) {
          scheduleChordStab(
            ctx,
            midiNotes,
            start + repeat * dubDelay.stepOffset * stepDuration,
            durationSteps * stepDuration,
            gain * soundMix.stab * AUDIO_PARAMS.melody.gainRatio * Math.pow(dubDelay.feedbackGain, repeat),
            stabFilterSpec.cutoff,
            stabFilterSpec.q,
            soundVariants.stab,
            nodeAcc
          );
        }
      });
    }
  }

  const loopDuration = stepDuration * 16;
  let loopStart = now;
  let stopped = false;
  let loopTimer: ReturnType<typeof setTimeout>;
  const cleanupTimers: ReturnType<typeof setTimeout>[] = [];

  function scheduleLoop() {
    if (stopped) return;
    const loopNodes: ScheduledNode[] = [];
    const loopCleanups: Array<(t: number) => void> = [];
    schedulePattern(loopStart, loopNodes, loopCleanups);
    activeNodes.push(...loopNodes);
    activeCleanupFns.push(...loopCleanups);

    // Disconnect nodes from this loop after they have finished playing
    const cleanupTimer = setTimeout(() => {
      loopNodes.forEach(({ oscillator, gain: g }) => {
        oscillator.disconnect?.();
        g.disconnect?.();
      });
      loopNodes.forEach((n) => {
        const i = activeNodes.indexOf(n);
        if (i >= 0) activeNodes.splice(i, 1);
      });
      loopCleanups.forEach((fn) => {
        const i = activeCleanupFns.indexOf(fn);
        if (i >= 0) activeCleanupFns.splice(i, 1);
      });
    }, (loopDuration + 0.5) * 1000);
    cleanupTimers.push(cleanupTimer);

    loopStart += loopDuration;
    loopTimer = setTimeout(scheduleLoop, loopDuration * 1000 - 100);
  }

  scheduleLoop();
  return {
    stop: () => {
      stopped = true;
      clearTimeout(loopTimer);
      cleanupTimers.forEach(clearTimeout);
      const t = ctx.currentTime;
      activeNodes.splice(0).forEach(({ oscillator, gain: g }) => {
        g.gain.cancelScheduledValues(t);
        g.gain.setValueAtTime(0, t);
        try { oscillator.stop(t); } catch {}
        oscillator.disconnect?.();
        g.disconnect?.();
      });
      activeCleanupFns.splice(0).forEach((fn) => fn(t));
    },
  };
}
