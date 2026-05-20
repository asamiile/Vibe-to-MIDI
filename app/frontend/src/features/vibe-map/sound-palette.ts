export type KickVariantId = 'deep-sine' | 'soft-909' | 'muffled-room' | 'saturated-thump' | 'industrial-stomp';
export type BassVariantId = 'saw-sub' | 'sine-sub' | 'triangle-round' | 'filtered-pulse';
export type StabVariantId = 'saw-minor' | 'square-saw' | 'sampled-chord-like' | 'wide-detuned';
export type NoiseVariantId = 'tape-hiss' | 'closed-hat' | 'vinyl-floor' | 'bandpass-tick' | 'noise-burst' | 'noise-floor' | 'resonant-crack';
export type SpaceVariantId = 'short-dub' | 'deep-feedback' | 'spring-style' | 'dark-plate';

export type SoundPaletteLayer = 'kick' | 'bass' | 'noise' | 'stab' | 'space';

export interface SoundVariant {
  id: string;
  name: string;
  type: string;
  source: string;
  target: string;
  fxRole: string;
  playback: 'preview' | 'guidance';
}

export interface SoundVariantSelection {
  kick: KickVariantId;
  bass: BassVariantId;
  noise: NoiseVariantId;
  stab: StabVariantId;
  space: SpaceVariantId;
}

export const DEFAULT_SOUND_VARIANTS: SoundVariantSelection = {
  kick: 'deep-sine',
  bass: 'saw-sub',
  noise: 'tape-hiss',
  stab: 'saw-minor',
  space: 'deep-feedback',
};

export const SOUND_PALETTE: Record<SoundPaletteLayer, readonly SoundVariant[]> = {
  kick: [
    {
      id: 'deep-sine',
      name: 'Deep sine',
      type: 'Mono synth',
      source: 'sine oscillator with pitch drop',
      target: 'synth track or drum synth slot',
      fxRole: 'lowpass, long decay',
      playback: 'preview',
    },
    {
      id: 'soft-909',
      name: 'Soft 909',
      type: 'Drum synth',
      source: 'filtered 909-like synth kick',
      target: 'drum rack kick slot',
      fxRole: 'lowpass, light saturation',
      playback: 'guidance',
    },
    {
      id: 'muffled-room',
      name: 'Muffled room',
      type: 'Drum synth',
      source: 'soft kick with dark room tail',
      target: 'drum rack kick slot',
      fxRole: 'lowpass, short room, low transient',
      playback: 'guidance',
    },
    {
      id: 'saturated-thump',
      name: 'Saturated thump',
      type: 'Mono synth',
      source: 'sine/sub kick with clipped transient',
      target: 'synth track or drum synth slot',
      fxRole: 'soft clip, lowpass, gain trim',
      playback: 'guidance',
    },
    {
      id: 'industrial-stomp',
      name: 'Industrial stomp',
      type: 'Mono synth',
      source: 'heavy clipped sine kick, hard transient, dark body',
      target: 'synth track or drum synth slot',
      fxRole: 'soft clip, lowpass dark, slow pitch drop',
      playback: 'guidance',
    },
  ],
  bass: [
    {
      id: 'saw-sub',
      name: 'Saw sub',
      type: 'Mono bass synth',
      source: 'sawtooth sub + quiet triangle octave',
      target: 'bass synth track',
      fxRole: 'lowpass, minimal movement',
      playback: 'preview',
    },
    {
      id: 'sine-sub',
      name: 'Sine sub',
      type: 'Mono bass synth',
      source: 'clean sine sub',
      target: 'bass synth track',
      fxRole: 'lowpass, subtle saturation',
      playback: 'guidance',
    },
    {
      id: 'triangle-round',
      name: 'Triangle round',
      type: 'Mono bass synth',
      source: 'triangle oscillator with soft body',
      target: 'bass synth track',
      fxRole: 'lowpass, slow envelope',
      playback: 'guidance',
    },
    {
      id: 'filtered-pulse',
      name: 'Filtered pulse',
      type: 'Mono bass synth',
      source: 'narrow pulse wave under lowpass',
      target: 'bass synth track',
      fxRole: 'lowpass, resonance, light drive',
      playback: 'guidance',
    },
  ],
  noise: [
    {
      id: 'tape-hiss',
      name: 'Tape hiss',
      type: 'Noise synth',
      source: 'filtered tape-noise partials',
      target: 'noise synth track',
      fxRole: 'bandpass -> lowpass',
      playback: 'preview',
    },
    {
      id: 'closed-hat',
      name: 'Closed hat',
      type: 'Noise or hat synth',
      source: 'short closed-hat noise',
      target: 'drum rack hat slot',
      fxRole: 'bandpass, short decay',
      playback: 'guidance',
    },
    {
      id: 'vinyl-floor',
      name: 'Vinyl floor',
      type: 'Noise synth',
      source: 'low-level vinyl floor / dust',
      target: 'noise bed track',
      fxRole: 'highpass, lowpass, sidechain optional',
      playback: 'guidance',
    },
    {
      id: 'bandpass-tick',
      name: 'Bandpass tick',
      type: 'Noise synth',
      source: 'short resonant noise tick',
      target: 'drum rack percussion slot',
      fxRole: 'narrow bandpass, very short decay',
      playback: 'guidance',
    },
    {
      id: 'noise-burst',
      name: 'Noise burst',
      type: 'Noise synth',
      source: 'short broadband noise burst',
      target: 'noise synth track',
      fxRole: 'lowpass, wide bandpass, sharp decay',
      playback: 'guidance',
    },
    {
      id: 'noise-floor',
      name: 'Noise floor',
      type: 'Noise synth',
      source: 'continuous overlapping noise bed',
      target: 'noise bed track',
      fxRole: 'highpass, lowpass, long decay overlap',
      playback: 'guidance',
    },
    {
      id: 'resonant-crack',
      name: 'Resonant crack',
      type: 'Noise synth',
      source: 'high-Q bandpass noise snap',
      target: 'drum rack percussion slot',
      fxRole: 'narrow bandpass, very short decay, high resonance',
      playback: 'guidance',
    },
  ],
  stab: [
    {
      id: 'saw-minor',
      name: 'Saw minor',
      type: 'Poly synth',
      source: 'sawtooth chord',
      target: 'poly synth track',
      fxRole: 'lowpass -> dub delay',
      playback: 'preview',
    },
    {
      id: 'square-saw',
      name: 'Square saw',
      type: 'Poly synth',
      source: 'square + saw chord blend',
      target: 'poly synth track',
      fxRole: 'lowpass, chorus optional, dub delay',
      playback: 'guidance',
    },
    {
      id: 'sampled-chord-like',
      name: 'Sampled chord-like',
      type: 'Sampler or poly synth',
      source: 'short rendered chord hit or sampler-style stab',
      target: 'sampler or poly synth track',
      fxRole: 'lowpass, envelope trim, dub delay',
      playback: 'guidance',
    },
    {
      id: 'wide-detuned',
      name: 'Wide detuned',
      type: 'Poly synth',
      source: 'detuned saw chord with stereo spread',
      target: 'poly synth track',
      fxRole: 'lowpass, width, dark reverb, dub delay',
      playback: 'guidance',
    },
  ],
  space: [
    {
      id: 'short-dub',
      name: 'Short dub',
      type: 'FX profile',
      source: 'short feedback delay',
      target: 'return track or insert after stab',
      fxRole: '2 repeats, low feedback',
      playback: 'guidance',
    },
    {
      id: 'deep-feedback',
      name: 'Deep feedback',
      type: 'FX profile',
      source: 'long feedback delay',
      target: 'return track or insert after stab',
      fxRole: '3-5 repeats, filtered feedback',
      playback: 'preview',
    },
    {
      id: 'spring-style',
      name: 'Spring style',
      type: 'FX profile',
      source: 'spring-style reverb into echo',
      target: 'return track',
      fxRole: 'spring reverb color, tape echo feel',
      playback: 'guidance',
    },
    {
      id: 'dark-plate',
      name: 'Dark plate',
      type: 'FX profile',
      source: 'dark plate reverb after delay',
      target: 'return track',
      fxRole: 'dark reverb wash, lowpass return',
      playback: 'guidance',
    },
  ],
} as const;

export function getSoundVariant(layer: 'kick', id: KickVariantId): SoundVariant;
export function getSoundVariant(layer: 'bass', id: BassVariantId): SoundVariant;
export function getSoundVariant(layer: 'noise', id: NoiseVariantId): SoundVariant;
export function getSoundVariant(layer: 'stab', id: StabVariantId): SoundVariant;
export function getSoundVariant(layer: 'space', id: SpaceVariantId): SoundVariant;
export function getSoundVariant(layer: SoundPaletteLayer, id: string): SoundVariant {
  return SOUND_PALETTE[layer].find((variant) => variant.id === id) ?? SOUND_PALETTE[layer][0];
}

export function soundVariantOptions(layer: SoundPaletteLayer, selectedId: string): string {
  return SOUND_PALETTE[layer]
    .filter((variant) => variant.id !== selectedId)
    .map((variant) => variant.name)
    .join(', ');
}
