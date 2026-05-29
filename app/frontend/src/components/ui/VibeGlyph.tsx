import React from 'react';
import { Text } from 'react-native';
import type { VibeId } from '../../features/vibe-map/types';
import { MIST } from '../../styles/theme';

/* Geometric Unicode glyphs — one per vibe.
   Avoids react-native-svg (native rebuild required).
   Symbols are chosen to match the feel of each vibe. */
const GLYPHS: Record<VibeId, string> = {
  dark:        '●',   // solid fill — void
  floating:    '◌',   // open dotted ring — lifted
  tense:       '⟨⟩',  // converging angles
  repetitive:  '···', // equal pulses
  underground: '↓',   // descent
  wide:        '─',   // extended line
  hypnotic:    '◎',   // concentric rings
  metallic:    '◑',   // half-filled split
  warm:        '✦',   // four-point star
  deep:        '⊙',   // circled dot — nested
  rolling:     '∿',   // sine wave
  cavernous:   '○',   // vast empty circle
  dry:         '−',   // single mark
  unstable:    '⊘',   // broken ring
  groovy:      '∴',   // staggered dots
  nostalgic:   '⌒',   // arc
  retrowave:   '△',   // rising peak
  gritty:      '⁘',   // scattered dust
  euphoric:    '▲',   // peak
  cinematic:   '□',   // frame
  lucid:       '✸',   // dense rays — clear, radiant
  void:        '∅',   // empty set — void, null
  corroded:    '≋',   // triple wave — degraded, corroded
  static:      '▒',   // medium shade — noise static
  raw:         '◼',   // solid square — unprocessed, blunt
};

interface Props {
  id: VibeId;
  size?: number;
  color?: string;
}

export function VibeGlyph({ id, size = 32, color = MIST.text }: Props) {
  return (
    <Text
      style={{
        fontSize: size * 0.72,
        color,
        lineHeight: size,
        textAlign: 'center',
        includeFontPadding: false,
      }}
    >
      {GLYPHS[id] ?? '·'}
    </Text>
  );
}
