import type { ChordQuality, ChordSpec, MusicalSuggestion } from './types';
import { noteNameToMidi } from '../../lib/notes';

export interface ChordCandidate {
  id: string;
  label: string;
  root: string;
  quality: ChordQuality;
  bassOctave: number;
}

export const DEFAULT_CHORD_POOL: readonly ChordCandidate[] = [
  { id: 'c-minor7', label: 'C MINOR7', root: 'C', quality: 'minor7', bassOctave: 2 },
  { id: 'd-minor9', label: 'D MINOR9', root: 'D', quality: 'minor9', bassOctave: 2 },
  { id: 'f-sus4', label: 'F SUS4', root: 'F', quality: 'sus4', bassOctave: 2 },
  { id: 'g-minor7', label: 'G MINOR7', root: 'G', quality: 'minor7', bassOctave: 1 },
  { id: 'bb-major7', label: 'BB MAJOR7', root: 'Bb', quality: 'major7', bassOctave: 1 },
  { id: 'a-minor', label: 'A MINOR', root: 'A', quality: 'minor', bassOctave: 1 },
];

export function pickChordCandidate(
  chordPool: readonly ChordCandidate[],
  random: () => number = Math.random
): ChordCandidate {
  const source = chordPool.length > 0 ? chordPool : DEFAULT_CHORD_POOL;
  const index = Math.floor(random() * source.length);
  return source[Math.min(index, source.length - 1)];
}

export function chordCandidateToSpec(chord: ChordCandidate): ChordSpec {
  return {
    root: chord.root,
    quality: chord.quality,
  };
}

export function chordCandidateToBassNotes(chord: ChordCandidate): readonly number[] {
  const root = noteNameToMidi(chord.root, chord.bassOctave);
  return [root, root + 12];
}

export function applyChordCandidate(
  suggestion: MusicalSuggestion,
  chord: ChordCandidate,
  options: { forceMelody?: boolean } = {}
): MusicalSuggestion {
  return {
    ...suggestion,
    chord: chordCandidateToSpec(chord),
    bassNotes: chordCandidateToBassNotes(chord),
    melodySuggested: options.forceMelody ? true : suggestion.melodySuggested,
  };
}
