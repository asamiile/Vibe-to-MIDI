import type { SoundVariantSelection } from './sound-palette';

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
  | 'deep'
  | 'rolling'
  | 'cavernous'
  | 'dry'
  | 'unstable'
  | 'groovy'
  | 'nostalgic'
  | 'retrowave'
  | 'gritty'
  | 'euphoric'
  | 'cinematic'
  | 'summer'
  | 'winter'
  | 'corroded'
  | 'static'
  | 'raw';

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

export type SoundRole = 'bass' | 'pad' | 'lead' | 'drum' | 'arp' | 'pluck' | 'keys';

export interface SoundLayer {
  role: SoundRole;
  descriptor: string;
  optional?: true;
}

export interface KickFilter {
  cutoff: number;
  q: number;
}

export interface BassFilter {
  cutoff: number;
  q: number;
}

export interface NoiseFilter {
  cutoff: number;  // bandpass center frequency (Hz)
  q: number;
}

export interface ChordStabFilter {
  cutoff: number;
  q: number;
}

export interface DubDelaySpec {
  repeats: number;
  stepOffset: number;
  feedbackGain: number;
}

export interface SoundMixLevels {
  kick: number;
  bass: number;
  noise: number;
  stab: number;
}

export interface MusicalSuggestion {
  vibeId: VibeId;
  scale: ScaleSpec;
  chord: ChordSpec;
  bassNotes: readonly number[];
  rhythmPattern: RhythmPattern;
  noisePattern?: RhythmPattern;   // hi-hat / noise hits (16 steps)
  chordStabPattern?: RhythmPattern;
  soundLayers: readonly SoundLayer[];
  soundVariants?: SoundVariantSelection;
  soundMix?: SoundMixLevels;
  bpmRange: readonly [number, number];
  kickFilter?: KickFilter;
  bassFilter?: BassFilter;
  noiseFilter?: NoiseFilter;
  chordStabFilter?: ChordStabFilter;
  dubDelay?: DubDelaySpec;
  melodySuggested?: boolean;      // false = SYNTH toggle hidden for this vibe
}
