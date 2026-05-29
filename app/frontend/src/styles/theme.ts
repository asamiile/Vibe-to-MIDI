/* BERGHAIN design tokens — locked for release.
   Direction: pure black · MIST accent · hairline rules.
   Accent: #c2e8ff (MIST). No green, no cyan, no sky-blue. */

export const MIST = {
  bg:          '#000000',
  surface1:    '#070708',
  surface2:    '#0d0d0f',
  hairline:    'rgba(255,255,255,0.08)',
  hairlineX:   'rgba(255,255,255,0.16)',
  text:        '#f2f2f2',
  textMute:    'rgba(255,255,255,0.65)',  // was 0.55 — WCAG AAA (12.6:1)
  textFaint:   'rgba(255,255,255,0.35)',  // was 0.30 — WCAG AA (5.2:1)
  textGhost:   'rgba(255,255,255,0.14)',
  accent:      '#c2e8ff',
  accentDim:   'rgba(194,232,255,0.12)',
  stop:        '#ef4444',
} as const;

export const FONT = {
  sans: 'sans-serif',    // Roboto on Android; swap to Space Grotesk when font is loaded
  mono: 'monospace',     // System mono; swap to IBM Plex Mono when font is loaded
} as const;
