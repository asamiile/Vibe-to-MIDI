export const RANDOM_BPM_MIN = 112;
export const RANDOM_BPM_MAX = 124;

export function pickRandomBpm(random: () => number = Math.random): number {
  const span = RANDOM_BPM_MAX - RANDOM_BPM_MIN + 1;
  return RANDOM_BPM_MIN + Math.floor(random() * span);
}
