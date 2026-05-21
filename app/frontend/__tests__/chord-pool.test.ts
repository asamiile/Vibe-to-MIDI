import {
  DEFAULT_CHORD_POOL,
  applyChordCandidate,
  chordCandidateToBassNotes,
  chordCandidateToSpec,
  pickChordCandidate,
} from '../src/features/vibe-map/chord-pool';
import { getMusicalSuggestion } from '../src/features/vibe-map/engine';

describe('chord pool', () => {
  it('keeps reusable chord candidates as data', () => {
    expect(DEFAULT_CHORD_POOL.length).toBeGreaterThanOrEqual(4);
    DEFAULT_CHORD_POOL.forEach((chord) => {
      expect(chord.label.length).toBeGreaterThan(0);
      expect(chord.root.length).toBeGreaterThan(0);
      expect(chord.bassOctave).toBeGreaterThanOrEqual(1);
    });
  });

  it('picks a deterministic chord with injected random', () => {
    expect(pickChordCandidate(DEFAULT_CHORD_POOL, () => 0)).toBe(DEFAULT_CHORD_POOL[0]);
  });

  it('converts a chord candidate to playback fields', () => {
    const chord = DEFAULT_CHORD_POOL[0];

    expect(chordCandidateToSpec(chord)).toEqual({
      root: chord.root,
      quality: chord.quality,
    });
    expect(chordCandidateToBassNotes(chord)).toEqual([36, 48]);
  });

  it('applies a selected chord to a playback suggestion', () => {
    const base = getMusicalSuggestion('deep');
    const chord = DEFAULT_CHORD_POOL[1];
    const suggestion = applyChordCandidate(base, chord, { forceMelody: true });

    expect(suggestion.chord).toEqual(chordCandidateToSpec(chord));
    expect(suggestion.bassNotes).toEqual(chordCandidateToBassNotes(chord));
    expect(suggestion.melodySuggested).toBe(true);
  });
});
