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
    soundLayers: [
      { role: 'bass', descriptor: 'sub bass, slow' },
      { role: 'pad',  descriptor: 'dark drone pad' },
      { role: 'lead', descriptor: 'none', optional: true },
      { role: 'drum', descriptor: 'sparse kick, long tail' },
    ],
    bpmRange: [120, 135],
  },

  floating: {
    vibeId: 'floating',
    scale: { root: 'F', mode: 'lydian' },
    chord: { root: 'F', quality: 'major7' },
    bassNotes: [41, 45, 48, 52],        // F2, A2, C3, E3
    rhythmPattern: [true, false, false, false, false, false, true, false, false, false, false, false, true, false, false, false],
    soundLayers: [
      { role: 'bass', descriptor: 'warm arco bass' },
      { role: 'pad',  descriptor: 'shimmering bright pad' },
      { role: 'lead', descriptor: 'breathy flute lead' },
      { role: 'drum', descriptor: 'light hi-hat, no kick' },
    ],
    bpmRange: [110, 125],
  },

  tense: {
    vibeId: 'tense',
    scale: { root: 'B', mode: 'locrian' },
    chord: { root: 'B', quality: 'diminished' },
    bassNotes: [35, 35, 38, 35],        // B1, B1, D2, B1
    rhythmPattern: [true, false, true, false, true, false, false, true, true, false, true, false, false, true, false, false],
    soundLayers: [
      { role: 'bass', descriptor: 'distorted bass, sharp' },
      { role: 'pad',  descriptor: 'dissonant string pad' },
      { role: 'lead', descriptor: 'harsh saw lead' },
      { role: 'drum', descriptor: 'dense snare, syncopated' },
    ],
    bpmRange: [130, 145],
  },

  repetitive: {
    vibeId: 'repetitive',
    scale: { root: 'C', mode: 'minor' },
    chord: { root: 'C', quality: 'minor' },
    bassNotes: [36, 36, 36, 36],        // C2 × 4
    rhythmPattern: [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false],
    soundLayers: [
      { role: 'bass', descriptor: 'punchy 808 bass' },
      { role: 'pad',  descriptor: 'none', optional: true },
      { role: 'lead', descriptor: 'staccato pluck' },
      { role: 'drum', descriptor: 'four-on-floor kick' },
    ],
    bpmRange: [125, 140],
  },

  underground: {
    vibeId: 'underground',
    scale: { root: 'D', mode: 'dorian' },
    chord: { root: 'D', quality: 'minor7' },
    bassNotes: [38, 38, 41, 38],        // D2, D2, F2, D2
    rhythmPattern: [true, false, false, false, false, false, false, true, false, false, true, false, false, false, false, false],
    soundLayers: [
      { role: 'bass', descriptor: 'deep sub, gritty mid' },
      { role: 'pad',  descriptor: 'industrial dark pad' },
      { role: 'lead', descriptor: 'none', optional: true },
      { role: 'drum', descriptor: 'compressed kick, minimal' },
    ],
    bpmRange: [130, 145],
  },

  wide: {
    vibeId: 'wide',
    scale: { root: 'G', mode: 'major' },
    chord: { root: 'G', quality: 'sus4' },
    bassNotes: [43, 47, 50, 55],        // G2, B2, D3, G3
    rhythmPattern: [true, false, false, true, false, false, true, false, false, true, false, false, false, false, true, false],
    soundLayers: [
      { role: 'bass', descriptor: 'open stereo bass' },
      { role: 'pad',  descriptor: 'wide stereo pad, hall' },
      { role: 'lead', descriptor: 'bright sus4 stab' },
      { role: 'drum', descriptor: 'open hi-hat, big room' },
    ],
    bpmRange: [115, 130],
  },

  hypnotic: {
    vibeId: 'hypnotic',
    scale: { root: 'E', mode: 'dorian' },
    chord: { root: 'E', quality: 'minor7' },
    bassNotes: [40, 40, 43, 40],        // E2, E2, G2, E2
    rhythmPattern: [true, false, false, true, false, false, true, false, true, false, false, true, false, false, true, false],
    soundLayers: [
      { role: 'bass', descriptor: 'looping arp bass' },
      { role: 'pad',  descriptor: 'evolving filter pad' },
      { role: 'lead', descriptor: 'repeating arpeggio' },
      { role: 'drum', descriptor: 'steady 16th hi-hat' },
    ],
    bpmRange: [122, 134],
  },

  metallic: {
    vibeId: 'metallic',
    scale: { root: 'F#', mode: 'locrian' },
    chord: { root: 'F#', quality: 'diminished' },
    bassNotes: [42, 42, 46, 42],        // F#2, F#2, A#2, F#2
    rhythmPattern: [true, true, false, true, false, true, true, false, true, true, false, false, true, false, true, false],
    soundLayers: [
      { role: 'bass', descriptor: 'FM bass, clipped' },
      { role: 'pad',  descriptor: 'metallic stab', optional: true },
      { role: 'lead', descriptor: 'metallic FM lead' },
      { role: 'drum', descriptor: 'clappy snare, busy' },
    ],
    bpmRange: [135, 150],
  },

  warm: {
    vibeId: 'warm',
    scale: { root: 'Bb', mode: 'major' },
    chord: { root: 'Bb', quality: 'major7' },
    bassNotes: [46, 50, 53, 58],        // Bb2, D3, F3, Bb3
    rhythmPattern: [true, false, false, false, false, false, true, false, false, false, true, false, false, false, false, true],
    soundLayers: [
      { role: 'bass', descriptor: 'warm sine bass' },
      { role: 'pad',  descriptor: 'tape-saturated pad' },
      { role: 'lead', descriptor: 'soft Rhodes-like lead' },
      { role: 'drum', descriptor: 'soft brush drum' },
    ],
    bpmRange: [108, 120],
  },

  unstable: {
    vibeId: 'unstable',
    scale: { root: 'C#', mode: 'whole_tone' },
    chord: { root: 'C#', quality: 'dominant7' },
    bassNotes: [37, 41, 39, 43],        // C#2, F2, Eb2, G2
    rhythmPattern: [true, false, true, true, false, true, false, false, true, false, true, false, true, true, false, true],
    soundLayers: [
      { role: 'bass', descriptor: 'pitch-shifting bass' },
      { role: 'pad',  descriptor: 'whole-tone cluster pad' },
      { role: 'lead', descriptor: 'detuned lead' },
      { role: 'drum', descriptor: 'irregular syncopated kick' },
    ],
    bpmRange: [118, 132],
  },
};
