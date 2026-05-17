import { VIBE_MAP, VIBE_SOUND_MIX, VIBE_SOUND_VARIANTS } from './data';
import type { MusicalSuggestion, VibeId } from './types';

export function getMusicalSuggestion(vibeId: VibeId): MusicalSuggestion {
  return {
    ...VIBE_MAP[vibeId],
    soundVariants: VIBE_SOUND_VARIANTS[vibeId],
    soundMix: VIBE_SOUND_MIX[vibeId],
  };
}

export function getAllVibeIds(): VibeId[] {
  return Object.keys(VIBE_MAP) as VibeId[];
}

export function getMidBpm(suggestion: MusicalSuggestion): number {
  const [min, max] = suggestion.bpmRange;
  return Math.round((min + max) / 2);
}
