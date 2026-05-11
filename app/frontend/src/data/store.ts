import { create } from 'zustand';
import type { VibeId, MusicalSuggestion } from '../features/vibe-map/types';
import { getMusicalSuggestion } from '../features/vibe-map/engine';

interface AppState {
  activeVibeId: VibeId | null;
  suggestion: MusicalSuggestion | null;
  isPlaying: boolean;
  selectVibe: (id: VibeId) => void;
  setPlaying: (playing: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  activeVibeId: null,
  suggestion: null,
  isPlaying: false,

  selectVibe: (id) =>
    set({
      activeVibeId: id,
      suggestion: getMusicalSuggestion(id),
      isPlaying: false,
    }),

  setPlaying: (playing) => set({ isPlaying: playing }),
}));
