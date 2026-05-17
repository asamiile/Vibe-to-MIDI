import type { MusicalSuggestion, ScaleMode } from './types';
import { midiToNoteName } from '../../lib/notes';
import { getScaleNotes } from '../../lib/scales';

export type BassMotion = 'static' | 'rising' | 'falling' | 'mixed';
export type RhythmFeel = 'sparse' | 'steady' | 'busy';
export type LearningFocus = 'pulse' | 'bass';

export interface LearningCue {
  pulseMap: readonly string[];
  rhythmFeel: RhythmFeel;
  rhythmReason: string;
  bassMotion: BassMotion;
  bassReason: string;
  scaleNotes: readonly string[];
  scaleReason: string;
  chordReason: string;
  firstMove: string;
  tryChange: string;
  resultWord: string;
  whatChanged: string;
}

export interface LearningFocusView {
  focus: LearningFocus;
  title: string;
  goal: string;
  originalLabel: string;
  tryLabel: string;
  resultWord: string;
  reason: string;
  original: {
    rhythmPattern: readonly boolean[];
    bassNotes: readonly number[];
  };
  changed: {
    rhythmPattern: readonly boolean[];
    bassNotes: readonly number[];
  };
  pulseMap: readonly string[];
  bassNoteLabels: readonly string[];
}

const SCALE_REASONS: Record<ScaleMode, string> = {
  major: 'bright and stable',
  minor: 'direct, grounded, and moody',
  dorian: 'minor color with a lifted sixth',
  phrygian: 'dark color from the flat second',
  lydian: 'floating color from the raised fourth',
  mixolydian: 'open, rolling, less resolved',
  locrian: 'unstable because the fifth feels weakened',
  harmonic_minor: 'minor with a sharp pull back to the root',
  whole_tone: 'weightless because every step is even',
};

export function getRhythmFeel(pattern: readonly boolean[]): RhythmFeel {
  const hits = pattern.filter(Boolean).length;
  if (hits <= 3) return 'sparse';
  if (hits <= 6) return 'steady';
  return 'busy';
}

export function getBassMotion(notes: readonly number[]): BassMotion {
  let up = 0;
  let down = 0;

  for (let i = 1; i < notes.length; i += 1) {
    if (notes[i] > notes[i - 1]) up += 1;
    if (notes[i] < notes[i - 1]) down += 1;
  }

  if (up === 0 && down === 0) return 'static';
  if (up > 0 && down === 0) return 'rising';
  if (down > 0 && up === 0) return 'falling';
  return 'mixed';
}

export function getLearningCue(suggestion: MusicalSuggestion): LearningCue {
  const rhythmFeel = getRhythmFeel(suggestion.rhythmPattern);
  const bassMotion = getBassMotion(suggestion.bassNotes);
  const scaleNotes = getScaleNotes(suggestion.scale.root, suggestion.scale.mode, 3).map(midiToNoteName);
  const rootName = midiToNoteName(suggestion.bassNotes[0]).replace(/\d+$/, '');

  return {
    pulseMap: suggestion.rhythmPattern.map((hit, index) => {
      if (!hit) return 'rest';
      return index % 4 === 0 ? 'downbeat' : 'offbeat';
    }),
    rhythmFeel,
    rhythmReason: getRhythmReason(rhythmFeel),
    bassMotion,
    bassReason: getBassReason(bassMotion, rootName),
    scaleNotes,
    scaleReason: SCALE_REASONS[suggestion.scale.mode],
    chordReason: `${suggestion.chord.root} ${suggestion.chord.quality.replace('_', ' ')} gives the loop its harmonic center.`,
    firstMove: getFirstMove(rhythmFeel, bassMotion),
    tryChange: getTryChange(rhythmFeel, bassMotion, suggestion.bassNotes),
    resultWord: getResultWord(rhythmFeel, bassMotion),
    whatChanged: getWhatChanged(rhythmFeel, bassMotion),
  };
}

export function buildLearningFocusView(
  suggestion: MusicalSuggestion,
  focus: LearningFocus
): LearningFocusView {
  const cue = getLearningCue(suggestion);
  const changedRhythm = focus === 'pulse'
    ? mutateRhythmPattern(suggestion.rhythmPattern, cue.rhythmFeel)
    : suggestion.rhythmPattern;
  const changedBass = focus === 'bass'
    ? mutateBassNotes(suggestion.bassNotes, cue.bassMotion)
    : suggestion.bassNotes;

  return {
    focus,
    title: focus === 'pulse' ? 'Pulse' : 'Bass',
    goal: focus === 'pulse'
      ? 'Hear how space changes the groove.'
      : 'Hear how one bass note changes the loop.',
    originalLabel: focus === 'pulse'
      ? `${cue.rhythmFeel} original`
      : `${cue.bassMotion} original`,
    tryLabel: focus === 'pulse'
      ? getPulseTryLabel(cue.rhythmFeel)
      : getBassTryLabel(suggestion.bassNotes, cue.bassMotion),
    resultWord: focus === 'bass' && cue.bassMotion === 'static'
      ? 'more moving'
      : cue.resultWord,
    reason: focus === 'pulse'
      ? cue.whatChanged
      : getBassFocusReason(cue, suggestion.bassNotes),
    original: {
      rhythmPattern: suggestion.rhythmPattern,
      bassNotes: suggestion.bassNotes,
    },
    changed: {
      rhythmPattern: changedRhythm,
      bassNotes: changedBass,
    },
    pulseMap: (focus === 'pulse' ? changedRhythm : suggestion.rhythmPattern).map((hit, index) => {
      if (!hit) return 'rest';
      return index % 4 === 0 ? 'downbeat' : 'offbeat';
    }),
    bassNoteLabels: (focus === 'bass' ? changedBass : suggestion.bassNotes).map(midiToNoteName),
  };
}

function getRhythmReason(feel: RhythmFeel): string {
  if (feel === 'sparse') return 'few hits leave space, so the loop feels deeper and slower.';
  if (feel === 'steady') return 'repeated hits make the body feel a clear grid.';
  return 'many hits create urgency and forward motion.';
}

function getBassReason(motion: BassMotion, rootName: string): string {
  if (motion === 'static') return `repeating ${rootName} makes the vibe feel locked and hypnotic.`;
  if (motion === 'rising') return 'the line climbs, so the loop feels like it is opening.';
  if (motion === 'falling') return 'the line drops, so the loop feels heavier.';
  return 'small direction changes keep the loop alive without turning it into a melody.';
}

function getFirstMove(rhythmFeel: RhythmFeel, bassMotion: BassMotion): string {
  if (rhythmFeel === 'sparse') return 'Start with the downbeats, then add one offbeat only if the loop feels empty.';
  if (bassMotion === 'static') return 'Keep the bass on one note first, then change the last note to create motion.';
  if (bassMotion === 'rising') return 'Place the lowest bass note first and let the later notes lift the phrase.';
  return 'Copy the rhythm first, then move only one bass note and listen to the mood change.';
}

function getTryChange(
  rhythmFeel: RhythmFeel,
  bassMotion: BassMotion,
  bassNotes: readonly number[]
): string {
  const firstNote = midiToNoteName(bassNotes[0]);
  const lastNote = midiToNoteName(bassNotes[bassNotes.length - 1]);

  if (bassMotion !== 'static') return `Change the last bass note ${lastNote} back to ${firstNote}.`;
  if (rhythmFeel === 'sparse') return 'Add one extra hit on step 13, then compare the space.';
  return 'Mute one hit in the second half, then listen for more space.';
}

function getResultWord(rhythmFeel: RhythmFeel, bassMotion: BassMotion): string {
  if (bassMotion === 'rising') return 'more locked';
  if (bassMotion === 'falling') return 'less heavy';
  if (bassMotion === 'mixed') return 'more stable';
  if (rhythmFeel === 'sparse') return 'more driving';
  if (rhythmFeel === 'busy') return 'more spacious';
  return 'more minimal';
}

function getWhatChanged(rhythmFeel: RhythmFeel, bassMotion: BassMotion): string {
  if (bassMotion === 'rising') return 'The bass stops climbing, so the loop feels more hypnotic and less like a phrase.';
  if (bassMotion === 'falling') return 'The bass loses its downward pull, so the loop feels lighter.';
  if (bassMotion === 'mixed') return 'The bass has less direction, so your attention moves back to the pulse.';
  if (rhythmFeel === 'sparse') return 'One extra hit reduces the empty space and makes the loop move faster.';
  if (rhythmFeel === 'busy') return 'Removing a hit gives the groove more air and makes the bass easier to hear.';
  return 'A smaller rhythm change makes the loop feel simpler without changing the notes.';
}

function mutateRhythmPattern(pattern: readonly boolean[], feel: RhythmFeel): boolean[] {
  const next = [...pattern];
  if (feel === 'sparse') {
    next[12] = true;
    return next;
  }

  const secondHalfHit = next.findIndex((hit, index) => index >= 8 && hit);
  if (secondHalfHit >= 0) {
    next[secondHalfHit] = false;
    return next;
  }

  let lastHit = -1;
  for (let index = next.length - 1; index >= 0; index -= 1) {
    if (next[index]) {
      lastHit = index;
      break;
    }
  }
  if (lastHit >= 0) next[lastHit] = false;
  return next;
}

function mutateBassNotes(notes: readonly number[], motion: BassMotion): number[] {
  const next = [...notes];
  if (next.length === 0) return next;

  if (motion === 'static') {
    next[next.length - 1] = next[0] + 7;
    return next;
  }

  let movingIndex = -1;
  for (let index = next.length - 1; index >= 0; index -= 1) {
    if (next[index] !== next[0]) {
      movingIndex = index;
      break;
    }
  }
  next[movingIndex >= 0 ? movingIndex : next.length - 1] = next[0];
  return next;
}

function getPulseTryLabel(feel: RhythmFeel): string {
  if (feel === 'sparse') return 'Add step 13';
  return 'Mute one late hit';
}

function getBassTryLabel(notes: readonly number[], motion: BassMotion): string {
  const firstNote = midiToNoteName(notes[0]);
  if (motion === 'static') return `Move last note to ${midiToNoteName(notes[0] + 7)}`;
  return `Return last note to ${firstNote}`;
}

function getBassFocusReason(cue: LearningCue, notes: readonly number[]): string {
  if (cue.bassMotion !== 'static') return cue.whatChanged;
  return `The last note leaves ${midiToNoteName(notes[0])}, so the bass feels less locked.`;
}
