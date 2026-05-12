import { create } from 'zustand';
import type { VibeId, MusicalSuggestion } from '../features/vibe-map/types';
import { getMusicalSuggestion } from '../features/vibe-map/engine';
import { playPreview } from '../features/audio-engine/player';
import type { PlayerHandle } from '../features/audio-engine/player';

let _player: PlayerHandle | null = null;

interface AppState {
  activeVibeId: VibeId | null;
  suggestion: MusicalSuggestion | null;
  isPlaying: boolean;
  selectVibe: (id: VibeId) => void;
  play: () => void;
  stop: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  activeVibeId: null,
  suggestion: null,
  isPlaying: false,

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
    const { suggestion } = get();
    if (!suggestion) return;
    _player?.stop();
    _player = null;
    set({ isPlaying: true });
    playPreview(suggestion).then((handle) => {
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
}));
