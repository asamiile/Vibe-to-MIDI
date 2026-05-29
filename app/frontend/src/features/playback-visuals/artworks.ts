export type PlaybackArtworkPlan = 'free' | 'pro';
export type PlaybackArtworkOrientation = 'landscape' | 'portrait';

export interface PlaybackArtwork {
  id: string;
  label: string;
  shortLabel: string;
  plan: PlaybackArtworkPlan;
  sources: Record<PlaybackArtworkOrientation, number>;
}

export const DEFAULT_PLAYBACK_ARTWORK_ID = 'bioluminescent-network';

export const PLAYBACK_ARTWORKS: readonly PlaybackArtwork[] = [
  {
    id: DEFAULT_PLAYBACK_ARTWORK_ID,
    label: 'Bioluminescent Network',
    shortLabel: 'BIOLUMINESCENT',
    plan: 'free',
    sources: {
      landscape: require('../../../assets/visuals/free_bioluminescent-network_landscape.mp4'),
      portrait: require('../../../assets/visuals/free_bioluminescent-network_portrait.mp4'),
    },
  },
  {
    id: 'cybernetic-flora-corruption',
    label: 'Cybernetic Flora Corruption',
    shortLabel: 'CYBERNETIC',
    plan: 'pro',
    sources: {
      landscape: require('../../../assets/visuals/pro_cybernetic-flora-corruption_landscape.mp4'),
      portrait: require('../../../assets/visuals/pro_cybernetic-flora-corruption_portrait.mp4'),
    },
  },
  {
    id: 'quantum-interference-glitch',
    label: 'Quantum Interference Glitch',
    shortLabel: 'QUANTUM GLITCH',
    plan: 'pro',
    sources: {
      landscape: require('../../../assets/visuals/pro_quantum-interference-glitch_landscape.mp4'),
      portrait: require('../../../assets/visuals/pro_quantum-interference-glitch_portrait.mp4'),
    },
  },
  {
    id: 'quantum-orbital-electron-cloud',
    label: 'Quantum Orbital Electron Cloud',
    shortLabel: 'ORBITAL CLOUD',
    plan: 'pro',
    sources: {
      landscape: require('../../../assets/visuals/pro_quantum-orbital-electron-cloud_landscape.mp4'),
      portrait: require('../../../assets/visuals/pro_quantum-orbital-electron-cloud_portrait.mp4'),
    },
  },
];

export function getPlaybackArtwork(id: string): PlaybackArtwork {
  return (
    PLAYBACK_ARTWORKS.find((artwork) => artwork.id === id) ??
    PLAYBACK_ARTWORKS[0]
  );
}

export function getSelectablePlaybackArtworks(hasProAccess: boolean): readonly PlaybackArtwork[] {
  if (hasProAccess) return PLAYBACK_ARTWORKS;
  return PLAYBACK_ARTWORKS.filter((artwork) => artwork.plan === 'free');
}
