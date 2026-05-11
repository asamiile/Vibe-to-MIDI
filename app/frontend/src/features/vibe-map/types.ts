export type VibeId =
  | 'dark'
  | 'floating'
  | 'tense'
  | 'repetitive'
  | 'underground'
  | 'wide'
  | 'hypnotic'
  | 'metallic'
  | 'warm'
  | 'unstable';

export type ScaleMode =
  | 'minor'
  | 'major'
  | 'dorian'
  | 'phrygian'
  | 'lydian'
  | 'mixolydian'
  | 'locrian'
  | 'harmonic_minor'
  | 'whole_tone';

export type ChordQuality =
  | 'minor'
  | 'major'
  | 'diminished'
  | 'minor7'
  | 'major7'
  | 'dominant7'
  | 'sus4'
  | 'minor9';

export interface ScaleSpec {
  root: string;
  mode: ScaleMode;
}

export interface ChordSpec {
  root: string;
  quality: ChordQuality;
}

export type RhythmPattern = readonly boolean[];

export interface MusicalSuggestion {
  vibeId: VibeId;
  scale: ScaleSpec;
  chord: ChordSpec;
  bassNotes: readonly number[];
  rhythmPattern: RhythmPattern;
  soundHint: string;
  bpmRange: readonly [number, number];
}
