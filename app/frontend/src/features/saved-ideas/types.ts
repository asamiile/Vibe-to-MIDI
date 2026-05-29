import type { MusicalSuggestion, StereoPanSpec } from '../vibe-map/types';
import type { AudioLayer } from '../audio-engine/constants';
import type { SoundCombination } from '../vibe-map/sound-combinations';
import type { ChordCandidate } from '../vibe-map/chord-pool';

export interface SavedIdea {
  id: string;
  savedAt: number;
  suggestion: MusicalSuggestion;
  activeBpm: number;
  activePan: StereoPanSpec;
  activeLayers: AudioLayer[];
  soundCombination: SoundCombination;
  chord: ChordCandidate;
}
