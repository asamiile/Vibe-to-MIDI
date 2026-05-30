export type KickVariantId =
  | 'deep-sine'
  | 'soft-909'
  | 'muffled-room'
  | 'saturated-thump'
  | 'industrial-stomp'
  | 'short-click'
  | 'sub-boom'
  | 'rubber-kick'
  | 'dusty-tap'
  | 'hard-ping';
export type BassVariantId =
  | 'saw-sub'
  | 'sine-sub'
  | 'triangle-round'
  | 'filtered-pulse'
  | 'acid-round'
  | 'dub-pluck-sub'
  | 'wide-low-mid'
  | 'distorted-rumble'
  | 'sine-drop';
export type StabVariantId =
  | 'saw-minor'
  | 'square-saw'
  | 'sampled-chord-like'
  | 'wide-detuned'
  | 'hollow-organ'
  | 'bell-like'
  | 'rootless-voicing'
  | 'octave-shadow'
  | 'short-muted'
  | 'long-smear'
  | 'inverted-stab'
  | 'dub-minor'
  | 'dub-sus4'
  | 'dub-minor9';
export type NoiseVariantId =
  | 'tape-hiss'
  | 'closed-hat'
  | 'vinyl-floor'
  | 'bandpass-tick'
  | 'noise-burst'
  | 'noise-floor'
  | 'resonant-crack'
  | 'shaker-dust'
  | 'open-air-hat'
  | 'metal-tick'
  | 'sidechain-floor'
  | 'tape-clicks';
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

export const KICK_VARIANT_IDS: readonly KickVariantId[] = [
  'deep-sine',
  'soft-909',
  'muffled-room',
  'saturated-thump',
  'industrial-stomp',
  'short-click',
  'sub-boom',
  'rubber-kick',
  'dusty-tap',
  'hard-ping',
];

export const BASS_VARIANT_IDS: readonly BassVariantId[] = [
  'saw-sub',
  'sine-sub',
  'triangle-round',
  'filtered-pulse',
  'acid-round',
  'dub-pluck-sub',
  'wide-low-mid',
  'distorted-rumble',
  'sine-drop',
];

export const NOISE_VARIANT_IDS: readonly NoiseVariantId[] = [
  'tape-hiss',
  'closed-hat',
  'vinyl-floor',
  'bandpass-tick',
  'noise-burst',
  'noise-floor',
  'resonant-crack',
  'shaker-dust',
  'open-air-hat',
  'metal-tick',
  'sidechain-floor',
  'tape-clicks',
];

export const STAB_VARIANT_IDS: readonly StabVariantId[] = [
  'saw-minor',
  'square-saw',
  'sampled-chord-like',
  'wide-detuned',
  'hollow-organ',
  'bell-like',
  'rootless-voicing',
  'octave-shadow',
  'short-muted',
  'long-smear',
  'inverted-stab',
  'dub-minor',
  'dub-sus4',
  'dub-minor9',
];

export function pickKickVariant(random: () => number = Math.random): KickVariantId {
  const index = Math.floor(random() * KICK_VARIANT_IDS.length);
  return KICK_VARIANT_IDS[Math.min(index, KICK_VARIANT_IDS.length - 1)];
}

export function pickBassVariant(random: () => number = Math.random): BassVariantId {
  const index = Math.floor(random() * BASS_VARIANT_IDS.length);
  return BASS_VARIANT_IDS[Math.min(index, BASS_VARIANT_IDS.length - 1)];
}

export function pickNoiseVariant(random: () => number = Math.random): NoiseVariantId {
  const index = Math.floor(random() * NOISE_VARIANT_IDS.length);
  return NOISE_VARIANT_IDS[Math.min(index, NOISE_VARIANT_IDS.length - 1)];
}

export function pickStabVariant(random: () => number = Math.random): StabVariantId {
  const index = Math.floor(random() * STAB_VARIANT_IDS.length);
  return STAB_VARIANT_IDS[Math.min(index, STAB_VARIANT_IDS.length - 1)];
}

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
    {
      id: 'short-click',
      name: 'Short click',
      type: 'Drum synth',
      source: 'short sine body with sharp click transient',
      target: 'drum rack kick slot',
      fxRole: 'short decay, click layer, tight lowpass',
      playback: 'preview',
    },
    {
      id: 'sub-boom',
      name: 'Sub boom',
      type: 'Mono synth',
      source: 'low sine boom with slow pitch fall',
      target: 'synth track or drum synth slot',
      fxRole: 'long decay, dark lowpass, low transient',
      playback: 'preview',
    },
    {
      id: 'rubber-kick',
      name: 'Rubber kick',
      type: 'Drum synth',
      source: 'rounded elastic pitch drop',
      target: 'drum rack kick slot',
      fxRole: 'medium decay, soft transient, light drive',
      playback: 'preview',
    },
    {
      id: 'dusty-tap',
      name: 'Dusty tap',
      type: 'Drum synth',
      source: 'quiet dusty pulse under lowpass',
      target: 'drum rack kick or percussion slot',
      fxRole: 'low gain, short decay, dark lowpass',
      playback: 'preview',
    },
    {
      id: 'hard-ping',
      name: 'Hard ping',
      type: 'Drum synth',
      source: 'high pitched click into compact sub body',
      target: 'drum rack kick slot',
      fxRole: 'fast pitch drop, bright click, clipped transient',
      playback: 'preview',
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
    {
      id: 'acid-round',
      name: 'Acid round',
      type: 'Mono bass synth',
      source: 'rounded pulse bass with resonant lowpass',
      target: 'bass synth track',
      fxRole: 'resonant lowpass, light drive, short envelope',
      playback: 'preview',
    },
    {
      id: 'dub-pluck-sub',
      name: 'Dub pluck sub',
      type: 'Mono bass synth',
      source: 'short sine/triangle sub pluck',
      target: 'bass synth track',
      fxRole: 'short amp envelope, dark lowpass',
      playback: 'preview',
    },
    {
      id: 'wide-low-mid',
      name: 'Wide low-mid',
      type: 'Layered bass synth',
      source: 'centered sub with quiet octave low-mid layer',
      target: 'bass synth track',
      fxRole: 'lowpass, subtle width on upper layer',
      playback: 'preview',
    },
    {
      id: 'distorted-rumble',
      name: 'Distorted rumble',
      type: 'Mono bass synth',
      source: 'dark saw/square sub with clipped low mids',
      target: 'bass synth track',
      fxRole: 'waveshape, lowpass, gain trim',
      playback: 'preview',
    },
    {
      id: 'sine-drop',
      name: 'Sine drop',
      type: 'Mono bass synth',
      source: 'sine sub with a soft pitch-drop feel',
      target: 'bass synth track',
      fxRole: 'lowpass, slow envelope, subtle pitch fall',
      playback: 'preview',
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
    {
      id: 'shaker-dust',
      name: 'Shaker dust',
      type: 'Noise synth',
      source: 'fine-grain short noise ticks',
      target: 'noise or shaker synth track',
      fxRole: 'high bandpass, short decay, low gain',
      playback: 'preview',
    },
    {
      id: 'open-air-hat',
      name: 'Open air hat',
      type: 'Noise synth',
      source: 'longer airy hat wash',
      target: 'hat or noise synth track',
      fxRole: 'wide bandpass, longer decay, soft lowpass',
      playback: 'preview',
    },
    {
      id: 'metal-tick',
      name: 'Metal tick',
      type: 'Noise synth',
      source: 'bright metallic resonant tick',
      target: 'percussion synth slot',
      fxRole: 'high-Q bandpass, short decay',
      playback: 'preview',
    },
    {
      id: 'sidechain-floor',
      name: 'Sidechain floor',
      type: 'Noise bed',
      source: 'continuous floor with kick-ducking guidance',
      target: 'noise bed track',
      fxRole: 'highpass, lowpass, sidechain from kick',
      playback: 'preview',
    },
    {
      id: 'tape-clicks',
      name: 'Tape clicks',
      type: 'Noise synth',
      source: 'small tape-style clicks and dusty ticks',
      target: 'noise or percussion track',
      fxRole: 'bandpass, random-like placement, low gain',
      playback: 'preview',
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
    {
      id: 'hollow-organ',
      name: 'Hollow organ',
      type: 'Poly synth',
      source: 'odd-harmonic additive chord (1st + 3rd + 5th partials)',
      target: 'poly synth track',
      fxRole: 'lowpass, dub delay',
      playback: 'preview',
    },
    {
      id: 'bell-like',
      name: 'Bell-like',
      type: 'Poly synth',
      source: 'inharmonic additive chord (2nd + 4th + 7th partials)',
      target: 'poly synth track',
      fxRole: 'lowpass, short decay, dub delay',
      playback: 'guidance',
    },
    {
      id: 'rootless-voicing',
      name: 'Rootless voicing',
      type: 'Poly synth',
      source: 'chord stab with root reduced or removed',
      target: 'poly synth track',
      fxRole: 'lowpass, dub delay, leave bass to carry root',
      playback: 'preview',
    },
    {
      id: 'octave-shadow',
      name: 'Octave shadow',
      type: 'Poly synth',
      source: 'main stab with a quiet upper-octave shadow',
      target: 'poly synth track',
      fxRole: 'lowpass, width, dub delay',
      playback: 'preview',
    },
    {
      id: 'short-muted',
      name: 'Short muted',
      type: 'Poly synth',
      source: 'tight filtered chord stab',
      target: 'poly synth track',
      fxRole: 'short envelope, darker lowpass',
      playback: 'preview',
    },
    {
      id: 'long-smear',
      name: 'Long smear',
      type: 'Poly synth',
      source: 'longer smeared chord tail',
      target: 'poly synth track',
      fxRole: 'long envelope, lowpass, heavier delay send',
      playback: 'preview',
    },
    {
      id: 'inverted-stab',
      name: 'Inverted stab',
      type: 'Poly synth',
      source: 'inverted chord voicing for suspended movement',
      target: 'poly synth track',
      fxRole: 'lowpass, dub delay',
      playback: 'preview',
    },
    {
      id: 'dub-minor',
      name: 'Dub minor',
      type: 'Poly synth',
      source: 'dark saw and square blend minor chord',
      target: 'poly synth track',
      fxRole: 'lowpass sweep, dub delay',
      playback: 'preview',
    },
    {
      id: 'dub-sus4',
      name: 'Dub sus4',
      type: 'Poly synth',
      source: 'dark saw and square blend sus4 chord',
      target: 'poly synth track',
      fxRole: 'lowpass sweep, dub delay',
      playback: 'preview',
    },
    {
      id: 'dub-minor9',
      name: 'Dub minor 9',
      type: 'Poly synth',
      source: 'deep minor 9th voicing',
      target: 'poly synth track',
      fxRole: 'lowpass sweep, heavy dub delay',
      playback: 'preview',
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
