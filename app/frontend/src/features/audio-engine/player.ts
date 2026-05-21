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
  getStabPlaybackProfile,
} from '../vibe-map/sound-playback';
import { AUDIO_PARAMS } from './constants';
import type { AudioLayer } from './constants';
import type { StereoPanSpec } from '../vibe-map/types';

interface PlayOptions {
  gain?: number;
  activeLayers?: ReadonlySet<AudioLayer>;
  pan?: StereoPanSpec;
}

export interface PlayerHandle {
  stop: () => void;
}

const NO_OP_HANDLE: PlayerHandle = { stop: () => {} };

type AudioCtx = NonNullable<Awaited<ReturnType<typeof getAudioContext>>>;
type Oscillator = ReturnType<AudioCtx['createOscillator']>;
type Gain = ReturnType<AudioCtx['createGain']>;

interface AudioPanner {
  pan: { value: number };
  connect: (destination: unknown) => void;
  disconnect: () => void;
}

interface ScheduledNode {
  oscillator: Oscillator;
  gain: Gain;
  panner?: AudioPanner;
  shaper?: WaveShaper;
}

function createPanner(ctx: AudioCtx, panValue: number): AudioPanner {
  const panner = (ctx as unknown as { createStereoPanner: () => AudioPanner }).createStereoPanner();
  panner.pan.value = panValue;
  return panner;
}

interface AnalogDelayHandle {
  input: Parameters<Gain['connect']>[0];
  disconnect: () => void;
}

function createAnalogDelay(
  ctx: AudioCtx,
  delaySeconds: number,
  feedbackGain: number,
  filterFreq: number
): AnalogDelayHandle {
  type DelayNode = { delayTime: { value: number }; connect: (n: unknown) => void; disconnect: () => void };
  const delay    = (ctx as unknown as { createDelay: (max: number) => DelayNode }).createDelay(delaySeconds + 0.01);
  const feedback = ctx.createGain();
  const filter   = ctx.createBiquadFilter();

  delay.delayTime.value  = delaySeconds;
  feedback.gain.value    = feedbackGain;
  filter.type            = 'lowpass';
  filter.frequency.value = filterFreq;

  // feedback loop: delay → filter → feedback gain → delay
  delay.connect(filter as unknown as Parameters<typeof delay.connect>[0]);
  filter.connect(feedback);
  feedback.connect(delay as unknown as Parameters<Gain['connect']>[0]);
  delay.connect(ctx.destination as unknown as Parameters<typeof delay.connect>[0]);

  return {
    input: delay as unknown as Parameters<Gain['connect']>[0],
    disconnect: () => {
      delay.disconnect();
      filter.disconnect();
      feedback.disconnect();
    },
  };
}

type PeriodicWaveObj = object;

function buildPeriodicWave(ctx: AudioCtx, real: number[], imag: number[]): PeriodicWaveObj {
  return (ctx as unknown as {
    createPeriodicWave: (r: Float32Array, i: Float32Array) => PeriodicWaveObj;
  }).createPeriodicWave(new Float32Array(real), new Float32Array(imag));
}

const periodicWaveCache = new WeakMap<AudioCtx, Partial<Record<'hollowOrgan' | 'bellLike', PeriodicWaveObj>>>();
const waveshapeCurveCache = new Map<number, Float32Array>();

// Odd harmonics only (1, 3, 5) — hollow organ / clarinet quality
function hollowOrganWave(ctx: AudioCtx): PeriodicWaveObj {
  const cache = periodicWaveCache.get(ctx) ?? {};
  if (!cache.hollowOrgan) {
    cache.hollowOrgan = buildPeriodicWave(ctx, [0, 1, 0, 0.33, 0, 0.2], [0, 0, 0, 0, 0, 0]);
    periodicWaveCache.set(ctx, cache);
  }
  return cache.hollowOrgan;
}

// Inharmonic partials (2, 4, 7) — metallic bell quality
function bellLikeWave(ctx: AudioCtx): PeriodicWaveObj {
  const cache = periodicWaveCache.get(ctx) ?? {};
  if (!cache.bellLike) {
    cache.bellLike = buildPeriodicWave(ctx, [0, 0, 0.8, 0, 0.5, 0, 0, 0.3], [0, 0, 0, 0, 0, 0, 0, 0]);
    periodicWaveCache.set(ctx, cache);
  }
  return cache.bellLike;
}

function buildWaveshapeCurve(amount: number): Float32Array {
  const normalized = Math.max(0, Math.min(1, amount));
  const cacheKey = Math.round(normalized * 1000);
  const cached = waveshapeCurveCache.get(cacheKey);
  if (cached) return cached;

  const samples = 256;
  const curve = new Float32Array(samples);
  const k = normalized * 100;
  for (let i = 0; i < samples; i++) {
    const x = (i * 2) / samples - 1;
    curve[i] = k === 0 ? x : ((Math.PI + k) * x) / (Math.PI + k * Math.abs(x));
  }
  waveshapeCurveCache.set(cacheKey, curve);
  return curve;
}

type WaveShaper = { curve: Float32Array | null; connect: (n: unknown) => void; disconnect: () => void };

function createWaveShaper(ctx: AudioCtx, amount: number): WaveShaper {
  const shaper = (ctx as unknown as { createWaveShaper: () => WaveShaper }).createWaveShaper();
  shaper.curve = buildWaveshapeCurve(amount);
  return shaper;
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
  scheduledNodes: ScheduledNode[],
  sweep?: { startRatio: number; endRatio: number },
  panValue?: number,
  shapeAmount?: number
): void {
  const osc = ctx.createOscillator();
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.value = freq;

  filter.type = 'lowpass';
  filter.Q.value = filterQ;
  if (sweep) {
    filter.frequency.setValueAtTime(Math.max(filterFreq * sweep.startRatio, 20), startTime);
    filter.frequency.exponentialRampToValueAtTime(Math.max(filterFreq * sweep.endRatio, 20), startTime + duration);
  } else {
    filter.frequency.value = filterFreq;
  }

  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(gainValue, startTime + 0.01);
  gain.gain.linearRampToValueAtTime(0, startTime + duration - 0.01);

  osc.connect(filter);
  const shaper = shapeAmount !== undefined && shapeAmount > 0 ? createWaveShaper(ctx, shapeAmount) : undefined;
  if (shaper) {
    filter.connect(shaper as unknown as Parameters<Gain['connect']>[0]);
    shaper.connect(gain);
  } else {
    filter.connect(gain);
  }
  if (panValue !== undefined) {
    const panner = createPanner(ctx, panValue);
    gain.connect(panner as unknown as Parameters<Gain['connect']>[0]);
    panner.connect(ctx.destination);
    scheduledNodes.push({ oscillator: osc, gain, panner, shaper });
  } else {
    gain.connect(ctx.destination);
    scheduledNodes.push({ oscillator: osc, gain, shaper });
  }

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
  const shaper = profile.shapeAmount !== undefined && profile.shapeAmount > 0
    ? createWaveShaper(ctx, profile.shapeAmount)
    : undefined;
  if (shaper) {
    filter.connect(shaper as unknown as Parameters<Gain['connect']>[0]);
    shaper.connect(gain);
  } else {
    filter.connect(gain);
  }
  gain.connect(ctx.destination);
  scheduledNodes.push({ oscillator: osc, gain, shaper });

  osc.start(startTime);
  osc.stop(startTime + profile.decay + 0.05);

  if (profile.clickFreq && profile.clickGainRatio && profile.clickDecay) {
    const clickOsc = ctx.createOscillator();
    const clickGain = ctx.createGain();
    clickOsc.type = 'triangle';
    clickOsc.frequency.value = profile.clickFreq;
    clickGain.gain.setValueAtTime(gainValue * profile.clickGainRatio, startTime);
    clickGain.gain.linearRampToValueAtTime(0, startTime + profile.clickDecay);
    clickOsc.connect(clickGain);
    clickGain.connect(ctx.destination);
    scheduledNodes.push({ oscillator: clickOsc, gain: clickGain });
    clickOsc.start(startTime);
    clickOsc.stop(startTime + profile.clickDecay + 0.02);
  }
}

function scheduleNoise(
  ctx: AudioCtx,
  startTime: number,
  duration: number,
  gainValue: number,
  noiseFilter: { cutoff: number; q: number },
  variant: NoiseVariantId,
  cleanupFns: Array<(t: number) => void>,
  sustained = false,
  panValue?: number
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

  if (sustained) {
    const release = 0.08;
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(gainValue, startTime + 0.02);
    gain.gain.setValueAtTime(gainValue, startTime + effectiveDuration - release);
    gain.gain.linearRampToValueAtTime(0, startTime + effectiveDuration);
  } else {
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(gainValue, startTime + 0.006);
    gain.gain.linearRampToValueAtTime(0, startTime + effectiveDuration);
  }

  bandpass.connect(lowpass);
  lowpass.connect(gain);
  const panner = panValue !== undefined ? createPanner(ctx, panValue) : undefined;
  if (panner) {
    gain.connect(panner as unknown as Parameters<Gain['connect']>[0]);
    panner.connect(ctx.destination);
  } else {
    gain.connect(ctx.destination);
  }

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
    panner?.disconnect();
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
  scheduledNodes: ScheduledNode[],
  sweep?: { startRatio: number; endRatio: number },
  panValue?: number,
  shapeAmount?: number,
  periodicWave?: PeriodicWaveObj
): void {
  const osc = ctx.createOscillator();
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();

  if (periodicWave) {
    (osc as unknown as { setPeriodicWave: (w: PeriodicWaveObj) => void }).setPeriodicWave(periodicWave);
  } else {
    osc.type = type;
  }
  osc.frequency.value = freq;

  filter.type = 'lowpass';
  filter.Q.value = filterQ;
  if (sweep) {
    filter.frequency.setValueAtTime(Math.max(filterFreq * sweep.startRatio, 20), startTime);
    filter.frequency.exponentialRampToValueAtTime(Math.max(filterFreq * sweep.endRatio, 20), startTime + duration);
  } else {
    filter.frequency.value = filterFreq;
  }

  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(gainValue, startTime + 0.006);
  gain.gain.linearRampToValueAtTime(gainValue * 0.35, startTime + 0.18);
  gain.gain.linearRampToValueAtTime(0, startTime + duration - 0.02);

  osc.connect(filter);
  const shaper = shapeAmount !== undefined && shapeAmount > 0 ? createWaveShaper(ctx, shapeAmount) : undefined;
  if (shaper) {
    filter.connect(shaper as unknown as Parameters<Gain['connect']>[0]);
    shaper.connect(gain);
  } else {
    filter.connect(gain);
  }
  if (panValue !== undefined) {
    const panner = createPanner(ctx, panValue);
    gain.connect(panner as unknown as Parameters<Gain['connect']>[0]);
    panner.connect(ctx.destination);
    scheduledNodes.push({ oscillator: osc, gain, panner, shaper });
  } else {
    gain.connect(ctx.destination);
    scheduledNodes.push({ oscillator: osc, gain, shaper });
  }

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
  scheduledNodes: ScheduledNode[],
  sweep?: { startRatio: number; endRatio: number },
  panValue?: number,
  shapeAmount?: number
): void {
  const profile = getStabPlaybackProfile(variant);
  const effectiveNotes = profile.notes(midiNotes);
  const effectiveDuration = duration * profile.durationRatio;
  const effectiveGain = gainValue * profile.gainRatio;
  const effectiveFilterFreq = filterFreq * profile.cutoffRatio;
  const effectiveFilterQ = filterQ * profile.qRatio;
  const wave = variant === 'hollow-organ' ? hollowOrganWave(ctx)
             : variant === 'bell-like'    ? bellLikeWave(ctx)
             : undefined;
  const bellDuration = variant === 'bell-like' ? effectiveDuration * 0.5 : effectiveDuration;

  effectiveNotes.forEach((midi, index) => {
    const baseFreq = noteFreq(midi);
    const voiceGain = effectiveGain / effectiveNotes.length;
    if (variant === 'square-saw') {
      scheduleSynth(ctx, baseFreq, startTime, effectiveDuration, voiceGain * 0.58, effectiveFilterFreq, effectiveFilterQ, 'sawtooth', scheduledNodes, sweep, panValue, shapeAmount);
      scheduleSynth(ctx, baseFreq, startTime, effectiveDuration, voiceGain * 0.42, effectiveFilterFreq * 0.88, effectiveFilterQ, 'square', scheduledNodes, sweep, panValue, shapeAmount);
    } else if (variant === 'sampled-chord-like') {
      scheduleSynth(ctx, baseFreq, startTime, effectiveDuration * 0.72, voiceGain, effectiveFilterFreq * 0.82, effectiveFilterQ * 0.9, 'sawtooth', scheduledNodes, sweep, panValue, shapeAmount);
    } else if (variant === 'wide-detuned') {
      scheduleSynth(ctx, baseFreq * 0.997, startTime, effectiveDuration, voiceGain * 0.5, effectiveFilterFreq, effectiveFilterQ, 'sawtooth', scheduledNodes, sweep, panValue, shapeAmount);
      scheduleSynth(ctx, baseFreq * 1.003, startTime, effectiveDuration, voiceGain * 0.5, effectiveFilterFreq, effectiveFilterQ, 'sawtooth', scheduledNodes, sweep, panValue, shapeAmount);
    } else if (wave) {
      scheduleSynth(ctx, baseFreq, startTime, bellDuration, voiceGain, effectiveFilterFreq, effectiveFilterQ, 'sine', scheduledNodes, sweep, panValue, shapeAmount, wave);
    } else {
      scheduleSynth(ctx, baseFreq, startTime, effectiveDuration, voiceGain, effectiveFilterFreq, effectiveFilterQ, 'sawtooth', scheduledNodes, sweep, panValue, shapeAmount);
    }
    if (index === 0) {
      scheduleSynth(ctx, noteFreq(midi - 12), startTime, effectiveDuration, effectiveGain * 0.25, effectiveFilterFreq, effectiveFilterQ, 'sawtooth', scheduledNodes, sweep, panValue, shapeAmount);
    }
    if (profile.octaveShadow) {
      scheduleSynth(ctx, noteFreq(midi + 12), startTime, effectiveDuration * 0.75, voiceGain * 0.22, effectiveFilterFreq * 1.12, effectiveFilterQ * 0.85, 'triangle', scheduledNodes, sweep, panValue, shapeAmount);
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
  const { gain = 0.3, activeLayers, pan } = options;
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
  const filterSweep     = suggestion.filterSweep;
  const bassSweep       = (filterSweep?.target === 'bass' || filterSweep?.target === 'both') ? filterSweep : undefined;
  const stabSweep       = (filterSweep?.target === 'stab' || filterSweep?.target === 'both') ? filterSweep : undefined;
  const waveshape       = suggestion.waveshape;
  const bassShape       = (waveshape?.target === 'bass' || waveshape?.target === 'both') ? waveshape.amount : undefined;
  const stabShape       = (waveshape?.target === 'stab' || waveshape?.target === 'both') ? waveshape.amount : undefined;

  const now = ctx.currentTime + 0.05;
  const activeNodes: ScheduledNode[] = [];
  const activeCleanupFns: Array<(t: number) => void> = [];

  const bassPan  = pan?.bass;
  const noisePan = pan?.noise;
  const stabPan  = pan?.stab;

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
            nodeAcc,
            bassSweep,
            bassPan,
            bassShape
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
      const noiseProfile = getNoisePlaybackProfile(soundVariants.noise);
      const noiseGain = gain * soundMix.noise * AUDIO_PARAMS.noise.gainRatio * noiseProfile.gainRatio;
      if (noiseProfile.continuous) {
        scheduleNoise(ctx, loopAt, loopDuration, noiseGain, noiseFilterSpec, soundVariants.noise, cleanupAcc, true, noisePan);
      } else {
        suggestion.noisePattern.forEach((hit, step) => {
          if (!hit) return;
          scheduleNoise(ctx, loopAt + step * stepDuration, noiseDuration, noiseGain, noiseFilterSpec, soundVariants.noise, cleanupAcc, false, noisePan);
        });
      }
    }
    if (playMelody) {
      if (dubDelay.analog) {
        const delaySeconds = dubDelay.stepOffset * stepDuration;
        const analogDelay = createAnalogDelay(ctx, delaySeconds, dubDelay.feedbackGain, stabFilterSpec.cutoff * 0.7);
        cleanupAcc.push(() => analogDelay.disconnect());
        melodySteps.forEach(({ midiNotes, step, durationSteps }) => {
          const start = loopAt + step * stepDuration;
          const hitNodes: ScheduledNode[] = [];
          scheduleChordStab(ctx, midiNotes, start, durationSteps * stepDuration, gain * soundMix.stab * AUDIO_PARAMS.melody.gainRatio, stabFilterSpec.cutoff, stabFilterSpec.q, soundVariants.stab, hitNodes, stabSweep, stabPan, stabShape);
          hitNodes.forEach(({ gain: g }) => g.connect(analogDelay.input));
          nodeAcc.push(...hitNodes);
        });
      } else {
        melodySteps.forEach(({ midiNotes, step, durationSteps }) => {
          const start = loopAt + step * stepDuration;
          scheduleChordStab(ctx, midiNotes, start, durationSteps * stepDuration, gain * soundMix.stab * AUDIO_PARAMS.melody.gainRatio, stabFilterSpec.cutoff, stabFilterSpec.q, soundVariants.stab, nodeAcc, stabSweep, stabPan, stabShape);
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
      loopNodes.forEach(({ oscillator, gain: g, panner, shaper }) => {
        oscillator.disconnect?.();
        g.disconnect?.();
        panner?.disconnect();
        shaper?.disconnect();
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
      activeNodes.splice(0).forEach(({ oscillator, gain: g, panner, shaper }) => {
        g.gain.cancelScheduledValues(t);
        g.gain.setValueAtTime(0, t);
        try { oscillator.stop(t); } catch {}
        oscillator.disconnect?.();
        g.disconnect?.();
        panner?.disconnect();
        shaper?.disconnect();
      });
      activeCleanupFns.splice(0).forEach((fn) => fn(t));
    },
  };
}
