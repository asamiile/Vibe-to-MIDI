import type { ChordQuality } from '../features/vibe-map/types';
import { noteNameToMidi, normalizeNoteName } from './notes';

// Intervals in semitones from root
const CHORD_INTERVALS: Record<ChordQuality, readonly number[]> = {
  major:      [0, 4, 7],
  minor:      [0, 3, 7],
  diminished: [0, 3, 6],
  minor7:     [0, 3, 7, 10],
  major7:     [0, 4, 7, 11],
  dominant7:  [0, 4, 7, 10],
  sus4:       [0, 5, 7],
  minor9:     [0, 3, 7, 10, 14],
};

export function getChordIntervals(quality: ChordQuality): readonly number[] {
  return CHORD_INTERVALS[quality];
}

export function getChordNotes(root: string, quality: ChordQuality, octave = 3): number[] {
  const rootMidi = noteNameToMidi(normalizeNoteName(root), octave);
  return CHORD_INTERVALS[quality].map((interval) => rootMidi + interval);
}
