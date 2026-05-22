import { getChordNotes } from '../../lib/chords';
import { midiToNoteName } from '../../lib/notes';
import { getScaleNotes } from '../../lib/scales';
import { AUDIO_PARAMS } from '../audio-engine/constants';
import {
  DEFAULT_SOUND_VARIANTS,
  getSoundVariant,
  soundVariantOptions,
} from './sound-palette';
import {
  DEFAULT_SOUND_MIX,
  getBassPlaybackVoices,
  getEffectiveDubDelay,
  getKickPlaybackProfile,
  getNoisePlaybackProfile,
  getStabPlaybackProfile,
} from './sound-playback';
import { getMidBpm } from './engine';
import type { MusicalSuggestion } from './types';

export interface DawValueRow {
  label: string;
  value: string;
}

export interface DawNoteView {
  midi: number;
  label: string;
}

export interface DawTrackSetupRow {
  label: string;
  variant: string;
  type: string;
  source: string;
  target: string;
  fx: string;
  alternatives: string;
}

export interface DawStepsView {
  bpm: number;
  rawBpm: number;
  setupRows: DawValueRow[];
  sequenceRows: DawValueRow[];
  trackSetupRows: DawTrackSetupRow[];
  soundRows: DawValueRow[];
  kickPattern: readonly boolean[];
  patternSteps: { bass: string; chord: string; noise: string };
  audition: {
    chordLabel: string;
    chordNotes: readonly DawNoteView[];
    scaleNotes: readonly DawNoteView[];
    bassNotes: readonly DawNoteView[];
  };
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

function noteViews(midiNotes: readonly number[]): DawNoteView[] {
  return midiNotes.map((midi) => ({
    midi,
    label: midiToNoteName(midi),
  }));
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
  const soundVariants = suggestion.soundVariants ?? DEFAULT_SOUND_VARIANTS;
  const soundMix = suggestion.soundMix ?? DEFAULT_SOUND_MIX;
  const kickVariant = getSoundVariant('kick', soundVariants.kick);
  const bassVariant = getSoundVariant('bass', soundVariants.bass);
  const noiseVariant = getSoundVariant('noise', soundVariants.noise);
  const stabVariant = getSoundVariant('stab', soundVariants.stab);
  const spaceVariant = getSoundVariant('space', soundVariants.space);
  const kickPlayback = getKickPlaybackProfile(soundVariants.kick);
  const bassPlaybackVoices = getBassPlaybackVoices(soundVariants.bass);
  const noisePlayback = getNoisePlaybackProfile(soundVariants.noise);
  const stabPlayback = getStabPlaybackProfile(soundVariants.stab);
  const playbackDubDelay = getEffectiveDubDelay(dubDelay, soundVariants.space);
  const kickPlaybackCutoff = Math.round(kickFilter.cutoff * kickPlayback.cutoffRatio);
  const noisePlaybackCutoff = Math.min(Math.round(noiseFilter.cutoff * noisePlayback.cutoffRatio), 8200);
  const noisePlaybackQ = Math.max(0.7, noiseFilter.q * noisePlayback.qRatio);
  const bassVoiceSettings = bassPlaybackVoices
    .map((voice) => {
      const octave = voice.octaveOffset === 0 ? 'root' : `+${voice.octaveOffset} semitones`;
      const movement = voice.sweep
        ? ` sweep ${(voice.sweep.startRatio * 100).toFixed(0)}% -> ${(voice.sweep.endRatio * 100).toFixed(0)}%`
        : '';
      const drive = voice.shapeAmount ? ` drive ${(voice.shapeAmount * 100).toFixed(0)}%` : '';
      return `${voice.type} ${octave} gain ${(voice.gainRatio * 100).toFixed(0)}% cutoff ${Math.round(bassFilter.cutoff * voice.cutoffRatio)} Hz${movement}${drive}`;
    })
    .join('; ');
  const noisePartials = noisePlayback.freqs
    .map((freq, index) => `${noisePlayback.type(index)} ${freq} Hz`)
    .join(', ');

  return {
    bpm,
    rawBpm,
    kickPattern: suggestion.rhythmPattern,
    patternSteps: {
      bass: '1, 5, 9, 13',
      chord: hitSteps(suggestion.chordStabPattern),
      noise: hitSteps(suggestion.noisePattern),
    },
    setupRows: [
      {
        label: 'Tempo',
        value: `${bpm} BPM${rawBpm !== bpm ? ` (preview clamp, source ${rawBpm})` : ''}`,
      },
      { label: 'Grid', value: '1 bar, 16 steps, 1/16 notes' },
    ],
    audition: {
      chordLabel: `${suggestion.chord.root} ${suggestion.chord.quality.replace('_', ' ')}`,
      chordNotes: noteViews(chordNotes),
      scaleNotes: noteViews(scaleNotes),
      bassNotes: noteViews(suggestion.bassNotes),
    },
    sequenceRows: [
      {
        label: 'Bass notes',
        value: noteList(suggestion.bassNotes),
      },
      {
        label: 'Bass placement',
        value: 'steps 1, 5, 9, 13; length 3.5 steps each',
      },
      {
        label: 'Chord notes',
        value: `${suggestion.chord.root} ${suggestion.chord.quality.replace('_', ' ')}: ${noteList(chordNotes)}`,
      },
      { label: 'Chord placement', value: `steps ${hitSteps(suggestion.chordStabPattern)}; length 1 step each` },
      { label: 'Kick steps', value: hitSteps(suggestion.rhythmPattern) },
      { label: 'Noise steps', value: hitSteps(suggestion.noisePattern) },
      {
        label: 'Scale reference',
        value: `${suggestion.scale.root} ${suggestion.scale.mode.replace('_', ' ')}: ${noteList(scaleNotes)}`,
      },
    ],
    trackSetupRows: [
      {
        label: 'Kick',
        variant: kickVariant.name,
        type: kickVariant.type,
        source: kickVariant.source,
        target: kickVariant.target,
        fx: `${kickVariant.fxRole}; track gain ${(soundMix.kick * 100).toFixed(0)}%; lowpass ${kickPlaybackCutoff} Hz Q ${kickFilter.q}`,
        alternatives: soundVariantOptions('kick', soundVariants.kick),
      },
      {
        label: 'Bass',
        variant: bassVariant.name,
        type: bassVariant.type,
        source: `${bassVariant.source}${soundVariants.bass === 'saw-sub' ? `; triangle octave ${(AUDIO_PARAMS.bass.octaveBlend * 100).toFixed(0)}%` : ''}`,
        target: bassVariant.target,
        fx: `${bassVariant.fxRole}; track gain ${(soundMix.bass * 100).toFixed(0)}%; lowpass ${bassFilter.cutoff} Hz Q ${bassFilter.q}`,
        alternatives: soundVariantOptions('bass', soundVariants.bass),
      },
      {
        label: 'Noise',
        variant: noiseVariant.name,
        type: noiseVariant.type,
        source: noiseVariant.source,
        target: noiseVariant.target,
        fx: `${noiseVariant.fxRole}; track gain ${(soundMix.noise * 100).toFixed(0)}%; bandpass ${noisePlaybackCutoff} Hz Q ${noisePlaybackQ.toFixed(2)} -> lowpass ${Math.min(noisePlaybackCutoff * 1.35, 9000)} Hz`,
        alternatives: soundVariantOptions('noise', soundVariants.noise),
      },
      {
        label: 'Chord stab',
        variant: stabVariant.name,
        type: stabVariant.type,
        source: stabVariant.source,
        target: stabVariant.target,
        fx: `${stabVariant.fxRole}; track gain ${(soundMix.stab * 100).toFixed(0)}%; lowpass ${stabFilter.cutoff} Hz Q ${stabFilter.q}; echo send ${(stabPlayback.delaySendRatio * 100).toFixed(0)}%, repeat filter ${(stabPlayback.repeatFilterRatio * 100).toFixed(0)}% -> ${spaceVariant.name} (${spaceVariant.fxRole})`,
        alternatives: soundVariantOptions('stab', soundVariants.stab),
      },
      {
        label: 'Space',
        variant: spaceVariant.name,
        type: spaceVariant.type,
        source: spaceVariant.source,
        target: spaceVariant.target,
        fx: `${playbackDubDelay.repeats} repeats; repeat every ${playbackDubDelay.stepOffset} steps; feedback gain ${(playbackDubDelay.feedbackGain * 100).toFixed(0)}%; repeat darkening ${(stabPlayback.repeatFilterRatio * 100).toFixed(0)}% per echo`,
        alternatives: soundVariantOptions('space', soundVariants.space),
      },
    ],
    soundRows: [
      {
        label: 'Kick synth',
        value: `${kickVariant.name}; sine pitch ${kickPlayback.startFreq} Hz -> ${kickPlayback.endFreq} Hz in ${(kickPlayback.pitchDecay * 1000).toFixed(0)} ms; decay ${(kickPlayback.decay * 1000).toFixed(0)} ms; voice gain ${(kickPlayback.gainRatio * 100).toFixed(0)}%; track gain ${(soundMix.kick * 100).toFixed(0)}%; lowpass ${kickPlaybackCutoff} Hz Q ${kickFilter.q}`,
      },
      {
        label: 'Bass synth',
        value: `${bassVariant.name}; ${bassVoiceSettings}; track gain ${(soundMix.bass * 100).toFixed(0)}%; Q ${bassFilter.q}; note length 3.5 steps`,
      },
      {
        label: 'Hat/noise',
        value: `${noiseVariant.name}; ${noisePartials}; bandpass ${noisePlaybackCutoff} Hz Q ${noisePlaybackQ.toFixed(2)}; lowpass ${Math.min(noisePlaybackCutoff * 1.35, 9000)} Hz; decay ${(AUDIO_PARAMS.noise.decayMs * noisePlayback.durationRatio).toFixed(0)} ms; voice gain ${(AUDIO_PARAMS.noise.gainRatio * noisePlayback.gainRatio * 100).toFixed(0)}%; track gain ${(soundMix.noise * 100).toFixed(0)}%`,
      },
      {
        label: 'Chord stab',
        value: `${stabVariant.name}; ${stabVariant.source}; attack ${AUDIO_PARAMS.melody.attackMs} ms; duration ${(stabPlayback.durationRatio * 100).toFixed(0)}%; echo send ${(stabPlayback.delaySendRatio * 100).toFixed(0)}%; repeat filter ${(stabPlayback.repeatFilterRatio * 100).toFixed(0)}%; track gain ${(soundMix.stab * 100).toFixed(0)}%; lowpass ${stabFilter.cutoff} Hz Q ${stabFilter.q}`,
      },
      {
        label: 'Dub echo',
        value: `${spaceVariant.name}; ${playbackDubDelay.repeats} repeats; repeat every ${playbackDubDelay.stepOffset} steps; feedback gain ${(playbackDubDelay.feedbackGain * 100).toFixed(0)}%; repeat duration ${(stabPlayback.repeatDurationRatio * 100).toFixed(0)}%; repeat darkening ${(stabPlayback.repeatFilterRatio * 100).toFixed(0)}%`,
      },
    ],
  };
}
