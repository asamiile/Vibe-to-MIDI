import { getScaleNotes, getModeIntervals } from '../src/lib/scales';

describe('getModeIntervals', () => {
  it('minor has 7 intervals starting at 0', () => {
    const intervals = getModeIntervals('minor');
    expect(intervals).toHaveLength(7);
    expect(intervals[0]).toBe(0);
  });

  it('whole_tone has 6 intervals', () => {
    expect(getModeIntervals('whole_tone')).toHaveLength(6);
  });

  it('minor intervals are [0,2,3,5,7,8,10]', () => {
    expect(getModeIntervals('minor')).toEqual([0, 2, 3, 5, 7, 8, 10]);
  });

  it('major intervals are [0,2,4,5,7,9,11]', () => {
    expect(getModeIntervals('major')).toEqual([0, 2, 4, 5, 7, 9, 11]);
  });
});

describe('getScaleNotes', () => {
  it('A minor octave 3 starts at midi 57 (A3)', () => {
    const notes = getScaleNotes('A', 'minor', 3);
    expect(notes[0]).toBe(57); // A3
    expect(notes).toHaveLength(7);
  });

  it('C major octave 4 starts at midi 60 (C4)', () => {
    const notes = getScaleNotes('C', 'major', 4);
    expect(notes[0]).toBe(60); // C4
    expect(notes[4]).toBe(67); // G4
  });

  it('each note is higher than the previous', () => {
    const notes = getScaleNotes('D', 'dorian', 3);
    for (let i = 1; i < notes.length; i++) {
      expect(notes[i]).toBeGreaterThan(notes[i - 1]);
    }
  });

  it('handles flat root via enharmonic (Bb = A#)', () => {
    const notes = getScaleNotes('Bb', 'major', 3);
    expect(notes[0]).toBe(58); // A#3 / Bb3
  });
});
