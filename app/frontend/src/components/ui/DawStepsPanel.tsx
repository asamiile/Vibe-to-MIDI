import React from 'react';
import { View, Text } from 'react-native';
import type { MusicalSuggestion } from '../../features/vibe-map/types';
import { buildDawStepsView } from '../../features/vibe-map/daw-view';

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

export function DawStepsPanel({ suggestion }: Props) {
  const view = buildDawStepsView(suggestion);

  return (
    <View className="mb-2">
      <View className="mb-3.5 rounded-md border border-slate-700 bg-gray-900 p-3">
        <StepText>Genre: Dub Techno</StepText>
        <StepText>Tempo: {view.bpm} BPM{view.rawBpm !== view.bpm ? ` (preview clamp, source ${view.rawBpm})` : ''}</StepText>
        <StepText>Grid: 1 bar, 16 steps, 1/16 notes</StepText>
      </View>

      <View className="mb-3.5 rounded-md border border-slate-800 bg-slate-950 p-3">
        <MiniLabel>MIDI notes</MiniLabel>
        {view.midiRows.map((row) => (
          <ValueRow key={row.label} label={row.label} value={row.value} />
        ))}
      </View>

      <View className="mb-3.5 rounded-md border border-slate-800 bg-slate-950 p-3">
        <MiniLabel>Sound settings</MiniLabel>
        {view.soundRows.map((row) => (
          <ValueRow key={row.label} label={row.label} value={row.value} />
        ))}
      </View>

      <View className="rounded-md border border-slate-800 bg-slate-900 p-3">
        <MiniLabel>Kick clip</MiniLabel>
        <View className="flex-row gap-1">
          {view.kickPattern.map((hit, index) => (
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
