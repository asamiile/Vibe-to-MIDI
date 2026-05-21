import {
  KICK_RHYTHM_PROFILES,
  pickKickRhythmProfile,
} from '../src/features/vibe-map/kick-rhythm';

describe('kick rhythm profiles', () => {
  it('keeps every kick profile as a playable 16-step pattern', () => {
    expect(KICK_RHYTHM_PROFILES.length).toBeGreaterThanOrEqual(6);

    KICK_RHYTHM_PROFILES.forEach((profile) => {
      expect(profile.id).toBeTruthy();
      expect(profile.label).toBeTruthy();
      expect(profile.pattern).toHaveLength(16);
      expect(profile.pattern.some(Boolean)).toBe(true);
    });
  });

  it('picks profiles from the bounded profile list', () => {
    expect(pickKickRhythmProfile(() => 0)).toBe(KICK_RHYTHM_PROFILES[0]);
    expect(pickKickRhythmProfile(() => 0.999)).toBe(KICK_RHYTHM_PROFILES[KICK_RHYTHM_PROFILES.length - 1]);
  });
});
