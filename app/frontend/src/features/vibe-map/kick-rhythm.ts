import type { RhythmPattern } from './types';

export type KickRhythmProfileId =
  | 'four-on-floor'
  | 'half-time'
  | 'late-push'
  | 'broken-dub'
  | 'one-drop-ish'
  | 'sparse-cavern'
  | 'rolling-extra';

export interface KickRhythmProfile {
  id: KickRhythmProfileId;
  label: string;
  pattern: RhythmPattern;
}

export const KICK_RHYTHM_PROFILES: readonly KickRhythmProfile[] = [
  {
    id: 'four-on-floor',
    label: 'Four on floor',
    pattern: [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false],
  },
  {
    id: 'half-time',
    label: 'Half time',
    pattern: [true, false, false, false, false, false, false, false, true, false, false, false, false, false, false, false],
  },
  {
    id: 'late-push',
    label: 'Late push',
    pattern: [true, false, false, false, false, false, true, false, true, false, false, false, false, false, true, false],
  },
  {
    id: 'broken-dub',
    label: 'Broken dub',
    pattern: [true, false, false, false, false, false, true, false, false, false, true, false, false, false, true, false],
  },
  {
    id: 'one-drop-ish',
    label: 'One drop-ish',
    pattern: [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false],
  },
  {
    id: 'sparse-cavern',
    label: 'Sparse cavern',
    pattern: [true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true],
  },
  {
    id: 'rolling-extra',
    label: 'Rolling extra',
    pattern: [true, false, false, false, true, false, true, false, true, false, false, false, true, false, true, false],
  },
];

export function pickKickRhythmProfile(random: () => number = Math.random): KickRhythmProfile {
  const index = Math.floor(random() * KICK_RHYTHM_PROFILES.length);
  return KICK_RHYTHM_PROFILES[Math.min(index, KICK_RHYTHM_PROFILES.length - 1)];
}
