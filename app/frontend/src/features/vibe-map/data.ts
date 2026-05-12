import type { MusicalSuggestion, VibeId } from './types';

// Each pattern is 16 steps (1 bar at 1/16th note resolution)
// true = hit, false = rest
// All vibes are designed for dub techno production context.
// BPM ranges reflect genre convention; playback is clamped to 80-120 in player.ts.

// Common noise (hi-hat) patterns
const HAT_OFF8  = [false, false, true,  false, false, false, true,  false, false, false, true,  false, false, false, true,  false] as const; // off-beat 8ths (2,6,10,14)
const HAT_ALL8  = [true,  false, true,  false, true,  false, true,  false, true,  false, true,  false, true,  false, true,  false] as const; // all 8ths
const HAT_QTR   = [false, false, false, false, true,  false, false, false, true,  false, false, false, true,  false, false, false] as const; // quarter off-beats (4,8,12)
const HAT_SPARE = [false, false, true,  false, false, false, false, false, false, false, true,  false, false, false, false, false] as const; // sparse (2,10)

const STAB_OFFBEAT  = [false, false, false, false, false, false, true,  false, false, false, false, false, false, false, true,  false] as const;
const STAB_DUB      = [false, false, true,  false, false, false, false, false, false, false, true,  false, false, false, false, true] as const;
const STAB_SPARSE   = [false, false, false, false, false, false, false, false, true,  false, false, false, false, false, false, false] as const;

export const VIBE_MAP: Record<VibeId, MusicalSuggestion> = {

  // ── Slow / Atmospheric dub ──────────────────────────────────────────────

  dark: {
    vibeId: 'dark',
    scale: { root: 'A', mode: 'phrygian' },
    chord: { root: 'A', quality: 'minor7' },
    bassNotes: [33, 33, 31, 33],
    rhythmPattern: [true, false, false, false, false, false, false, false, true, false, false, false, false, false, false, false],
    noisePattern: HAT_OFF8,
    chordStabPattern: STAB_SPARSE,
    soundLayers: [
      { role: 'bass', descriptor: 'sub bass, long decay, minimal movement' },
      { role: 'pad',  descriptor: 'minor7 chord stab, long dub reverb tail' },
      { role: 'drum', descriptor: 'deep muffled kick, beats 1 and 3' },
    ],
    bpmRange: [128, 135],
    kickFilter: { cutoff: 75,  q: 2.8 },
    bassFilter: { cutoff: 180, q: 1.0 },
    noiseFilter: { cutoff: 5500, q: 0.8 },  // 暗くこもったハット
    chordStabFilter: { cutoff: 950, q: 1.4 },
    dubDelay: { repeats: 3, stepOffset: 3, feedbackGain: 0.45 },
    melodySuggested: true,
  },

  floating: {
    vibeId: 'floating',
    scale: { root: 'F', mode: 'dorian' },
    chord: { root: 'F', quality: 'minor7' },
    bassNotes: [41, 41, 36, 41],
    rhythmPattern: [true, false, false, false, false, false, false, false, false, false, true, false, false, false, false, false],
    noisePattern: [false, false, false, false, false, false, false, false, false, false, true, false, false, false, false, false],
    chordStabPattern: STAB_OFFBEAT,
    soundLayers: [
      { role: 'bass', descriptor: 'warm sub, slow filter movement' },
      { role: 'pad',  descriptor: 'soft minor7 stab, high reverb mix' },
      { role: 'drum', descriptor: 'soft kick, syncopated off-beat' },
    ],
    bpmRange: [118, 126],
    kickFilter: { cutoff: 130,  q: 1.4 },
    bassFilter: { cutoff: 350,  q: 0.6 },
    noiseFilter: { cutoff: 8000, q: 0.5 },  // 空気感のあるやさしいハット
    chordStabFilter: { cutoff: 1400, q: 0.8 },
    dubDelay: { repeats: 4, stepOffset: 2, feedbackGain: 0.38 },
    melodySuggested: true,
  },

  cinematic: {
    vibeId: 'cinematic',
    scale: { root: 'D', mode: 'harmonic_minor' },
    chord: { root: 'D', quality: 'minor' },
    bassNotes: [38, 38, 45, 41],
    rhythmPattern: [true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
    noisePattern: [false, false, false, false, false, false, false, false, true, false, false, false, false, false, false, false],
    chordStabPattern: STAB_SPARSE,
    soundLayers: [
      { role: 'bass', descriptor: 'orchestral sub bass, very slow' },
      { role: 'pad',  descriptor: 'dark minor chord stab, slow filtered tail' },
      { role: 'drum', descriptor: 'single downbeat kick, no fill' },
    ],
    bpmRange: [118, 126],
    kickFilter: { cutoff: 70,   q: 2.0 },
    bassFilter: { cutoff: 150,  q: 0.8 },
    noiseFilter: { cutoff: 5000, q: 1.0 },  // 深く暗いシンバル残響
    chordStabFilter: { cutoff: 850, q: 1.2 },
    dubDelay: { repeats: 3, stepOffset: 4, feedbackGain: 0.42 },
    melodySuggested: true,
  },

  nostalgic: {
    vibeId: 'nostalgic',
    scale: { root: 'G', mode: 'minor' },
    chord: { root: 'G', quality: 'minor7' },
    bassNotes: [31, 31, 38, 34],
    rhythmPattern: [true, false, false, false, false, false, false, false, true, false, false, false, false, false, false, false],
    noisePattern: [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false],
    chordStabPattern: STAB_DUB,
    soundLayers: [
      { role: 'bass', descriptor: 'warm round sub, tape saturation' },
      { role: 'pad',  descriptor: 'detuned minor7 stab, tape delay color' },
      { role: 'drum', descriptor: 'soft kick, beats 1 and 3' },
    ],
    bpmRange: [120, 126],
    kickFilter: { cutoff: 120,  q: 1.6 },
    bassFilter: { cutoff: 300,  q: 0.7 },
    noiseFilter: { cutoff: 7000, q: 0.7 },  // 温かみのあるビンテージハット
    chordStabFilter: { cutoff: 1250, q: 0.9 },
    dubDelay: { repeats: 4, stepOffset: 3, feedbackGain: 0.4 },
    melodySuggested: true,
  },

  // ── Standard dub techno ─────────────────────────────────────────────────

  repetitive: {
    vibeId: 'repetitive',
    scale: { root: 'C', mode: 'minor' },
    chord: { root: 'C', quality: 'minor7' },
    bassNotes: [36, 36, 36, 36],
    rhythmPattern: [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false],
    noisePattern: HAT_ALL8,
    chordStabPattern: STAB_DUB,
    soundLayers: [
      { role: 'bass', descriptor: 'drone sub, zero movement' },
      { role: 'pad',  descriptor: 'short minor7 stab, slow lowpass sweep' },
      { role: 'drum', descriptor: 'four-on-floor deep kick' },
    ],
    bpmRange: [128, 135],
    kickFilter: { cutoff: 100,  q: 2.2 },
    bassFilter: { cutoff: 220,  q: 1.0 },
    noiseFilter: { cutoff: 9000, q: 0.6 },  // 均一なメカニカルハット
    chordStabFilter: { cutoff: 1100, q: 1.1 },
    dubDelay: { repeats: 3, stepOffset: 2, feedbackGain: 0.34 },
    melodySuggested: true,
  },

  hypnotic: {
    vibeId: 'hypnotic',
    scale: { root: 'E', mode: 'dorian' },
    chord: { root: 'E', quality: 'minor7' },
    bassNotes: [40, 40, 40, 43],
    rhythmPattern: [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false],
    noisePattern: HAT_OFF8,
    chordStabPattern: STAB_DUB,
    soundLayers: [
      { role: 'bass', descriptor: 'looping sub, slight filter wobble' },
      { role: 'pad',  descriptor: 'long-release reverb pad, no attack' },
      { role: 'arp',  descriptor: 'sparse 8th-note stab, minimal' },
      { role: 'drum', descriptor: 'steady four-on-floor' },
    ],
    bpmRange: [128, 133],
    kickFilter: { cutoff: 90,   q: 2.4 },
    bassFilter: { cutoff: 200,  q: 1.2 },
    noiseFilter: { cutoff: 8000, q: 0.9 },  // 均一で催眠的なオフビートハット
    chordStabFilter: { cutoff: 1050, q: 1.3 },
    dubDelay: { repeats: 4, stepOffset: 2, feedbackGain: 0.36 },
    melodySuggested: true,
  },

  wide: {
    vibeId: 'wide',
    scale: { root: 'G', mode: 'dorian' },
    chord: { root: 'G', quality: 'minor7' },
    bassNotes: [31, 31, 38, 31],
    rhythmPattern: [true, false, false, false, false, false, true, false, true, false, false, false, false, false, false, false],
    noisePattern: HAT_QTR,
    chordStabPattern: STAB_OFFBEAT,
    soundLayers: [
      { role: 'bass', descriptor: 'wide stereo sub, slow pan movement' },
      { role: 'pad',  descriptor: 'wide minor7 stab, long stereo reverb' },
      { role: 'drum', descriptor: 'kick on 1, off-beat dub hit' },
    ],
    bpmRange: [122, 130],
    kickFilter: { cutoff: 120,   q: 1.5 },
    bassFilter: { cutoff: 500,   q: 0.5 },
    noiseFilter: { cutoff: 10000, q: 0.5 }, // 空間に広がるオープンハット感
    chordStabFilter: { cutoff: 1600, q: 0.7 },
    dubDelay: { repeats: 5, stepOffset: 3, feedbackGain: 0.32 },
    melodySuggested: true,
  },

  warm: {
    vibeId: 'warm',
    scale: { root: 'Bb', mode: 'dorian' },
    chord: { root: 'Bb', quality: 'minor7' },
    bassNotes: [34, 34, 41, 34],
    rhythmPattern: [true, false, false, false, false, false, false, false, false, false, false, false, true, false, false, false],
    noisePattern: HAT_SPARE,
    chordStabPattern: STAB_SPARSE,
    soundLayers: [
      { role: 'bass', descriptor: 'warm rounded sub, tube saturation' },
      { role: 'pad',  descriptor: 'rounded minor7 stab, filtered reverb tail' },
      { role: 'drum', descriptor: 'soft kick on beat 1 and 4, minimal' },
    ],
    bpmRange: [120, 128],
    kickFilter: { cutoff: 135,  q: 1.3 },
    bassFilter: { cutoff: 400,  q: 0.7 },
    noiseFilter: { cutoff: 7500, q: 0.6 },  // ソフトで温かいハット
    chordStabFilter: { cutoff: 1200, q: 0.8 },
    dubDelay: { repeats: 4, stepOffset: 3, feedbackGain: 0.35 },
    melodySuggested: true,
  },

  deep: {
    vibeId: 'deep',
    scale: { root: 'C', mode: 'dorian' },
    chord: { root: 'C', quality: 'minor9' },
    bassNotes: [36, 36, 43, 34],
    rhythmPattern: [true, false, false, false, true, false, false, false, true, false, false, false, false, false, true, false],
    noisePattern: HAT_SPARE,
    chordStabPattern: STAB_SPARSE,
    soundLayers: [
      { role: 'bass', descriptor: 'very deep sub, long lowpass tail' },
      { role: 'pad',  descriptor: 'minor9 stab, submerged dub echo' },
      { role: 'drum', descriptor: 'rounded kick, sparse late push' },
    ],
    bpmRange: [122, 128],
    kickFilter: { cutoff: 90, q: 2.4 },
    bassFilter: { cutoff: 160, q: 1.3 },
    noiseFilter: { cutoff: 5200, q: 0.9 },
    chordStabFilter: { cutoff: 780, q: 1.5 },
    dubDelay: { repeats: 5, stepOffset: 3, feedbackGain: 0.43 },
    melodySuggested: true,
  },

  rolling: {
    vibeId: 'rolling',
    scale: { root: 'F', mode: 'minor' },
    chord: { root: 'F', quality: 'minor7' },
    bassNotes: [29, 29, 32, 34],
    rhythmPattern: [true, false, false, false, true, false, true, false, true, false, false, false, true, false, true, false],
    noisePattern: HAT_ALL8,
    chordStabPattern: STAB_OFFBEAT,
    soundLayers: [
      { role: 'bass', descriptor: 'rolling sub phrase, short envelope' },
      { role: 'pad',  descriptor: 'tight minor7 stab, filtered delay' },
      { role: 'drum', descriptor: 'forward four-on-floor with push hits' },
    ],
    bpmRange: [128, 134],
    kickFilter: { cutoff: 125, q: 1.7 },
    bassFilter: { cutoff: 480, q: 0.9 },
    noiseFilter: { cutoff: 9500, q: 1.0 },
    chordStabFilter: { cutoff: 1550, q: 1.0 },
    dubDelay: { repeats: 3, stepOffset: 2, feedbackGain: 0.31 },
    melodySuggested: true,
  },

  groovy: {
    vibeId: 'groovy',
    scale: { root: 'D', mode: 'dorian' },
    chord: { root: 'D', quality: 'minor7' },
    bassNotes: [38, 43, 45, 43],
    rhythmPattern: [true, false, false, false, false, false, true, false, false, false, true, false, false, false, true, false],
    noisePattern: [false, false, true, true, false, false, false, false, false, false, true, true, false, false, false, false],
    chordStabPattern: STAB_OFFBEAT,
    soundLayers: [
      { role: 'bass',  descriptor: 'syncopated dub bass, tight envelope' },
      { role: 'pluck', descriptor: 'short chord stab, reverb tail' },
      { role: 'drum',  descriptor: 'off-beat kick, dub groove' },
    ],
    bpmRange: [124, 130],
    kickFilter: { cutoff: 145,  q: 1.2 },
    bassFilter: { cutoff: 600,  q: 0.6 },
    noiseFilter: { cutoff: 9000, q: 1.2 },  // タイトなグルーヴハット
    chordStabFilter: { cutoff: 1800, q: 0.9 },
    dubDelay: { repeats: 3, stepOffset: 2, feedbackGain: 0.3 },
    melodySuggested: true,
  },

  cavernous: {
    vibeId: 'cavernous',
    scale: { root: 'E', mode: 'phrygian' },
    chord: { root: 'E', quality: 'minor7' },
    bassNotes: [28, 28, 29, 28],
    rhythmPattern: [true, false, false, false, false, false, false, false, true, false, false, false, false, false, true, false],
    noisePattern: [false, false, false, false, false, false, true, false, false, false, false, false, false, false, true, false],
    chordStabPattern: STAB_SPARSE,
    soundLayers: [
      { role: 'bass', descriptor: 'sub pressure, almost no midrange' },
      { role: 'pad',  descriptor: 'dark cavern stab, long resonant tail' },
      { role: 'drum', descriptor: 'muffled kick, heavy room decay' },
    ],
    bpmRange: [124, 130],
    kickFilter: { cutoff: 72, q: 2.7 },
    bassFilter: { cutoff: 140, q: 1.6 },
    noiseFilter: { cutoff: 4800, q: 1.4 },
    chordStabFilter: { cutoff: 700, q: 2.1 },
    dubDelay: { repeats: 4, stepOffset: 4, feedbackGain: 0.48 },
    melodySuggested: true,
  },

  dry: {
    vibeId: 'dry',
    scale: { root: 'G', mode: 'minor' },
    chord: { root: 'G', quality: 'minor' },
    bassNotes: [31, 31, 34, 31],
    rhythmPattern: [true, false, false, false, true, false, false, false, true, false, true, false, true, false, false, false],
    noisePattern: [false, false, true, false, false, false, true, false, false, false, true, false, false, false, false, false],
    chordStabPattern: [false, false, false, false, false, false, true, false, false, false, false, false, true, false, false, false],
    soundLayers: [
      { role: 'bass', descriptor: 'dry muted sub, quick release' },
      { role: 'pad',  descriptor: 'short chord stab, low reverb amount' },
      { role: 'drum', descriptor: 'tight kick, clipped room' },
    ],
    bpmRange: [126, 132],
    kickFilter: { cutoff: 135, q: 1.1 },
    bassFilter: { cutoff: 520, q: 0.7 },
    noiseFilter: { cutoff: 8200, q: 1.3 },
    chordStabFilter: { cutoff: 1700, q: 0.7 },
    dubDelay: { repeats: 2, stepOffset: 2, feedbackGain: 0.24 },
    melodySuggested: true,
  },

  // ── Driving / Hard dub ──────────────────────────────────────────────────

  underground: {
    vibeId: 'underground',
    scale: { root: 'D', mode: 'phrygian' },
    chord: { root: 'D', quality: 'minor7' },
    bassNotes: [38, 38, 39, 38],
    rhythmPattern: [true, false, false, false, false, false, false, false, true, false, true, false, false, false, false, false],
    noisePattern: HAT_SPARE,
    chordStabPattern: STAB_DUB,
    soundLayers: [
      { role: 'bass', descriptor: 'industrial sub, gritty saturation' },
      { role: 'pad',  descriptor: 'dark minor7 stab, narrow resonant filter' },
      { role: 'drum', descriptor: 'compressed kick, step 0/8/10' },
    ],
    bpmRange: [132, 138],
    kickFilter: { cutoff: 95,   q: 2.6 },
    bassFilter: { cutoff: 250,  q: 1.5 },
    noiseFilter: { cutoff: 6500, q: 1.5 },  // 暗くインダストリアルなハット
    chordStabFilter: { cutoff: 900, q: 1.8 },
    dubDelay: { repeats: 3, stepOffset: 3, feedbackGain: 0.42 },
    melodySuggested: true,
  },

  tense: {
    vibeId: 'tense',
    scale: { root: 'B', mode: 'phrygian' },
    chord: { root: 'B', quality: 'minor7' },
    bassNotes: [35, 35, 38, 35],
    rhythmPattern: [true, false, false, false, false, false, false, false, true, false, true, false, false, false, false, false],
    noisePattern: [false, false, true, false, true, false, true, false, false, false, true, false, true, false, true, false],
    chordStabPattern: STAB_DUB,
    soundLayers: [
      { role: 'bass', descriptor: 'tight punchy sub, clipped transient' },
      { role: 'pad',  descriptor: 'dissonant cluster pad, reverb wash' },
      { role: 'drum', descriptor: 'hard kick, syncopated tension' },
    ],
    bpmRange: [130, 138],
    kickFilter: { cutoff: 105,   q: 2.2 },
    bassFilter: { cutoff: 320,   q: 1.8 },
    noiseFilter: { cutoff: 10000, q: 1.2 }, // 緊張感の強いシャープなハット
    chordStabFilter: { cutoff: 1150, q: 1.7 },
    dubDelay: { repeats: 3, stepOffset: 2, feedbackGain: 0.4 },
    melodySuggested: true,
  },

  metallic: {
    vibeId: 'metallic',
    scale: { root: 'F#', mode: 'phrygian' },
    chord: { root: 'F#', quality: 'minor7' },
    bassNotes: [30, 30, 37, 30],
    rhythmPattern: [true, false, false, false, false, false, true, false, true, false, false, false, false, false, true, false],
    noisePattern: HAT_ALL8,
    chordStabPattern: STAB_OFFBEAT,
    soundLayers: [
      { role: 'bass', descriptor: 'FM bass, metallic resonance' },
      { role: 'pad',  descriptor: 'metallic plate reverb stab' },
      { role: 'drum', descriptor: 'industrial kick, step 0/6/8/14' },
    ],
    bpmRange: [133, 138],
    kickFilter: { cutoff: 160,   q: 1.0 },
    bassFilter: { cutoff: 700,   q: 2.0 },
    noiseFilter: { cutoff: 12000, q: 1.5 }, // 最も金属的で明るいハット
    chordStabFilter: { cutoff: 2200, q: 1.6 },
    dubDelay: { repeats: 3, stepOffset: 2, feedbackGain: 0.28 },
    melodySuggested: true,
  },

  gritty: {
    vibeId: 'gritty',
    scale: { root: 'A', mode: 'minor' },
    chord: { root: 'A', quality: 'minor' },
    bassNotes: [33, 33, 33, 34],
    rhythmPattern: [true, false, false, false, false, false, false, false, true, false, false, false, false, false, false, false],
    noisePattern: [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false],
    chordStabPattern: STAB_SPARSE,
    soundLayers: [
      { role: 'bass', descriptor: 'distorted sub, heavy clipping' },
      { role: 'pad',  descriptor: 'lo-fi reverb smear, no definition' },
      { role: 'drum', descriptor: 'hard muffled kick, beats 1 and 3' },
    ],
    bpmRange: [132, 138],
    kickFilter: { cutoff: 80,   q: 3.0 },
    bassFilter: { cutoff: 200,  q: 2.2 },
    noiseFilter: { cutoff: 6000, q: 2.0 },  // 粗く共鳴するダーティハット
    chordStabFilter: { cutoff: 800, q: 2.0 },
    dubDelay: { repeats: 3, stepOffset: 3, feedbackGain: 0.46 },
    melodySuggested: true,
  },

  euphoric: {
    vibeId: 'euphoric',
    scale: { root: 'A', mode: 'major' },
    chord: { root: 'A', quality: 'major' },
    bassNotes: [33, 33, 40, 33],
    rhythmPattern: [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false],
    noisePattern: HAT_ALL8,
    chordStabPattern: STAB_DUB,
    soundLayers: [
      { role: 'bass', descriptor: 'driving saw sub, peak-time energy' },
      { role: 'pad',  descriptor: 'bright wide reverb, uplifting swell' },
      { role: 'drum', descriptor: 'four-on-floor, powerful and clean' },
    ],
    bpmRange: [132, 138],
    kickFilter: { cutoff: 155,   q: 1.1 },
    bassFilter: { cutoff: 800,   q: 0.5 },
    noiseFilter: { cutoff: 11000, q: 0.7 }, // ブライトでパワフル、ピークタイム
    chordStabFilter: { cutoff: 2400, q: 0.6 },
    dubDelay: { repeats: 4, stepOffset: 2, feedbackGain: 0.26 },
    melodySuggested: true,
  },

  // ── Deconstructed / Textural ─────────────────────────────────────────────

  unstable: {
    vibeId: 'unstable',
    scale: { root: 'C#', mode: 'whole_tone' },
    chord: { root: 'C#', quality: 'dominant7' },
    bassNotes: [37, 39, 41, 39],
    rhythmPattern: [true, false, false, false, false, false, false, true, false, false, false, false, true, false, false, false],
    noisePattern: [false, false, false, true, false, false, true, false, false, false, false, true, false, true, false, false],
    chordStabPattern: [false, false, false, true, false, false, false, false, false, false, true, false, false, false, false, true],
    soundLayers: [
      { role: 'bass', descriptor: 'floating whole-tone bass, unresolved' },
      { role: 'pad',  descriptor: 'deconstructed reverb cluster, no tonal center' },
      { role: 'drum', descriptor: 'displaced kick, metric ambiguity' },
    ],
    bpmRange: [125, 132],
    kickFilter: { cutoff: 110,  q: 2.0 },
    bassFilter: { cutoff: 280,  q: 1.4 },
    noiseFilter: { cutoff: 8000, q: 1.8 }, // 不規則で共鳴する不安定なハット
    chordStabFilter: { cutoff: 1300, q: 1.9 },
    dubDelay: { repeats: 3, stepOffset: 3, feedbackGain: 0.37 },
    melodySuggested: true,
  },

  retrowave: {
    vibeId: 'retrowave',
    scale: { root: 'A', mode: 'dorian' },
    chord: { root: 'A', quality: 'minor7' },
    bassNotes: [33, 33, 40, 33],
    rhythmPattern: [true, false, false, false, false, false, false, false, true, false, false, false, false, false, false, true],
    noisePattern: HAT_QTR,
    chordStabPattern: STAB_DUB,
    soundLayers: [
      { role: 'bass', descriptor: 'classic dub sub, echo repeat' },
      { role: 'pad',  descriptor: 'spring reverb chord, vintage dub tone' },
      { role: 'arp',  descriptor: 'dub echo repeat, quarter-note delay' },
      { role: 'drum', descriptor: 'dub kick, step 0/8/15' },
    ],
    bpmRange: [126, 132],
    kickFilter: { cutoff: 115,  q: 1.8 },
    bassFilter: { cutoff: 350,  q: 1.0 },
    noiseFilter: { cutoff: 9000, q: 0.8 }, // クラシックなクローズドハット
    chordStabFilter: { cutoff: 1500, q: 1.0 },
    dubDelay: { repeats: 4, stepOffset: 3, feedbackGain: 0.34 },
    melodySuggested: true,
  },

};
