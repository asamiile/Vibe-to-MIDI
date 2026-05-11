import React from 'react';
import { View, Text } from 'react-native';
import type { MusicalSuggestion } from '../../features/vibe-map/types';
import { getMidBpm } from '../../features/vibe-map/engine';
import { midiToNoteName } from '../../lib/notes';

interface Props {
  suggestion: MusicalSuggestion;
}

const STEP_LABELS = ['1', 'e', '&', 'a'];

function StepText({ children }: { children: React.ReactNode }) {
  return (
    <View className="mb-2">
      <Text className="text-[13px] font-semibold leading-[19px] text-slate-300">
        {children}
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

export function DawStepsPanel({ suggestion }: Props) {
  const bpm = getMidBpm(suggestion);
  const bassNotes = suggestion.bassNotes.map(midiToNoteName);
  const hitSteps = suggestion.rhythmPattern
    .map((hit, index) => (hit ? index + 1 : null))
    .filter((step): step is number => step !== null);

  return (
    <View className="mb-2 mt-0.5 border-t border-slate-800 pt-4">
      <Text className="mb-1 text-lg font-extrabold text-slate-200">
        Use in MIDI / DAW
      </Text>
      <Text className="mb-3.5 text-[13px] leading-[18px] text-slate-400">
        When you find a sound you like, copy these values into a 1-bar MIDI clip.
      </Text>

      <View className="mb-3.5 rounded-md border border-slate-700 bg-gray-900 p-3">
        <StepText>Tempo: {bpm} BPM</StepText>
        <StepText>Bass notes: {bassNotes.join('  ')}</StepText>
        <StepText>Hit steps: {hitSteps.join(', ')}</StepText>
        <StepText>Sound: {suggestion.soundHint}</StepText>
      </View>

      <View className="rounded-md border border-slate-800 bg-slate-900 p-3">
        <MiniLabel>16-step clip</MiniLabel>
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
