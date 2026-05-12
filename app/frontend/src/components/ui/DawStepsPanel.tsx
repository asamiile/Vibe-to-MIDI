import React from 'react';
import { View, Text } from 'react-native';
import type { MusicalSuggestion } from '../../features/vibe-map/types';
import { getMidBpm } from '../../features/vibe-map/engine';
import { midiToNoteName, noteNameToMidi } from '../../lib/notes';
import { getScaleNotes } from '../../lib/scales';
import { AUDIO_PARAMS } from '../../features/audio-engine/player';

interface Props {
  suggestion: MusicalSuggestion;
}

const STEP_LABELS = ['1', 'e', '&', 'a'];
const CHORD_INTERVALS = {
  minor: [0, 3, 7],
  major: [0, 4, 7],
  diminished: [0, 3, 6],
  minor7: [0, 3, 7, 10],
  major7: [0, 4, 7, 11],
  dominant7: [0, 4, 7, 10],
  sus4: [0, 5, 7],
  minor9: [0, 3, 7, 10, 14],
} as const;

function StepText({ children }: { children: React.ReactNode }) {
  return (
    <View className="mb-2">
      <Text className="text-[13px] font-semibold leading-[19px] text-slate-300">
        {children}
      </Text>
    </View>
  );
}

function ValueRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="mb-3">
      <Text className="mb-1 text-[10px] uppercase tracking-[1px] text-slate-500">
        {label}
      </Text>
      <Text className="text-[13px] font-semibold leading-[19px] text-slate-300">
        {value}
      </Text>
    </View>
  );
}

function MiniLabel({ children }: { children: string }) {
  return (
    <Text className="mb-2 text-[10px] uppercase tracking-[1px] text-slate-400">
      {children}
    </Text>
  );
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

export function DawStepsPanel({ suggestion }: Props) {
  const rawBpm = getMidBpm(suggestion);
  const bpm = Math.max(AUDIO_PARAMS.bpmMin, Math.min(AUDIO_PARAMS.bpmMax, rawBpm));
  const scaleNotes = getScaleNotes(suggestion.scale.root, suggestion.scale.mode, 3);
  const chordRoot = noteNameToMidi(suggestion.chord.root, 3);
  const chordNotes = CHORD_INTERVALS[suggestion.chord.quality].map((interval) => chordRoot + interval);
  const bassFilter = suggestion.bassFilter ?? { cutoff: AUDIO_PARAMS.bass.filterFreq, q: AUDIO_PARAMS.bass.filterQ };
  const kickFilter = suggestion.kickFilter ?? { cutoff: AUDIO_PARAMS.kick.filterFreq, q: AUDIO_PARAMS.kick.filterQ };
  const noiseFilter = suggestion.noiseFilter ?? { cutoff: AUDIO_PARAMS.noise.filterFreq, q: AUDIO_PARAMS.noise.filterQ };
  const stabFilter = suggestion.chordStabFilter ?? { cutoff: AUDIO_PARAMS.melody.filterFreq, q: AUDIO_PARAMS.melody.filterQ };
  const dubDelay = suggestion.dubDelay ?? { repeats: 2, stepOffset: 2, feedbackGain: 0.3 };

  return (
    <View className="mb-2">
      <View className="mb-3.5 rounded-md border border-slate-700 bg-gray-900 p-3">
        <StepText>Genre: Dub Techno</StepText>
        <StepText>Tempo: {bpm} BPM{rawBpm !== bpm ? ` (preview clamp, source ${rawBpm})` : ''}</StepText>
        <StepText>Grid: 1 bar, 16 steps, 1/16 notes</StepText>
      </View>

      <View className="mb-3.5 rounded-md border border-slate-800 bg-slate-950 p-3">
        <MiniLabel>MIDI notes</MiniLabel>
        <ValueRow label="Scale" value={`${suggestion.scale.root} ${suggestion.scale.mode.replace('_', ' ')}: ${noteList(scaleNotes)}`} />
        <ValueRow label="Chord stab notes" value={`${suggestion.chord.root} ${suggestion.chord.quality.replace('_', ' ')}: ${noteList(chordNotes)}`} />
        <ValueRow label="Bass bars 1-4" value={noteList(suggestion.bassNotes)} />
        <ValueRow label="Bass timing" value="steps 1, 5, 9, 13; length 3.5 steps each" />
        <ValueRow label="Kick steps" value={hitSteps(suggestion.rhythmPattern)} />
        <ValueRow label="Hat/noise steps" value={hitSteps(suggestion.noisePattern)} />
        <ValueRow label="Chord stab steps" value={hitSteps(suggestion.chordStabPattern)} />
      </View>

      <View className="mb-3.5 rounded-md border border-slate-800 bg-slate-950 p-3">
        <MiniLabel>Sound settings</MiniLabel>
        <ValueRow label="Kick synth" value={`sine pitch ${AUDIO_PARAMS.kick.startFreq} Hz -> ${AUDIO_PARAMS.kick.endFreq} Hz in ${AUDIO_PARAMS.kick.pitchDecayMs} ms; decay ${AUDIO_PARAMS.kick.decayMs} ms; lowpass ${kickFilter.cutoff} Hz Q ${kickFilter.q}`} />
        <ValueRow label="Bass synth" value={`sawtooth sub + triangle octave blend ${(AUDIO_PARAMS.bass.octaveBlend * 100).toFixed(0)}%; lowpass ${bassFilter.cutoff} Hz Q ${bassFilter.q}; note length 3.5 steps`} />
        <ValueRow label="Hat/noise" value={`square-noise bandpass ${noiseFilter.cutoff} Hz Q ${noiseFilter.q}; decay ${AUDIO_PARAMS.noise.decayMs} ms; gain ${(AUDIO_PARAMS.noise.gainRatio * 100).toFixed(0)}%`} />
        <ValueRow label="Chord stab" value={`sawtooth chord; attack ${AUDIO_PARAMS.melody.attackMs} ms; decay ${AUDIO_PARAMS.melody.decayMs} ms; sustain ${(AUDIO_PARAMS.melody.sustainRatio * 100).toFixed(0)}%; lowpass ${stabFilter.cutoff} Hz Q ${stabFilter.q}`} />
        <ValueRow label="Dub echo" value={`${dubDelay.repeats} repeats; repeat every ${dubDelay.stepOffset} steps; feedback gain ${(dubDelay.feedbackGain * 100).toFixed(0)}%`} />
        {suggestion.soundLayers.map((layer) => (
          <ValueRow
            key={layer.role}
            label={layer.role}
            value={layer.descriptor}
          />
        ))}
      </View>

      <View className="rounded-md border border-slate-800 bg-slate-900 p-3">
        <MiniLabel>Kick clip</MiniLabel>
        <View className="flex-row gap-1">
          {suggestion.rhythmPattern.map((hit, index) => (
            <View key={`daw-step-${index}`} className="flex-1 gap-1">
              <View
                className="h-8 items-center justify-center rounded border"
                style={{
                  borderColor: hit ? '#22d3ee' : '#1e293b',
                  backgroundColor: hit ? '#0e7490' : '#111827',
                }}
              >
                <Text className="text-[10px] font-bold" style={{ color: hit ? '#ecfeff' : '#475569' }}>
                  {hit ? 'hit' : ''}
                </Text>
              </View>
              <Text className="text-center text-[9px]" style={{ color: index % 4 === 0 ? '#cbd5e1' : '#475569' }}>
                {STEP_LABELS[index % 4]}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
