export type AudioLayer = 'kick' | 'bass' | 'noise' | 'melody';

export const ALL_AUDIO_LAYERS: readonly AudioLayer[] = ['kick', 'bass', 'noise', 'melody'];

export const AUDIO_PARAMS = {
  bpmMin: 80,
  bpmMax: 120,
  kick: { startFreq: 120, endFreq: 30, pitchDecayMs: 140, filterFreq: 110, filterQ: 2.0, decayMs: 450 },
  bass: { gainRatio: 1.0, octaveBlend: 0.28, filterFreq: 400, filterQ: 0.8 },
  noise: { filterFreq: 9000, filterQ: 0.8, decayMs: 60, gainRatio: 0.35 },
  melody: { gainRatio: 0.42, attackMs: 6, decayMs: 180, sustainRatio: 0.35, filterFreq: 1400, filterQ: 1.0 },
} as const;
