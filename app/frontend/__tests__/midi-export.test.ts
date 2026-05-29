import { Midi } from '@tonejs/midi';
import { buildMidiExport } from '../src/features/midi-export/export-midi';
import { getMusicalSuggestion } from '../src/features/vibe-map/engine';

describe('buildMidiExport', () => {
  it('exports a parseable MIDI file with tempo and DAW tracks', () => {
    const exported = buildMidiExport(getMusicalSuggestion('repetitive'));
    const parsed = new Midi(exported.bytes);

    expect(exported.filename).toMatch(/^vibe-to-midi-repetitive-c-minor-c-minor7\.mid$/);
    expect(exported.bytes.length).toBeGreaterThan(100);
    expect(parsed.header.tempos[0].bpm).toBe(exported.summary.bpm);
    expect(parsed.header.timeSignatures[0].timeSignature).toEqual([4, 4]);
    expect(parsed.tracks.map((track) => track.name)).toEqual([
      'Bass',
      'Chord stab',
      'Kick',
      'Noise',
    ]);
  });

  it('writes bass, chord, kick, and noise note events', () => {
    const exported = buildMidiExport(getMusicalSuggestion('repetitive'));
    const parsed = new Midi(exported.bytes);
    const [bass, chord, kick, noise] = parsed.tracks;
    const ticksPerStep = parsed.header.ppq / 4;

    expect(bass.notes).toHaveLength(4);
    expect(bass.notes.map((note) => note.ticks)).toEqual([
      0,
      4 * ticksPerStep,
      8 * ticksPerStep,
      12 * ticksPerStep,
    ]);
    expect(bass.notes.every((note) => note.durationTicks === Math.round(ticksPerStep * 3.5))).toBe(true);

    expect(chord.notes.length).toBeGreaterThan(0);
    expect(chord.notes.every((note) => note.durationTicks === ticksPerStep)).toBe(true);

    expect(kick.notes.map((note) => note.midi)).toEqual([36, 36, 36, 36]);
    expect(noise.notes.length).toBeGreaterThan(0);
    expect(noise.notes.every((note) => note.midi === 42)).toBe(true);
  });
});
