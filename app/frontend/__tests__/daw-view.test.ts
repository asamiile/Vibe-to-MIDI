import { buildDawStepsView } from '../src/features/vibe-map/daw-view';
import { getMusicalSuggestion } from '../src/features/vibe-map/engine';

describe('buildDawStepsView', () => {
  it('exposes DAW-entry rows for notes, steps, filters, and echo', () => {
    const view = buildDawStepsView(getMusicalSuggestion('deep'));

    expect(view.bpm).toBeLessThanOrEqual(120);
    expect(view.rawBpm).toBeGreaterThanOrEqual(view.bpm);
    expect(view.kickPattern).toHaveLength(16);

    expect(view.midiRows.map((row) => row.label)).toEqual([
      'Scale',
      'Chord stab notes',
      'Bass bars 1-4',
      'Bass timing',
      'Kick steps',
      'Hat/noise steps',
      'Chord stab steps',
    ]);

    expect(view.midiRows.find((row) => row.label === 'Chord stab notes')?.value)
      .toContain('C minor9: C3 (48)  D#3 (51)  G3 (55)  A#3 (58)  D4 (62)');
    expect(view.soundRows.find((row) => row.label === 'Chord stab')?.value)
      .toContain('lowpass 780 Hz Q 1.5');
    expect(view.soundRows.find((row) => row.label === 'Dub echo')?.value)
      .toBe('5 repeats; repeat every 3 steps; feedback gain 43%');
  });
});
