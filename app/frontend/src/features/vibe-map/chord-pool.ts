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
  // Minor / dark
  { id: 'c-minor7',     label: 'C MINOR7',   root: 'C',  quality: 'minor7',    bassOctave: 2 },
  { id: 'd-minor9',     label: 'D MINOR9',   root: 'D',  quality: 'minor9',    bassOctave: 2 },
  { id: 'eb-minor7',    label: 'EB MINOR7',  root: 'Eb', quality: 'minor7',    bassOctave: 2 },
  { id: 'g-minor7',     label: 'G MINOR7',   root: 'G',  quality: 'minor7',    bassOctave: 1 },
  { id: 'a-minor',      label: 'A MINOR',    root: 'A',  quality: 'minor',     bassOctave: 1 },
  { id: 'e-minor9',     label: 'E MINOR9',   root: 'E',  quality: 'minor9',    bassOctave: 2 },
  // Major / bright
  { id: 'bb-major7',    label: 'BB MAJOR7',  root: 'Bb', quality: 'major7',    bassOctave: 1 },
  { id: 'ab-major7',    label: 'AB MAJOR7',  root: 'Ab', quality: 'major7',    bassOctave: 1 },
  // Open / suspended
  { id: 'f-sus4',       label: 'F SUS4',     root: 'F',  quality: 'sus4',      bassOctave: 2 },
  { id: 'c-sus2',       label: 'C SUS2',     root: 'C',  quality: 'sus2',      bassOctave: 2 },
  // Tension
  { id: 'b-dominant7',  label: 'B DOM7',     root: 'B',  quality: 'dominant7', bassOctave: 1 },
  { id: 'fs-dim7',      label: 'F# DIM7',    root: 'F#', quality: 'dim7',      bassOctave: 2 },
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
