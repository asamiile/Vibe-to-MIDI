import type { ScaleMode } from '../features/vibe-map/types';
import { noteNameToMidi, normalizeNoteName } from './notes';

// Intervals in semitones from root for each mode (one octave)
const MODE_INTERVALS: Record<ScaleMode, readonly number[]> = {
  major:          [0, 2, 4, 5, 7, 9, 11],
  minor:          [0, 2, 3, 5, 7, 8, 10],
  dorian:         [0, 2, 3, 5, 7, 9, 10],
  phrygian:       [0, 1, 3, 5, 7, 8, 10],
  lydian:         [0, 2, 4, 6, 7, 9, 11],
  mixolydian:     [0, 2, 4, 5, 7, 9, 10],
  locrian:        [0, 1, 3, 5, 6, 8, 10],
  harmonic_minor: [0, 2, 3, 5, 7, 8, 11],
  whole_tone:     [0, 2, 4, 6, 8, 10],
};

export function getModeIntervals(mode: ScaleMode): readonly number[] {
  return MODE_INTERVALS[mode];
}

export function getScaleNotes(root: string, mode: ScaleMode, octave = 3): number[] {
  const rootMidi = noteNameToMidi(normalizeNoteName(root), octave);
  return MODE_INTERVALS[mode].map((interval) => rootMidi + interval);
}
