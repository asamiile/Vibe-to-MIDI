import { getChordNotes } from '../../lib/chords';
import { midiToNoteName } from '../../lib/notes';
import { getScaleNotes } from '../../lib/scales';
import { AUDIO_PARAMS } from '../audio-engine/constants';
import { getMidBpm } from './engine';
import type { MusicalSuggestion } from './types';

export interface DawValueRow {
  label: string;
  value: string;
}

export interface DawStepsView {
  bpm: number;
  rawBpm: number;
  midiRows: DawValueRow[];
  soundRows: DawValueRow[];
  kickPattern: readonly boolean[];
}

function hitSteps(pattern?: readonly boolean[]): string {
  if (!pattern) return 'none';
  const steps = pattern
    .map((hit, index) => (hit ? index + 1 : null))
    .filter((step): step is number => step !== null);
  return steps.length > 0 ? steps.join(', ') : 'none';
}

function noteList(midiNotes: readonly number[]): string {
  return midiNotes.map((midi) => `${midiToNoteName(midi)} (${midi})`).join('  ');
}

export function buildDawStepsView(suggestion: MusicalSuggestion): DawStepsView {
  const rawBpm = getMidBpm(suggestion);
  const bpm = Math.max(AUDIO_PARAMS.bpmMin, Math.min(AUDIO_PARAMS.bpmMax, rawBpm));
  const scaleNotes = getScaleNotes(suggestion.scale.root, suggestion.scale.mode, 3);
  const chordNotes = getChordNotes(suggestion.chord.root, suggestion.chord.quality, 3);
  const bassFilter = suggestion.bassFilter ?? { cutoff: AUDIO_PARAMS.bass.filterFreq, q: AUDIO_PARAMS.bass.filterQ };
  const kickFilter = suggestion.kickFilter ?? { cutoff: AUDIO_PARAMS.kick.filterFreq, q: AUDIO_PARAMS.kick.filterQ };
  const noiseFilter = suggestion.noiseFilter ?? { cutoff: AUDIO_PARAMS.noise.filterFreq, q: AUDIO_PARAMS.noise.filterQ };
  const stabFilter = suggestion.chordStabFilter ?? { cutoff: AUDIO_PARAMS.melody.filterFreq, q: AUDIO_PARAMS.melody.filterQ };
  const dubDelay = suggestion.dubDelay ?? { repeats: 2, stepOffset: 2, feedbackGain: 0.3 };

  return {
    bpm,
    rawBpm,
    kickPattern: suggestion.rhythmPattern,
    midiRows: [
      {
        label: 'Scale',
        value: `${suggestion.scale.root} ${suggestion.scale.mode.replace('_', ' ')}: ${noteList(scaleNotes)}`,
      },
      {
        label: 'Chord stab notes',
        value: `${suggestion.chord.root} ${suggestion.chord.quality.replace('_', ' ')}: ${noteList(chordNotes)}`,
      },
      { label: 'Bass bars 1-4', value: noteList(suggestion.bassNotes) },
      { label: 'Bass timing', value: 'steps 1, 5, 9, 13; length 3.5 steps each' },
      { label: 'Kick steps', value: hitSteps(suggestion.rhythmPattern) },
      { label: 'Hat/noise steps', value: hitSteps(suggestion.noisePattern) },
      { label: 'Chord stab steps', value: hitSteps(suggestion.chordStabPattern) },
    ],
    soundRows: [
      {
        label: 'Kick synth',
        value: `sine pitch ${AUDIO_PARAMS.kick.startFreq} Hz -> ${AUDIO_PARAMS.kick.endFreq} Hz in ${AUDIO_PARAMS.kick.pitchDecayMs} ms; decay ${AUDIO_PARAMS.kick.decayMs} ms; lowpass ${kickFilter.cutoff} Hz Q ${kickFilter.q}`,
      },
      {
        label: 'Bass synth',
        value: `sawtooth sub + triangle octave blend ${(AUDIO_PARAMS.bass.octaveBlend * 100).toFixed(0)}%; lowpass ${bassFilter.cutoff} Hz Q ${bassFilter.q}; note length 3.5 steps`,
      },
      {
        label: 'Hat/noise',
        value: `square-noise bandpass ${noiseFilter.cutoff} Hz Q ${noiseFilter.q}; decay ${AUDIO_PARAMS.noise.decayMs} ms; gain ${(AUDIO_PARAMS.noise.gainRatio * 100).toFixed(0)}%`,
      },
      {
        label: 'Chord stab',
        value: `sawtooth chord; attack ${AUDIO_PARAMS.melody.attackMs} ms; decay ${AUDIO_PARAMS.melody.decayMs} ms; sustain ${(AUDIO_PARAMS.melody.sustainRatio * 100).toFixed(0)}%; lowpass ${stabFilter.cutoff} Hz Q ${stabFilter.q}`,
      },
      {
        label: 'Dub echo',
        value: `${dubDelay.repeats} repeats; repeat every ${dubDelay.stepOffset} steps; feedback gain ${(dubDelay.feedbackGain * 100).toFixed(0)}%`,
      },
      ...suggestion.soundLayers.map((layer) => ({
        label: layer.role,
        value: layer.descriptor,
      })),
    ],
  };
}
