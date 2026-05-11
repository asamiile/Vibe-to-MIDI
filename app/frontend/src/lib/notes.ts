const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const;

const ENHARMONIC: Record<string, string> = {
  Db: 'C#',
  Eb: 'D#',
  Fb: 'E',
  Gb: 'F#',
  Ab: 'G#',
  Bb: 'A#',
  Cb: 'B',
};

export function normalizeNoteName(name: string): string {
  return ENHARMONIC[name] ?? name;
}

export function noteNameToMidi(name: string, octave: number): number {
  const normalized = normalizeNoteName(name);
  const idx = NOTE_NAMES.indexOf(normalized as (typeof NOTE_NAMES)[number]);
  if (idx === -1) throw new Error(`Unknown note name: ${name}`);
  return (octave + 1) * 12 + idx;
}

export function midiToNoteName(midi: number): string {
  const octave = Math.floor(midi / 12) - 1;
  const idx = midi % 12;
  return `${NOTE_NAMES[idx]}${octave}`;
}

export function noteFreq(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

export function midiToNoteIndex(midi: number): number {
  return midi % 12;
}
