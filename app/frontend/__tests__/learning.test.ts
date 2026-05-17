import {
  buildLearningFocusView,
  getBassMotion,
  getLearningCue,
  getRhythmFeel,
} from '../src/features/vibe-map/learning';
import { getMusicalSuggestion } from '../src/features/vibe-map/engine';

describe('getRhythmFeel', () => {
  it('classifies sparse patterns', () => {
    expect(getRhythmFeel([true, false, false, false, true, false, false, false])).toBe('sparse');
  });

  it('classifies steady patterns', () => {
    expect(getRhythmFeel([true, false, true, false, true, false, true, false])).toBe('steady');
  });

  it('classifies busy patterns', () => {
    expect(getRhythmFeel([true, true, true, false, true, true, true, true])).toBe('busy');
  });
});

describe('getBassMotion', () => {
  it('detects static bass motion', () => {
    expect(getBassMotion([36, 36, 36, 36])).toBe('static');
  });

  it('detects rising bass motion', () => {
    expect(getBassMotion([36, 38, 40, 43])).toBe('rising');
  });

  it('detects falling bass motion', () => {
    expect(getBassMotion([43, 40, 38, 36])).toBe('falling');
  });

  it('detects mixed bass motion', () => {
    expect(getBassMotion([36, 40, 38, 43])).toBe('mixed');
  });
});

describe('getLearningCue', () => {
  it('builds pulse, scale, and first-move guidance for a suggestion', () => {
    const cue = getLearningCue(getMusicalSuggestion('dark'));

    expect(cue.pulseMap).toHaveLength(16);
    expect(cue.pulseMap[0]).toBe('downbeat');
    expect(cue.scaleNotes[0]).toBe('A3');
    expect(cue.scaleReason).toContain('flat second');
    expect(cue.firstMove.length).toBeGreaterThan(0);
    expect(cue.tryChange.length).toBeGreaterThan(0);
    expect(cue.resultWord.length).toBeGreaterThan(0);
    expect(cue.whatChanged.length).toBeGreaterThan(0);
  });
});

describe('buildLearningFocusView', () => {
  it('builds a pulse compare view with a changed rhythm', () => {
    const suggestion = getMusicalSuggestion('dark');
    const view = buildLearningFocusView(suggestion, 'pulse');

    expect(view.title).toBe('Pulse');
    expect(view.original.rhythmPattern).toEqual(suggestion.rhythmPattern);
    expect(view.changed.bassNotes).toEqual(suggestion.bassNotes);
    expect(view.changed.rhythmPattern).not.toEqual(suggestion.rhythmPattern);
    expect(view.tryLabel.length).toBeGreaterThan(0);
    expect(view.resultWord.length).toBeGreaterThan(0);
  });

  it('builds a bass compare view with changed bass notes only', () => {
    const suggestion = getMusicalSuggestion('dark');
    const view = buildLearningFocusView(suggestion, 'bass');

    expect(view.title).toBe('Bass');
    expect(view.original.bassNotes).toEqual(suggestion.bassNotes);
    expect(view.changed.rhythmPattern).toEqual(suggestion.rhythmPattern);
    expect(view.changed.bassNotes).not.toEqual(suggestion.bassNotes);
    expect(view.bassNoteLabels).toHaveLength(suggestion.bassNotes.length);
  });
});
