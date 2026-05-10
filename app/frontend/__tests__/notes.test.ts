import { midiToNoteName, noteNameToMidi, noteFreq, normalizeNoteName } from '../src/lib/notes';

describe('normalizeNoteName', () => {
  it('maps Bb to A#', () => expect(normalizeNoteName('Bb')).toBe('A#'));
  it('maps Eb to D#', () => expect(normalizeNoteName('Eb')).toBe('D#'));
  it('passes through C unchanged', () => expect(normalizeNoteName('C')).toBe('C'));
});

describe('noteNameToMidi', () => {
  it('C4 = 60', () => expect(noteNameToMidi('C', 4)).toBe(60));
  it('A4 = 69', () => expect(noteNameToMidi('A', 4)).toBe(69));
  it('C#4 = 61', () => expect(noteNameToMidi('C#', 4)).toBe(61));
  it('C0 = 12', () => expect(noteNameToMidi('C', 0)).toBe(12));
});

describe('midiToNoteName', () => {
  it('60 = C4', () => expect(midiToNoteName(60)).toBe('C4'));
  it('69 = A4', () => expect(midiToNoteName(69)).toBe('A4'));
  it('61 = C#4', () => expect(midiToNoteName(61)).toBe('C#4'));
});

describe('round-trip', () => {
  it('C4 survives midi → name → midi', () => {
    const midi = noteNameToMidi('C', 4);
    expect(midiToNoteName(midi)).toBe('C4');
  });
  it('G#3 survives midi → name → midi', () => {
    const midi = noteNameToMidi('G#', 3);
    expect(midiToNoteName(midi)).toBe('G#3');
  });
});

describe('noteFreq', () => {
  it('A4 (midi 69) = 440 Hz', () => {
    expect(noteFreq(69)).toBeCloseTo(440, 2);
  });
  it('A3 (midi 57) = 220 Hz', () => {
    expect(noteFreq(57)).toBeCloseTo(220, 2);
  });
  it('C4 (midi 60) ≈ 261.63 Hz', () => {
    expect(noteFreq(60)).toBeCloseTo(261.63, 1);
  });
});
