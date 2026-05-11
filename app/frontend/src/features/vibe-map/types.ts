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

export type SoundRole = 'bass' | 'pad' | 'lead' | 'drum';

export interface SoundLayer {
  role: SoundRole;
  descriptor: string;
  optional?: true;
}

export interface MusicalSuggestion {
  vibeId: VibeId;
  scale: ScaleSpec;
  chord: ChordSpec;
  bassNotes: readonly number[];
  rhythmPattern: RhythmPattern;
  soundLayers: readonly SoundLayer[];
  bpmRange: readonly [number, number];
}
