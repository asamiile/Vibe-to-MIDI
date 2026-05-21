import { create } from 'zustand';
import type { MusicalSuggestion } from '../features/vibe-map/types';
import { getAllVibeIds, getMusicalSuggestion } from '../features/vibe-map/engine';
import { playPreview } from '../features/audio-engine/player';
import type { PlayerHandle } from '../features/audio-engine/player';
import { ALL_AUDIO_LAYERS } from '../features/audio-engine/constants';
import type { AudioLayer } from '../features/audio-engine/constants';
import {
  DEFAULT_CHORD_POOL,
  applyChordCandidate,
  pickChordCandidate,
  type ChordCandidate,
} from '../features/vibe-map/chord-pool';
import {
  DEFAULT_SOUND_CONFIGURATIONS,
  buildRandomSoundCombination,
  type SoundCombination,
  type SoundConfiguration,
} from '../features/vibe-map/sound-combinations';
import { pickRandomBpm } from '../features/vibe-map/random-bpm';

let _player: PlayerHandle | null = null;

interface AppState {
  soundConfigurations: readonly SoundConfiguration[];
  chordPool: readonly ChordCandidate[];
  activeSoundCombination: SoundCombination | null;
  activeChord: ChordCandidate | null;
  activeBpm: number | null;
  suggestion: MusicalSuggestion | null;
  isPlaying: boolean;
  activeLayers: Set<AudioLayer>;
  hasProAccess: boolean;
  proAccessSource: 'none' | 'dev-preview' | 'store';
  playRandomSoundCombination: () => void;
  play: () => void;
  stop: () => void;
  toggleLayer: (layer: AudioLayer) => void;
  setDevProAccess: (enabled: boolean) => void;
}

function startPlayback(suggestion: MusicalSuggestion, layers: Set<AudioLayer>, onHandle: (h: PlayerHandle) => void) {
  playPreview(suggestion, { activeLayers: layers }).then(onHandle);
}

// Picks a random vibe to use as a synthesis template (scale, mood, synth style).
// BPM and chord are overridden separately; this only provides the base parameters.
function pickPlaybackSuggestion(): MusicalSuggestion {
  const vibeIds = getAllVibeIds();
  const vibeId = vibeIds[Math.floor(Math.random() * vibeIds.length)];
  return getMusicalSuggestion(vibeId);
}

export const useAppStore = create<AppState>((set, get) => ({
  soundConfigurations: DEFAULT_SOUND_CONFIGURATIONS,
  chordPool: DEFAULT_CHORD_POOL,
  activeSoundCombination: null,
  activeChord: null,
  activeBpm: null,
  suggestion: null,
  isPlaying: false,
  activeLayers: new Set(ALL_AUDIO_LAYERS),
  hasProAccess: false,
  proAccessSource: 'none',

  playRandomSoundCombination: () => {
    const { chordPool, soundConfigurations } = get();
    const combination = buildRandomSoundCombination(soundConfigurations);
    const chord = pickChordCandidate(chordPool);
    const bpm = pickRandomBpm();
    const activeLayers = new Set(combination.layers);
    const suggestion = {
      ...applyChordCandidate(
        pickPlaybackSuggestion(),
        chord,
        { forceMelody: activeLayers.has('melody') }
      ),
      bpmRange: [bpm, bpm] as const,
    };

    _player?.stop();
    _player = null;
    set({
      activeSoundCombination: combination,
      activeChord: chord,
      activeBpm: bpm,
      suggestion,
      activeLayers,
      isPlaying: true,
    });
    startPlayback(suggestion, activeLayers, (handle) => {
      if (get().isPlaying) {
        _player = handle;
      } else {
        handle.stop();
      }
    });
  },

  play: () => {
    const { suggestion, activeLayers } = get();
    if (!suggestion) return;
    _player?.stop();
    _player = null;
    set({ isPlaying: true });
    startPlayback(suggestion, activeLayers, (handle) => {
      if (get().isPlaying) {
        _player = handle;
      } else {
        handle.stop();
      }
    });
  },

  stop: () => {
    _player?.stop();
    _player = null;
    set({ isPlaying: false });
  },

  toggleLayer: (layer) => {
    const { activeLayers, isPlaying, suggestion } = get();
    const next = new Set(activeLayers);
    if (next.has(layer)) next.delete(layer);
    else next.add(layer);
    set({ activeLayers: next });
    if (isPlaying && suggestion) {
      _player?.stop();
      _player = null;
      startPlayback(suggestion, next, (handle) => {
        if (get().isPlaying) {
          _player = handle;
        } else {
          handle.stop();
        }
      });
    }
  },

  setDevProAccess: (enabled) => {
    set({
      hasProAccess: enabled,
      proAccessSource: enabled ? 'dev-preview' : 'none',
    });
  },
}));
