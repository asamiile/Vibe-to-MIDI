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
import { DEFAULT_SOUND_VARIANTS, pickKickVariant } from '../features/vibe-map/sound-palette';
import { pickKickRhythmProfile } from '../features/vibe-map/kick-rhythm';
import { pickRandomBpm } from '../features/vibe-map/random-bpm';
import { buildRandomStereoPan } from '../features/vibe-map/stereo-pan';
import type { StereoPanSpec } from '../features/vibe-map/types';

let _player: PlayerHandle | null = null;
let _playbackToken = 0;

interface AppState {
  soundConfigurations: readonly SoundConfiguration[];
  chordPool: readonly ChordCandidate[];
  activeSoundCombination: SoundCombination | null;
  activeChord: ChordCandidate | null;
  activeBpm: number | null;
  activePan: StereoPanSpec | null;
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

function startPlayback(
  suggestion: MusicalSuggestion,
  layers: Set<AudioLayer>,
  pan: StereoPanSpec | null,
  token: number,
  onHandle: (h: PlayerHandle) => void
) {
  playPreview(suggestion, { activeLayers: layers, pan: pan ?? undefined }).then((handle) => {
    if (token !== _playbackToken) {
      handle.stop();
      return;
    }
    onHandle(handle);
  });
}

function stopCurrentPlayer(): number {
  _playbackToken += 1;
  _player?.stop();
  _player = null;
  return _playbackToken;
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
  activePan: null,
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
    const pan = buildRandomStereoPan();
    const activeLayers = new Set(combination.layers);
    const kickRhythm = pickKickRhythmProfile();
    const baseSuggestion = pickPlaybackSuggestion();
    const suggestion = {
      ...applyChordCandidate(
        baseSuggestion,
        chord,
        { forceMelody: activeLayers.has('melody') }
      ),
      rhythmPattern: activeLayers.has('kick') ? kickRhythm.pattern : baseSuggestion.rhythmPattern,
      soundVariants: {
        ...(baseSuggestion.soundVariants ?? DEFAULT_SOUND_VARIANTS),
        kick: pickKickVariant(),
      },
      bpmRange: [bpm, bpm] as const,
    };

    const token = stopCurrentPlayer();
    set({
      activeSoundCombination: combination,
      activeChord: chord,
      activeBpm: bpm,
      activePan: pan,
      suggestion,
      activeLayers,
      isPlaying: true,
    });
    startPlayback(suggestion, activeLayers, pan, token, (handle) => {
      if (get().isPlaying && token === _playbackToken) {
        _player = handle;
      } else {
        handle.stop();
      }
    });
  },

  play: () => {
    const { suggestion, activeLayers, activePan } = get();
    if (!suggestion) return;
    const token = stopCurrentPlayer();
    set({ isPlaying: true });
    startPlayback(suggestion, activeLayers, activePan, token, (handle) => {
      if (get().isPlaying && token === _playbackToken) {
        _player = handle;
      } else {
        handle.stop();
      }
    });
  },

  stop: () => {
    stopCurrentPlayer();
    set({ isPlaying: false });
  },

  toggleLayer: (layer) => {
    const { activeLayers, isPlaying, suggestion, activePan } = get();
    const next = new Set(activeLayers);
    if (next.has(layer)) next.delete(layer);
    else next.add(layer);
    set({ activeLayers: next });
    if (isPlaying && suggestion) {
      const token = stopCurrentPlayer();
      startPlayback(suggestion, next, activePan, token, (handle) => {
        if (get().isPlaying && token === _playbackToken) {
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
