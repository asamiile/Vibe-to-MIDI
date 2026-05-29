import { getMusicalSuggestion } from '../src/features/vibe-map/engine';
import { DEFAULT_CHORD_POOL } from '../src/features/vibe-map/chord-pool';
import { DEFAULT_SOUND_CONFIGURATIONS, buildRandomSoundCombination } from '../src/features/vibe-map/sound-combinations';
import type { SavedIdea } from '../src/features/saved-ideas/types';

function makeSavedIdea(): SavedIdea {
  return {
    id: '1234567890-abc',
    savedAt: 1717000000000,
    suggestion: getMusicalSuggestion('dark'),
    activeBpm: 130,
    activePan: { bass: -0.3, noise: 0.3, stab: 0 },
    activeLayers: ['kick', 'bass', 'noise'],
    soundCombination: buildRandomSoundCombination(DEFAULT_SOUND_CONFIGURATIONS),
    chord: DEFAULT_CHORD_POOL[0],
  };
}

describe('SavedIdea serialization', () => {
  it('round-trips through JSON without data loss', () => {
    const idea = makeSavedIdea();
    const json = JSON.stringify(idea);
    const restored = JSON.parse(json) as SavedIdea;

    expect(restored.id).toBe(idea.id);
    expect(restored.savedAt).toBe(idea.savedAt);
    expect(restored.activeBpm).toBe(idea.activeBpm);
    expect(restored.activeLayers).toEqual(idea.activeLayers);
    expect(restored.activePan).toEqual(idea.activePan);
  });

  it('restores activeLayers array into a Set correctly', () => {
    const idea = makeSavedIdea();
    const json = JSON.stringify(idea);
    const restored = JSON.parse(json) as SavedIdea;

    const layerSet = new Set(restored.activeLayers);
    expect(layerSet.has('kick')).toBe(true);
    expect(layerSet.has('bass')).toBe(true);
    expect(layerSet.has('noise')).toBe(true);
    expect(layerSet.has('melody')).toBe(false);
  });

  it('preserves suggestion scale and chord data', () => {
    const idea = makeSavedIdea();
    const json = JSON.stringify(idea);
    const restored = JSON.parse(json) as SavedIdea;

    expect(restored.suggestion.scale.root).toBe(idea.suggestion.scale.root);
    expect(restored.suggestion.scale.mode).toBe(idea.suggestion.scale.mode);
    expect(restored.suggestion.chord.root).toBe(idea.suggestion.chord.root);
    expect(restored.suggestion.bassNotes).toEqual([...idea.suggestion.bassNotes]);
  });

  it('preserves rhythmPattern length', () => {
    const idea = makeSavedIdea();
    const json = JSON.stringify(idea);
    const restored = JSON.parse(json) as SavedIdea;

    expect(restored.suggestion.rhythmPattern).toHaveLength(16);
  });
});
