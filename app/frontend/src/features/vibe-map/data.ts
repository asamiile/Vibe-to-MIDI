import type { MusicalSuggestion, VibeId } from './types';

// Each pattern is 16 steps (1 bar at 1/16th note resolution)
// true = hit, false = rest

export const VIBE_MAP: Record<VibeId, MusicalSuggestion> = {
  dark: {
    vibeId: 'dark',
    scale: { root: 'A', mode: 'phrygian' },
    chord: { root: 'A', quality: 'minor' },
    bassNotes: [33, 33, 33, 36],        // A1, A1, A1, C2
    rhythmPattern: [true, false, false, false, false, false, false, false, true, false, false, false, false, false, false, false],
    soundHint: 'sub bass, slow attack, long reverb tail',
    bpmRange: [120, 135],
  },

  floating: {
    vibeId: 'floating',
    scale: { root: 'F', mode: 'lydian' },
    chord: { root: 'F', quality: 'major7' },
    bassNotes: [41, 45, 48, 52],        // F2, A2, C3, E3
    rhythmPattern: [true, false, false, false, false, false, true, false, false, false, false, false, true, false, false, false],
    soundHint: 'pad with long release, chorus, high shimmer',
    bpmRange: [110, 125],
  },

  tense: {
    vibeId: 'tense',
    scale: { root: 'B', mode: 'locrian' },
    chord: { root: 'B', quality: 'diminished' },
    bassNotes: [35, 35, 38, 35],        // B1, B1, D2, B1
    rhythmPattern: [true, false, true, false, true, false, false, true, true, false, true, false, false, true, false, false],
    soundHint: 'sharp transients, distorted mid, no reverb',
    bpmRange: [130, 145],
  },

  repetitive: {
    vibeId: 'repetitive',
    scale: { root: 'C', mode: 'minor' },
    chord: { root: 'C', quality: 'minor' },
    bassNotes: [36, 36, 36, 36],        // C2 × 4
    rhythmPattern: [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false],
    soundHint: 'tight kick, punchy bass, minimal decay',
    bpmRange: [125, 140],
  },

  underground: {
    vibeId: 'underground',
    scale: { root: 'D', mode: 'dorian' },
    chord: { root: 'D', quality: 'minor7' },
    bassNotes: [38, 38, 41, 38],        // D2, D2, F2, D2
    rhythmPattern: [true, false, false, false, false, false, false, true, false, false, true, false, false, false, false, false],
    soundHint: 'deep sub, gritty mid, dark compression',
    bpmRange: [130, 145],
  },

  wide: {
    vibeId: 'wide',
    scale: { root: 'G', mode: 'major' },
    chord: { root: 'G', quality: 'sus4' },
    bassNotes: [43, 47, 50, 55],        // G2, B2, D3, G3
    rhythmPattern: [true, false, false, true, false, false, true, false, false, true, false, false, false, false, true, false],
    soundHint: 'wide stereo, hall reverb, open high-end',
    bpmRange: [115, 130],
  },

  hypnotic: {
    vibeId: 'hypnotic',
    scale: { root: 'E', mode: 'dorian' },
    chord: { root: 'E', quality: 'minor7' },
    bassNotes: [40, 40, 43, 40],        // E2, E2, G2, E2
    rhythmPattern: [true, false, false, true, false, false, true, false, true, false, false, true, false, false, true, false],
    soundHint: 'looping arpeggio, moderate reverb, no transients',
    bpmRange: [122, 134],
  },

  metallic: {
    vibeId: 'metallic',
    scale: { root: 'F#', mode: 'locrian' },
    chord: { root: 'F#', quality: 'diminished' },
    bassNotes: [42, 42, 46, 42],        // F#2, F#2, A#2, F#2
    rhythmPattern: [true, true, false, true, false, true, true, false, true, true, false, false, true, false, true, false],
    soundHint: 'metallic FM, clipped transients, room reverb',
    bpmRange: [135, 150],
  },

  warm: {
    vibeId: 'warm',
    scale: { root: 'Bb', mode: 'major' },
    chord: { root: 'Bb', quality: 'major7' },
    bassNotes: [46, 50, 53, 58],        // Bb2, D3, F3, Bb3
    rhythmPattern: [true, false, false, false, false, false, true, false, false, false, true, false, false, false, false, true],
    soundHint: 'warm sine pad, tape saturation, soft attack',
    bpmRange: [108, 120],
  },

  unstable: {
    vibeId: 'unstable',
    scale: { root: 'C#', mode: 'whole_tone' },
    chord: { root: 'C#', quality: 'dominant7' },
    bassNotes: [37, 41, 39, 43],        // C#2, F2, Eb2, G2
    rhythmPattern: [true, false, true, true, false, true, false, false, true, false, true, false, true, true, false, true],
    soundHint: 'pitch-shifted bass, unstable modulation, long tail',
    bpmRange: [118, 132],
  },
};
