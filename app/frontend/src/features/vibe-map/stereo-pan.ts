import type { StereoPanSpec } from './types';

const MAX_PAN = 0.18;  // subtle spread — keeps mono compatibility

export function buildRandomStereoPan(random: () => number = Math.random): StereoPanSpec {
  const sign = () => (random() < 0.5 ? -1 : 1);
  const amount = () => sign() * random() * MAX_PAN;
  return {
    bass:  amount(),
    noise: amount(),
    stab:  amount(),
  };
}
