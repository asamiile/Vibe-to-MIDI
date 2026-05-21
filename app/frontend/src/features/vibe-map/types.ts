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
  | 'lucid'
  | 'void'
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
  | 'sus2'
  | 'minor9'
  | 'dim7';

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
  analog?: boolean;  // true = DelayNode feedback loop instead of step re-scheduling
}

export interface FilterSweepSpec {
  target: 'bass' | 'stab' | 'both';
  startRatio: number;  // cutoff multiplier at note start (e.g. 0.25 = 25% of base)
  endRatio: number;    // cutoff multiplier at note end
}

export interface StereoPanSpec {
  bass: number;   // -1.0 (L) to 1.0 (R), kick is always 0
  noise: number;
  stab: number;
}

export interface WaveshapeSpec {
  target: 'bass' | 'stab' | 'both';
  amount: number;  // 0 = clean, 1 = heavy clip
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
  filterSweep?: FilterSweepSpec;
  waveshape?: WaveshapeSpec;
  melodySuggested?: boolean;      // false = SYNTH toggle hidden for this vibe
}
