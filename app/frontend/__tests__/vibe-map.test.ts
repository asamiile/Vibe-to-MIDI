import { getMusicalSuggestion, getAllVibeIds } from '../src/features/vibe-map/engine';
import type { VibeId } from '../src/features/vibe-map/types';

const ALL_VIBES: VibeId[] = [
  'dark', 'floating', 'tense', 'repetitive', 'underground',
  'wide', 'hypnotic', 'metallic', 'warm', 'unstable',
  'deep', 'rolling', 'cavernous', 'dry', 'groovy', 'nostalgic',
  'retrowave', 'gritty', 'euphoric', 'cinematic', 'summer', 'winter',
];

describe('getAllVibeIds', () => {
  it('returns all 22 vibe ids', () => {
    expect(getAllVibeIds()).toHaveLength(22);
  });
});

describe('getMusicalSuggestion', () => {
  it.each(ALL_VIBES)('%s — returns a valid MusicalSuggestion', (vibeId) => {
    const s = getMusicalSuggestion(vibeId);

    expect(s.vibeId).toBe(vibeId);
    expect(s.scale.root).toBeTruthy();
    expect(s.scale.mode).toBeTruthy();

    expect(s.chord.root).toBeTruthy();
    expect(s.chord.quality).toBeTruthy();

    expect(s.bassNotes.length).toBeGreaterThanOrEqual(2);
    s.bassNotes.forEach((n) => {
      expect(n).toBeGreaterThanOrEqual(24);  // C1
      expect(n).toBeLessThanOrEqual(72);     // C5
    });

    expect(s.rhythmPattern).toHaveLength(16);
    expect(s.rhythmPattern.some(Boolean)).toBe(true);
    expect(s.noisePattern).toHaveLength(16);
    expect(s.chordStabPattern).toHaveLength(16);
    expect(s.chordStabPattern?.some(Boolean)).toBe(true);
    expect(s.chordStabFilter?.cutoff).toBeGreaterThan(0);
    expect(s.dubDelay?.repeats).toBeGreaterThan(0);

    expect(s.soundLayers.length).toBeGreaterThanOrEqual(2);
    s.soundLayers.forEach((layer) => {
      expect(['bass', 'pad', 'lead', 'drum', 'arp', 'pluck', 'keys']).toContain(layer.role);
      expect(layer.descriptor.length).toBeGreaterThan(0);
    });
    if (s.soundVariants) {
      expect(s.soundVariants.kick).toBeTruthy();
      expect(s.soundVariants.bass).toBeTruthy();
      expect(s.soundVariants.noise).toBeTruthy();
      expect(s.soundVariants.stab).toBeTruthy();
      expect(s.soundVariants.space).toBeTruthy();
    }

    const [min, max] = s.bpmRange;
    expect(min).toBeGreaterThan(0);
    expect(max).toBeGreaterThan(min);
  });
});
