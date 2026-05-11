import { VIBE_MAP } from './data';
import type { MusicalSuggestion, VibeId } from './types';

export function getMusicalSuggestion(vibeId: VibeId): MusicalSuggestion {
  return VIBE_MAP[vibeId];
}

export function getAllVibeIds(): VibeId[] {
  return Object.keys(VIBE_MAP) as VibeId[];
}

export function getMidBpm(suggestion: MusicalSuggestion): number {
  const [min, max] = suggestion.bpmRange;
  return Math.round((min + max) / 2);
}
