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
      { role: 'arp',  descriptor: 'repeating arpeggio' },
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

  groovy: {
    vibeId: 'groovy',
    scale: { root: 'D', mode: 'dorian' },
    chord: { root: 'D', quality: 'minor7' },
    bassNotes: [38, 43, 45, 43],        // D2, G2, A2, G2
    rhythmPattern: [true, false, false, false, true, false, false, true, true, false, false, false, true, false, true, false],
    soundLayers: [
      { role: 'bass',  descriptor: 'warm funk bass, tight' },
      { role: 'pluck', descriptor: 'chord stab, muted short' },
      { role: 'drum',  descriptor: 'four-on-floor, open hat offbeat' },
      { role: 'pad',   descriptor: 'none', optional: true },
    ],
    bpmRange: [118, 128],
  },

  nostalgic: {
    vibeId: 'nostalgic',
    scale: { root: 'F', mode: 'major' },
    chord: { root: 'F', quality: 'major7' },
    bassNotes: [41, 45, 48, 46],        // F2, A2, C3, Bb2
    rhythmPattern: [true, false, false, false, false, false, false, false, true, false, false, false, false, false, false, false],
    soundLayers: [
      { role: 'bass', descriptor: 'warm vinyl bass, soft' },
      { role: 'keys', descriptor: 'lo-fi Rhodes, dusty tape' },
      { role: 'drum', descriptor: 'boom-bap, vinyl crackle' },
      { role: 'pad',  descriptor: 'none', optional: true },
    ],
    bpmRange: [65, 85],
  },

  retrowave: {
    vibeId: 'retrowave',
    scale: { root: 'A', mode: 'minor' },
    chord: { root: 'A', quality: 'minor' },
    bassNotes: [33, 40, 33, 31],        // A1, E2, A1, G1
    rhythmPattern: [true, false, false, false, false, false, true, false, true, false, false, false, false, false, true, false],
    soundLayers: [
      { role: 'bass', descriptor: 'gated synth bass, 80s' },
      { role: 'arp',  descriptor: 'rising 8th-note arp, bright' },
      { role: 'pad',  descriptor: 'wide detuned saw pad' },
      { role: 'drum', descriptor: 'gated reverb snare, punchy' },
    ],
    bpmRange: [80, 110],
  },

  gritty: {
    vibeId: 'gritty',
    scale: { root: 'A', mode: 'minor' },
    chord: { root: 'A', quality: 'minor' },
    bassNotes: [33, 33, 40, 33],        // A1, A1, E2, A1
    rhythmPattern: [true, false, false, false, false, false, false, false, true, false, false, false, false, false, false, true],
    soundLayers: [
      { role: 'bass', descriptor: '808 sub, long decay' },
      { role: 'lead', descriptor: 'eerie pluck, pitch-shifted' },
      { role: 'drum', descriptor: 'trap hi-hat, triplet roll' },
      { role: 'pad',  descriptor: 'none', optional: true },
    ],
    bpmRange: [130, 150],
  },

  euphoric: {
    vibeId: 'euphoric',
    scale: { root: 'A', mode: 'major' },
    chord: { root: 'A', quality: 'major' },
    bassNotes: [45, 52, 45, 49],        // A2, E3, A2, C#3
    rhythmPattern: [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false],
    soundLayers: [
      { role: 'bass', descriptor: 'driving saw bass' },
      { role: 'arp',  descriptor: 'cascading 16th-note arp' },
      { role: 'pad',  descriptor: 'wide supersawtooth, bright' },
      { role: 'drum', descriptor: 'kick-heavy four-on-floor' },
    ],
    bpmRange: [128, 140],
  },

  cinematic: {
    vibeId: 'cinematic',
    scale: { root: 'D', mode: 'harmonic_minor' },
    chord: { root: 'D', quality: 'minor' },
    bassNotes: [38, 38, 45, 41],        // D2, D2, A2, F2
    rhythmPattern: [true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
    soundLayers: [
      { role: 'bass', descriptor: 'deep orchestral bass, slow' },
      { role: 'pad',  descriptor: 'dark string pad, swelling' },
      { role: 'lead', descriptor: 'none', optional: true },
      { role: 'drum', descriptor: 'none', optional: true },
    ],
    bpmRange: [80, 100],
  },
};
