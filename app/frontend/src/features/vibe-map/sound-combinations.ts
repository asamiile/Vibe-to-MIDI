import type { AudioLayer } from '../audio-engine/constants';

export type SoundConfigurationId = 'kick' | 'bass' | 'noise' | 'stab';

export interface SoundConfiguration {
  id: SoundConfigurationId;
  label: string;
  layer: AudioLayer;
}

export interface SoundCombination {
  id: string;
  label: string;
  layers: readonly AudioLayer[];
}

export const DEFAULT_SOUND_CONFIGURATIONS: readonly SoundConfiguration[] = [
  { id: 'kick', label: 'KICK', layer: 'kick' },
  { id: 'bass', label: 'BASS', layer: 'bass' },
  { id: 'noise', label: 'NOISE', layer: 'noise' },
  { id: 'stab', label: 'STAB', layer: 'melody' },
];

function pickLayerCount(total: number, random: () => number): number {
  if (total <= 2) return total;
  return Math.min(total, 2 + Math.floor(random() * (total - 1)));
}

function fisherYatesShuffle<T>(arr: T[], random: () => number): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function buildRandomSoundCombination(
  configurations: readonly SoundConfiguration[],
  random: () => number = Math.random
): SoundCombination {
  const shuffled = fisherYatesShuffle([...configurations], random);
  const selected = shuffled.slice(0, pickLayerCount(shuffled.length, random));
  const normalized = selected.length > 0 ? selected : configurations.slice(0, 1);
  const ids = normalized.map((configuration) => configuration.id);
  const layers = normalized.map((configuration) => configuration.layer);
  const label = normalized.map((configuration) => configuration.label).join(' + ');

  return {
    id: ids.join('-'),
    label,
    layers,
  };
}
