import { create } from 'zustand';
import type { VibeId, MusicalSuggestion } from '../features/vibe-map/types';
import { getMusicalSuggestion } from '../features/vibe-map/engine';
import { playPreview, ALL_AUDIO_LAYERS } from '../features/audio-engine/player';
import type { PlayerHandle, AudioLayer } from '../features/audio-engine/player';

let _player: PlayerHandle | null = null;

interface AppState {
  activeVibeId: VibeId | null;
  suggestion: MusicalSuggestion | null;
  isPlaying: boolean;
  activeLayers: Set<AudioLayer>;
  selectVibe: (id: VibeId) => void;
  play: () => void;
  stop: () => void;
  toggleLayer: (layer: AudioLayer) => void;
}

function startPlayback(suggestion: MusicalSuggestion, layers: Set<AudioLayer>, onHandle: (h: PlayerHandle) => void) {
  playPreview(suggestion, { activeLayers: layers }).then(onHandle);
}

export const useAppStore = create<AppState>((set, get) => ({
  activeVibeId: null,
  suggestion: null,
  isPlaying: false,
  activeLayers: new Set(ALL_AUDIO_LAYERS),

  selectVibe: (id) => {
    _player?.stop();
    _player = null;
    set({
      activeVibeId: id,
      suggestion: getMusicalSuggestion(id),
      isPlaying: false,
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
}));
