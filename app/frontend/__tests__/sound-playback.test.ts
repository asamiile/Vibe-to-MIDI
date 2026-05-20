import {
  DEFAULT_SOUND_MIX,
  getBassPlaybackVoices,
  getEffectiveDubDelay,
  getKickPlaybackProfile,
  getNoisePlaybackProfile,
} from '../src/features/vibe-map/sound-playback';
import type {
  BassVariantId,
  KickVariantId,
  NoiseVariantId,
  SpaceVariantId,
} from '../src/features/vibe-map/sound-palette';

const KICK_VARIANTS: readonly KickVariantId[] = [
  'deep-sine',
  'soft-909',
  'muffled-room',
  'saturated-thump',
];

const BASS_VARIANTS: readonly BassVariantId[] = [
  'saw-sub',
  'sine-sub',
  'triangle-round',
  'filtered-pulse',
];

const NOISE_VARIANTS: readonly NoiseVariantId[] = [
  'tape-hiss',
  'closed-hat',
  'vinyl-floor',
  'bandpass-tick',
];

const SPACE_VARIANTS: readonly SpaceVariantId[] = [
  'short-dub',
  'deep-feedback',
  'spring-style',
  'dark-plate',
];

describe('sound playback profiles', () => {
  it('uses neutral default track mix levels', () => {
    expect(DEFAULT_SOUND_MIX).toEqual({
      kick: 1,
      bass: 1,
      noise: 1,
      stab: 1,
    });
  });

  it.each(KICK_VARIANTS)('returns a valid kick profile for %s', (variant) => {
    const profile = getKickPlaybackProfile(variant);

    expect(profile.startFreq).toBeGreaterThan(profile.endFreq);
    expect(profile.pitchDecay).toBeGreaterThan(0);
    expect(profile.decay).toBeGreaterThan(profile.pitchDecay);
    expect(profile.gainRatio).toBeGreaterThan(0);
    expect(profile.cutoffRatio).toBeGreaterThan(0);
  });

  it.each(BASS_VARIANTS)('returns usable bass voices for %s', (variant) => {
    const voices = getBassPlaybackVoices(variant);

    expect(voices.length).toBeGreaterThanOrEqual(1);
    voices.forEach((voice) => {
      expect(['sine', 'triangle', 'sawtooth', 'square']).toContain(voice.type);
      expect(voice.gainRatio).toBeGreaterThan(0);
      expect(voice.cutoffRatio).toBeGreaterThan(0);
    });
  });

  it.each(NOISE_VARIANTS)('keeps noise profile gain controlled for %s', (variant) => {
    const profile = getNoisePlaybackProfile(variant);

    expect(profile.freqs.length).toBeGreaterThan(0);
    expect(profile.durationRatio).toBeGreaterThan(0);
    expect(profile.gainRatio).toBeGreaterThan(0);
    expect(profile.gainRatio).toBeLessThanOrEqual(0.85);
    expect(profile.cutoffRatio).toBeGreaterThan(0);
    expect(profile.qRatio).toBeGreaterThan(0);
  });

  it.each(SPACE_VARIANTS)('returns a bounded delay profile for %s', (variant) => {
    const delay = getEffectiveDubDelay(
      { repeats: 3, stepOffset: 2, feedbackGain: 0.32 },
      variant
    );

    expect(delay.repeats).toBeGreaterThan(0);
    expect(delay.stepOffset).toBe(2);
    expect(delay.feedbackGain).toBeGreaterThan(0);
    expect(delay.feedbackGain).toBeLessThanOrEqual(0.46);
  });

  it('short dub caps repeats and feedback', () => {
    expect(getEffectiveDubDelay(
      { repeats: 5, stepOffset: 3, feedbackGain: 0.5 },
      'short-dub'
    )).toEqual({ repeats: 2, stepOffset: 3, feedbackGain: 0.28 });
  });

  it('deep feedback preserves or increases repeats and feedback floor', () => {
    expect(getEffectiveDubDelay(
      { repeats: 1, stepOffset: 3, feedbackGain: 0.2 },
      'deep-feedback'
    )).toEqual({ repeats: 3, stepOffset: 3, feedbackGain: 0.38 });
  });
});
