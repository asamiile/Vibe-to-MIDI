import { AUDIO_PARAMS } from '../audio-engine/constants';
import type {
  BassVariantId,
  KickVariantId,
  NoiseVariantId,
  SpaceVariantId,
  StabVariantId,
} from './sound-palette';
import type { SoundMixLevels } from './types';

export const DEFAULT_SOUND_MIX: SoundMixLevels = {
  kick: 1,
  bass: 1,
  noise: 1,
  stab: 1,
};

export interface KickPlaybackProfile {
  startFreq: number;
  endFreq: number;
  pitchDecay: number;
  decay: number;
  gainRatio: number;
  cutoffRatio: number;
  clickFreq?: number;
  clickGainRatio?: number;
  clickDecay?: number;
  shapeAmount?: number;
}

export interface BassPlaybackVoice {
  type: OscillatorType;
  octaveOffset: number;
  gainRatio: number;
  cutoffRatio: number;
  sweep?: { startRatio: number; endRatio: number };
  shapeAmount?: number;
}

export interface NoisePlaybackProfile {
  freqs: readonly number[];
  type: (index: number) => OscillatorType;
  durationRatio: number;
  gainRatio: number;
  cutoffRatio: number;
  qRatio: number;
  continuous?: boolean;  // schedule one sustained node per loop instead of per-step hits
  useWhiteNoise?: boolean;
}

export interface StabPlaybackProfile {
  notes: (midiNotes: readonly number[]) => readonly number[];
  durationRatio: number;
  gainRatio: number;
  cutoffRatio: number;
  qRatio: number;
  octaveShadow?: boolean;
  delaySendRatio: number;
  repeatFilterRatio: number;
  repeatDurationRatio: number;
  repeatShapeAmount?: number;
}

export interface DubDelaySpec {
  repeats: number;
  stepOffset: number;
  feedbackGain: number;
  analog?: boolean;
}

export function getKickPlaybackProfile(variant: KickVariantId): KickPlaybackProfile {
  switch (variant) {
    case 'soft-909':
      return { startFreq: 105, endFreq: 38, pitchDecay: 0.09, decay: 0.34, gainRatio: 1.55, cutoffRatio: 1.15, clickFreq: 1400, clickGainRatio: 0.08, clickDecay: 0.014 };
    case 'muffled-room':
      return { startFreq: 95, endFreq: 28, pitchDecay: 0.18, decay: 0.55, gainRatio: 1.45, cutoffRatio: 0.75 };
    case 'saturated-thump':
      return { startFreq: 135, endFreq: 35, pitchDecay: 0.11, decay: 0.42, gainRatio: 1.95, cutoffRatio: 0.95, shapeAmount: 0.28, clickFreq: 950, clickGainRatio: 0.1, clickDecay: 0.012 };
    case 'industrial-stomp':
      return { startFreq: 150, endFreq: 28, pitchDecay: 0.08, decay: 0.58, gainRatio: 2.3, cutoffRatio: 0.7, shapeAmount: 0.45, clickFreq: 720, clickGainRatio: 0.14, clickDecay: 0.018 };
    case 'short-click':
      return { startFreq: 170, endFreq: 42, pitchDecay: 0.045, decay: 0.22, gainRatio: 1.35, cutoffRatio: 1.35, clickFreq: 2100, clickGainRatio: 0.18, clickDecay: 0.01 };
    case 'sub-boom':
      return { startFreq: 92, endFreq: 24, pitchDecay: 0.22, decay: 0.72, gainRatio: 1.65, cutoffRatio: 0.68 };
    case 'rubber-kick':
      return { startFreq: 118, endFreq: 34, pitchDecay: 0.16, decay: 0.46, gainRatio: 1.72, cutoffRatio: 1.05, shapeAmount: 0.14, clickFreq: 1050, clickGainRatio: 0.06, clickDecay: 0.014 };
    case 'dusty-tap':
      return { startFreq: 108, endFreq: 48, pitchDecay: 0.055, decay: 0.18, gainRatio: 0.92, cutoffRatio: 0.55, clickFreq: 680, clickGainRatio: 0.08, clickDecay: 0.012 };
    case 'hard-ping':
      return { startFreq: 210, endFreq: 45, pitchDecay: 0.04, decay: 0.28, gainRatio: 1.7, cutoffRatio: 1.5, shapeAmount: 0.36, clickFreq: 2600, clickGainRatio: 0.22, clickDecay: 0.009 };
    case 'deep-sine':
    default:
      return { startFreq: 120, endFreq: 30, pitchDecay: 0.14, decay: 0.45, gainRatio: 1.8, cutoffRatio: 1 };
  }
}

export function getBassPlaybackVoices(variant: BassVariantId): readonly BassPlaybackVoice[] {
  switch (variant) {
    case 'sine-sub':
      return [
        { type: 'sine', octaveOffset: 0, gainRatio: 0.95, cutoffRatio: 0.7 },
        { type: 'triangle', octaveOffset: 12, gainRatio: 0.12, cutoffRatio: 0.85 },
      ];
    case 'triangle-round':
      return [
        { type: 'triangle', octaveOffset: 0, gainRatio: 0.95, cutoffRatio: 0.9 },
        { type: 'sine', octaveOffset: 12, gainRatio: 0.18, cutoffRatio: 1 },
      ];
    case 'filtered-pulse':
      return [
        { type: 'square', octaveOffset: 0, gainRatio: 0.8, cutoffRatio: 0.75, sweep: { startRatio: 1.28, endRatio: 0.72 }, shapeAmount: 0.08 },
        { type: 'triangle', octaveOffset: 12, gainRatio: 0.16, cutoffRatio: 0.9 },
      ];
    case 'acid-round':
      return [
        { type: 'square', octaveOffset: 0, gainRatio: 0.72, cutoffRatio: 1.35, sweep: { startRatio: 1.35, endRatio: 0.62 }, shapeAmount: 0.16 },
        { type: 'sawtooth', octaveOffset: 12, gainRatio: 0.16, cutoffRatio: 1.55, sweep: { startRatio: 1.2, endRatio: 0.7 }, shapeAmount: 0.1 },
      ];
    case 'dub-pluck-sub':
      return [
        { type: 'sine', octaveOffset: 0, gainRatio: 0.85, cutoffRatio: 0.62, sweep: { startRatio: 1.18, endRatio: 0.64 } },
        { type: 'triangle', octaveOffset: 12, gainRatio: 0.1, cutoffRatio: 0.75 },
      ];
    case 'wide-low-mid':
      return [
        { type: 'sine', octaveOffset: 0, gainRatio: 0.9, cutoffRatio: 0.78 },
        { type: 'sawtooth', octaveOffset: 12, gainRatio: 0.22, cutoffRatio: 1.1 },
        { type: 'triangle', octaveOffset: 19, gainRatio: 0.08, cutoffRatio: 1.2 },
      ];
    case 'distorted-rumble':
      return [
        { type: 'sawtooth', octaveOffset: 0, gainRatio: 0.82, cutoffRatio: 0.65, sweep: { startRatio: 0.9, endRatio: 0.54 }, shapeAmount: 0.3 },
        { type: 'square', octaveOffset: 12, gainRatio: 0.18, cutoffRatio: 0.85, shapeAmount: 0.2 },
      ];
    case 'sine-drop':
      return [
        { type: 'sine', octaveOffset: 0, gainRatio: 1.02, cutoffRatio: 0.72, sweep: { startRatio: 1.08, endRatio: 0.68 } },
        { type: 'triangle', octaveOffset: 12, gainRatio: 0.09, cutoffRatio: 0.9 },
      ];
    case 'saw-sub':
    default:
      return [
        { type: 'sawtooth', octaveOffset: 0, gainRatio: 1, cutoffRatio: 1 },
        { type: 'triangle', octaveOffset: 12, gainRatio: AUDIO_PARAMS.bass.octaveBlend, cutoffRatio: 1 },
      ];
  }
}

export function getNoisePlaybackProfile(variant: NoiseVariantId): NoisePlaybackProfile {
  switch (variant) {
    case 'closed-hat':
      return {
        freqs: [5200, 6500, 7800, 9100],
        type: (index) => (index % 2 === 0 ? 'square' : 'triangle'),
        durationRatio: 0.62,
        gainRatio: 0.85,
        cutoffRatio: 1.15,
        qRatio: 1.2,
      };
    case 'vinyl-floor':
      return {
        freqs: [1200, 2100, 3300, 4700],
        type: () => 'triangle',
        durationRatio: 1.9,
        gainRatio: 0.32,
        cutoffRatio: 0.75,
        qRatio: 0.75,
        useWhiteNoise: true,
      };
    case 'bandpass-tick':
      return {
        freqs: [3600, 4900, 6700, 8300],
        type: (index) => (index % 2 === 0 ? 'sawtooth' : 'square'),
        durationRatio: 0.42,
        gainRatio: 0.72,
        cutoffRatio: 0.95,
        qRatio: 1.7,
      };
    case 'noise-burst':
      return {
        freqs: [2800, 4500, 6800, 10000],
        type: () => 'square',
        durationRatio: 0.52,
        gainRatio: 0.85,
        cutoffRatio: 1.25,
        qRatio: 0.55,
      };
    case 'noise-floor':
      return {
        freqs: [1600, 2900, 4800, 7100],
        type: (index) => (index % 2 === 0 ? 'triangle' : 'sawtooth'),
        durationRatio: 1.04,  // slight overlap between loops for seamless join
        gainRatio: 0.52,
        cutoffRatio: 0.82,
        qRatio: 0.45,
        continuous: true,
      };
    case 'resonant-crack':
      return {
        freqs: [4200, 5800, 8600, 11500],
        type: (index) => (index % 2 === 0 ? 'sawtooth' : 'square'),
        durationRatio: 0.28,
        gainRatio: 0.84,
        cutoffRatio: 1.05,
        qRatio: 2.8,
      };
    case 'shaker-dust':
      return {
        freqs: [6200, 7600, 9100, 10800],
        type: (index) => (index % 2 === 0 ? 'triangle' : 'square'),
        durationRatio: 0.34,
        gainRatio: 0.46,
        cutoffRatio: 1.28,
        qRatio: 1.45,
      };
    case 'open-air-hat':
      return {
        freqs: [5400, 7200, 9400, 11800],
        type: (index) => (index % 2 === 0 ? 'sawtooth' : 'triangle'),
        durationRatio: 1.55,
        gainRatio: 0.64,
        cutoffRatio: 1.42,
        qRatio: 0.7,
      };
    case 'metal-tick':
      return {
        freqs: [7200, 9100, 12400, 13800],
        type: (index) => (index % 2 === 0 ? 'square' : 'sawtooth'),
        durationRatio: 0.22,
        gainRatio: 0.62,
        cutoffRatio: 1.2,
        qRatio: 3.4,
      };
    case 'sidechain-floor':
      return {
        freqs: [900, 1700, 3400, 6200],
        type: (index) => (index % 2 === 0 ? 'triangle' : 'sawtooth'),
        durationRatio: 1.03,
        gainRatio: 0.42,
        cutoffRatio: 0.78,
        qRatio: 0.4,
        continuous: true,
      };
    case 'tape-clicks':
      return {
        freqs: [1800, 2600, 3900, 5400],
        type: (index) => (index % 2 === 0 ? 'square' : 'triangle'),
        durationRatio: 0.26,
        gainRatio: 0.5,
        cutoffRatio: 0.92,
        qRatio: 1.9,
      };
    case 'generative-noise':
      return {
        freqs: [],
        type: () => 'triangle',
        durationRatio: 2.0,
        gainRatio: 0.4,
        cutoffRatio: 0.6,
        qRatio: 0.6,
        continuous: true,
        useWhiteNoise: true,
      };
    case 'tape-hiss':
    default:
      return {
        freqs: [4300, 5200, 6100, 7600],
        type: (index) => (index % 2 === 0 ? 'triangle' : 'sawtooth'),
        durationRatio: 1,
        gainRatio: 0.78,
        cutoffRatio: 1,
        qRatio: 1,
      };
  }
}

export function getStabPlaybackProfile(variant: StabVariantId): StabPlaybackProfile {
  switch (variant) {
    case 'dub-minor':
      return {
        notes: (midiNotes) => [midiNotes[0], midiNotes[0] + 3, midiNotes[0] + 7],
        durationRatio: 1.2,
        gainRatio: 0.95,
        cutoffRatio: 0.7,
        qRatio: 1.2,
        delaySendRatio: 1.3,
        repeatFilterRatio: 0.7,
        repeatDurationRatio: 1.1,
      };
    case 'dub-sus4':
      return {
        notes: (midiNotes) => [midiNotes[0], midiNotes[0] + 5, midiNotes[0] + 7],
        durationRatio: 1.2,
        gainRatio: 0.95,
        cutoffRatio: 0.75,
        qRatio: 1.1,
        delaySendRatio: 1.3,
        repeatFilterRatio: 0.72,
        repeatDurationRatio: 1.1,
      };
    case 'dub-minor9':
      return {
        notes: (midiNotes) => [midiNotes[0], midiNotes[0] + 7, midiNotes[0] + 10, midiNotes[0] + 14],
        durationRatio: 1.4,
        gainRatio: 0.85,
        cutoffRatio: 0.65,
        qRatio: 1.3,
        delaySendRatio: 1.4,
        repeatFilterRatio: 0.65,
        repeatDurationRatio: 1.2,
      };
    case 'rootless-voicing':
      return {
        notes: (midiNotes) => (midiNotes.length > 2 ? midiNotes.slice(1) : midiNotes),
        durationRatio: 0.9,
        gainRatio: 0.92,
        cutoffRatio: 0.9,
        qRatio: 1.05,
        delaySendRatio: 1.08,
        repeatFilterRatio: 0.78,
        repeatDurationRatio: 0.92,
      };
    case 'octave-shadow':
      return {
        notes: (midiNotes) => midiNotes,
        durationRatio: 1,
        gainRatio: 0.82,
        cutoffRatio: 1.08,
        qRatio: 0.95,
        octaveShadow: true,
        delaySendRatio: 1.18,
        repeatFilterRatio: 0.74,
        repeatDurationRatio: 1.08,
      };
    case 'short-muted':
      return {
        notes: (midiNotes) => midiNotes,
        durationRatio: 0.46,
        gainRatio: 0.86,
        cutoffRatio: 0.62,
        qRatio: 1.25,
        delaySendRatio: 0.68,
        repeatFilterRatio: 0.62,
        repeatDurationRatio: 0.72,
      };
    case 'long-smear':
      return {
        notes: (midiNotes) => midiNotes,
        durationRatio: 1.65,
        gainRatio: 0.72,
        cutoffRatio: 0.78,
        qRatio: 0.82,
        delaySendRatio: 1.35,
        repeatFilterRatio: 0.72,
        repeatDurationRatio: 1.18,
        repeatShapeAmount: 0.08,
      };
    case 'inverted-stab':
      return {
        notes: (midiNotes) => (
          midiNotes.length > 2 ? [...midiNotes.slice(1), midiNotes[0] + 12] : midiNotes
        ),
        durationRatio: 1,
        gainRatio: 0.9,
        cutoffRatio: 0.96,
        qRatio: 1,
        delaySendRatio: 1.02,
        repeatFilterRatio: 0.76,
        repeatDurationRatio: 1,
      };
    default:
      return {
        notes: (midiNotes) => midiNotes,
        durationRatio: 1,
        gainRatio: 1,
        cutoffRatio: 1,
        qRatio: 1,
        delaySendRatio: variant === 'bell-like' ? 0.72 : 1,
        repeatFilterRatio: variant === 'bell-like' ? 0.82 : 0.76,
        repeatDurationRatio: variant === 'sampled-chord-like' ? 0.84 : 1,
        repeatShapeAmount: variant === 'wide-detuned' ? 0.06 : undefined,
      };
  }
}

export function getEffectiveDubDelay(delay: DubDelaySpec, variant: SpaceVariantId): DubDelaySpec {
  const capFeedback = (feedbackGain: number) => Math.min(Math.max(feedbackGain, 0.12), 0.6);
  switch (variant) {
    case 'analog-dub-delay':
      return { ...delay, analog: true, repeats: 0, feedbackGain: Math.min(capFeedback(delay.feedbackGain), 0.55) };
    case 'tape-echo-dub':
      return { ...delay, analog: true, repeats: 0, feedbackGain: Math.min(capFeedback(delay.feedbackGain), 0.60) };
    case 'short-dub':
      return { ...delay, repeats: Math.min(delay.repeats, 2), feedbackGain: Math.min(capFeedback(delay.feedbackGain), 0.28) };
    case 'deep-feedback':
      return { ...delay, repeats: Math.max(delay.repeats, 3), feedbackGain: capFeedback(Math.max(delay.feedbackGain, 0.38)) };
    case 'spring-style':
      return { ...delay, repeats: Math.max(delay.repeats, 3), feedbackGain: capFeedback(Math.max(delay.feedbackGain, 0.34)) };
    case 'dark-plate':
      return { ...delay, repeats: Math.max(delay.repeats, 3), feedbackGain: capFeedback(Math.max(delay.feedbackGain, 0.36)) };
    default:
      return { ...delay, feedbackGain: capFeedback(delay.feedbackGain) };
  }
}
