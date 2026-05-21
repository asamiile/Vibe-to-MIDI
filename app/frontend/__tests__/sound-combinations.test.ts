import {
  DEFAULT_SOUND_CONFIGURATIONS,
  buildRandomSoundCombination,
} from '../src/features/vibe-map/sound-combinations';

describe('sound combinations', () => {
  it('keeps playable sound configurations as data', () => {
    expect(DEFAULT_SOUND_CONFIGURATIONS).toEqual([
      { id: 'kick', label: 'KICK', layer: 'kick' },
      { id: 'bass', label: 'BASS', layer: 'bass' },
      { id: 'noise', label: 'NOISE', layer: 'noise' },
      { id: 'stab', label: 'STAB', layer: 'melody' },
    ]);
  });

  it('builds a random sound-only layer combination', () => {
    const combination = buildRandomSoundCombination(
      DEFAULT_SOUND_CONFIGURATIONS,
      () => 0.99
    );

    expect(combination.layers.length).toBeGreaterThanOrEqual(2);
    expect(combination.layers.length).toBeLessThanOrEqual(DEFAULT_SOUND_CONFIGURATIONS.length);
    combination.layers.forEach((layer) => {
      expect(['kick', 'bass', 'noise', 'melody']).toContain(layer);
    });
    expect(combination.label).toContain(' + ');
  });

  it('supports a single sound configuration', () => {
    const combination = buildRandomSoundCombination([
      { id: 'kick', label: 'KICK', layer: 'kick' },
    ]);

    expect(combination).toEqual({
      id: 'kick',
      label: 'KICK',
      layers: ['kick'],
    });
  });
});
