import { buildDawStepsView } from '../src/features/vibe-map/daw-view';
import { getMusicalSuggestion } from '../src/features/vibe-map/engine';

describe('buildDawStepsView', () => {
  it('exposes DAW-entry rows for notes, steps, filters, and echo', () => {
    const view = buildDawStepsView(getMusicalSuggestion('deep'));

    expect(view.bpm).toBeLessThanOrEqual(120);
    expect(view.rawBpm).toBeGreaterThanOrEqual(view.bpm);
    expect(view.kickPattern).toHaveLength(16);

    expect(view.setupRows.map((row) => row.label)).toEqual([
      'Tempo',
      'Grid',
    ]);

    expect(view.sequenceRows.map((row) => row.label)).toEqual([
      'Bass notes',
      'Bass placement',
      'Chord notes',
      'Chord placement',
      'Kick steps',
      'Noise steps',
      'Scale reference',
    ]);

    expect(view.sequenceRows.find((row) => row.label === 'Chord notes')?.value)
      .toContain('C minor9: C3 (48)  D#3 (51)  G3 (55)  A#3 (58)  D4 (62)');
    expect(view.sequenceRows.find((row) => row.label === 'Chord placement')?.value)
      .toBe('steps 9; length 1 step each');
    expect(view.trackSetupRows.map((row) => row.label)).toEqual([
      'Kick',
      'Bass',
      'Noise',
      'Chord stab',
      'Space',
    ]);
    expect(view.trackSetupRows.find((row) => row.label === 'Chord stab')).toMatchObject({
      variant: 'Saw minor',
      type: 'Poly synth',
      source: 'sawtooth chord',
      target: 'poly synth track',
    });
    expect(view.trackSetupRows.find((row) => row.label === 'Chord stab')?.alternatives)
      .toContain('Wide detuned');
    expect(view.soundRows.map((row) => row.label)).toEqual([
      'Kick synth',
      'Bass synth',
      'Hat/noise',
      'Chord stab',
      'Dub echo',
    ]);
    expect(view.audition.chordLabel).toBe('C minor9');
    expect(view.audition.chordNotes).toEqual([
      { midi: 48, label: 'C3' },
      { midi: 51, label: 'D#3' },
      { midi: 55, label: 'G3' },
      { midi: 58, label: 'A#3' },
      { midi: 62, label: 'D4' },
    ]);
    expect(view.audition.bassNotes).toHaveLength(4);
    expect(view.audition.scaleNotes.length).toBeGreaterThan(4);
    expect(view.soundRows.find((row) => row.label === 'Chord stab')?.value)
      .toContain('lowpass 780 Hz Q 1.5');
    expect(view.soundRows.find((row) => row.label === 'Dub echo')?.value)
      .toBe('Deep feedback; 5 repeats; repeat every 3 steps; feedback gain 43%');
  });
});
