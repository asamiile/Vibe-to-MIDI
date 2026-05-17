import { AUDIO_PARAMS } from '../audio-engine/constants';
import type {
  BassVariantId,
  KickVariantId,
  NoiseVariantId,
  SpaceVariantId,
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
}

export interface BassPlaybackVoice {
  type: OscillatorType;
  octaveOffset: number;
  gainRatio: number;
  cutoffRatio: number;
}

export interface NoisePlaybackProfile {
  freqs: readonly number[];
  type: (index: number) => OscillatorType;
  durationRatio: number;
  gainRatio: number;
  cutoffRatio: number;
  qRatio: number;
}

export interface DubDelaySpec {
  repeats: number;
  stepOffset: number;
  feedbackGain: number;
}

export function getKickPlaybackProfile(variant: KickVariantId): KickPlaybackProfile {
  switch (variant) {
    case 'soft-909':
      return { startFreq: 105, endFreq: 38, pitchDecay: 0.09, decay: 0.34, gainRatio: 1.55, cutoffRatio: 1.15 };
    case 'muffled-room':
      return { startFreq: 95, endFreq: 28, pitchDecay: 0.18, decay: 0.55, gainRatio: 1.45, cutoffRatio: 0.75 };
    case 'saturated-thump':
      return { startFreq: 135, endFreq: 35, pitchDecay: 0.11, decay: 0.42, gainRatio: 1.95, cutoffRatio: 0.95 };
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
        { type: 'square', octaveOffset: 0, gainRatio: 0.8, cutoffRatio: 0.75 },
        { type: 'triangle', octaveOffset: 12, gainRatio: 0.16, cutoffRatio: 0.9 },
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

export function getEffectiveDubDelay(delay: DubDelaySpec, variant: SpaceVariantId): DubDelaySpec {
  switch (variant) {
    case 'short-dub':
      return { ...delay, repeats: Math.min(delay.repeats, 2), feedbackGain: Math.min(delay.feedbackGain, 0.28) };
    case 'deep-feedback':
      return { ...delay, repeats: Math.max(delay.repeats, 3), feedbackGain: Math.max(delay.feedbackGain, 0.38) };
    case 'spring-style':
      return { ...delay, repeats: Math.max(delay.repeats, 3), feedbackGain: Math.max(delay.feedbackGain, 0.34) };
    case 'dark-plate':
      return { ...delay, repeats: Math.max(delay.repeats, 3), feedbackGain: Math.min(Math.max(delay.feedbackGain, 0.36), 0.46) };
    default:
      return delay;
  }
}
