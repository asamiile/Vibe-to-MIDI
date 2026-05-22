import {
  DEFAULT_SOUND_MIX,
  getBassPlaybackVoices,
  getEffectiveDubDelay,
  getKickPlaybackProfile,
  getNoisePlaybackProfile,
  getStabPlaybackProfile,
} from '../src/features/vibe-map/sound-playback';
import type {
  SpaceVariantId,
} from '../src/features/vibe-map/sound-palette';
import {
  BASS_VARIANT_IDS,
  KICK_VARIANT_IDS,
  NOISE_VARIANT_IDS,
  STAB_VARIANT_IDS,
} from '../src/features/vibe-map/sound-palette';

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

  it.each(KICK_VARIANT_IDS)('returns a valid kick profile for %s', (variant) => {
    const profile = getKickPlaybackProfile(variant);

    expect(profile.startFreq).toBeGreaterThan(profile.endFreq);
    expect(profile.pitchDecay).toBeGreaterThan(0);
    expect(profile.decay).toBeGreaterThan(profile.pitchDecay);
    expect(profile.gainRatio).toBeGreaterThan(0);
    expect(profile.cutoffRatio).toBeGreaterThan(0);
    if (profile.clickGainRatio !== undefined) {
      expect(profile.clickFreq).toBeGreaterThan(0);
      expect(profile.clickDecay).toBeGreaterThan(0);
    }
  });

  it.each(BASS_VARIANT_IDS)('returns usable bass voices for %s', (variant) => {
    const voices = getBassPlaybackVoices(variant);

    expect(voices.length).toBeGreaterThanOrEqual(1);
    voices.forEach((voice) => {
      expect(['sine', 'triangle', 'sawtooth', 'square']).toContain(voice.type);
      expect(voice.gainRatio).toBeGreaterThan(0);
      expect(voice.cutoffRatio).toBeGreaterThan(0);
      if (voice.sweep) {
        expect(voice.sweep.startRatio).toBeGreaterThan(0);
        expect(voice.sweep.endRatio).toBeGreaterThan(0);
      }
      if (voice.shapeAmount !== undefined) {
        expect(voice.shapeAmount).toBeGreaterThan(0);
        expect(voice.shapeAmount).toBeLessThanOrEqual(0.55);
      }
    });
  });

  it.each(NOISE_VARIANT_IDS)('keeps noise profile gain controlled for %s', (variant) => {
    const profile = getNoisePlaybackProfile(variant);

    expect(profile.freqs.length).toBeGreaterThan(0);
    expect(profile.durationRatio).toBeGreaterThan(0);
    expect(profile.gainRatio).toBeGreaterThan(0);
    expect(profile.gainRatio).toBeLessThanOrEqual(0.85);
    expect(profile.cutoffRatio).toBeGreaterThan(0);
    expect(profile.qRatio).toBeGreaterThan(0);
  });

  it.each(STAB_VARIANT_IDS)('returns a usable stab profile for %s', (variant) => {
    const profile = getStabPlaybackProfile(variant);
    const notes = profile.notes([48, 51, 55, 58]);

    expect(notes.length).toBeGreaterThan(0);
    notes.forEach((midi) => {
      expect(midi).toBeGreaterThanOrEqual(48);
      expect(midi).toBeLessThanOrEqual(70);
    });
    expect(profile.durationRatio).toBeGreaterThan(0);
    expect(profile.gainRatio).toBeGreaterThan(0);
    expect(profile.cutoffRatio).toBeGreaterThan(0);
    expect(profile.qRatio).toBeGreaterThan(0);
    expect(profile.delaySendRatio).toBeGreaterThan(0);
    expect(profile.repeatFilterRatio).toBeGreaterThan(0);
    expect(profile.repeatFilterRatio).toBeLessThanOrEqual(1);
    expect(profile.repeatDurationRatio).toBeGreaterThan(0);
    if (profile.repeatShapeAmount !== undefined) {
      expect(profile.repeatShapeAmount).toBeGreaterThan(0);
      expect(profile.repeatShapeAmount).toBeLessThanOrEqual(0.55);
    }
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

  it('caps high feedback to keep delay repeats controlled', () => {
    expect(getEffectiveDubDelay(
      { repeats: 5, stepOffset: 3, feedbackGain: 0.9 },
      'deep-feedback'
    ).feedbackGain).toBe(0.46);
  });
});
