import {
  RANDOM_BPM_MAX,
  RANDOM_BPM_MIN,
  pickRandomBpm,
} from '../src/features/vibe-map/random-bpm';

describe('pickRandomBpm', () => {
  it('uses 112 as the lower bound', () => {
    expect(pickRandomBpm(() => 0)).toBe(RANDOM_BPM_MIN);
  });

  it('uses 124 as the upper bound', () => {
    expect(pickRandomBpm(() => 0.9999)).toBe(RANDOM_BPM_MAX);
  });

  it('always returns an integer inside the playback range', () => {
    for (let i = 0; i < 100; i += 1) {
      const bpm = pickRandomBpm(() => i / 100);
      expect(Number.isInteger(bpm)).toBe(true);
      expect(bpm).toBeGreaterThanOrEqual(112);
      expect(bpm).toBeLessThanOrEqual(124);
    }
  });
});
