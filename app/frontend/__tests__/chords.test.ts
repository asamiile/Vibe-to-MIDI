import { getChordIntervals, getChordNotes } from '../src/lib/chords';

describe('getChordIntervals', () => {
  it('returns minor7 intervals', () => {
    expect(getChordIntervals('minor7')).toEqual([0, 3, 7, 10]);
  });

  it('returns minor9 intervals', () => {
    expect(getChordIntervals('minor9')).toEqual([0, 3, 7, 10, 14]);
  });
});

describe('getChordNotes', () => {
  it('builds C minor7 from octave 3', () => {
    expect(getChordNotes('C', 'minor7', 3)).toEqual([48, 51, 55, 58]);
  });

  it('handles flat roots via enharmonic names', () => {
    expect(getChordNotes('Bb', 'minor', 3)).toEqual([58, 61, 65]);
  });
});
