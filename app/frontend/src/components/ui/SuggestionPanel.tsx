import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import type { MusicalSuggestion } from '../../features/vibe-map/types';
import { midiToNoteName } from '../../lib/notes';
import { getMidBpm } from '../../features/vibe-map/engine';
import { IntuitiveLearningPanel } from './IntuitiveLearningPanel';
import { DawStepsPanel } from './DawStepsPanel';

interface Props {
  suggestion: MusicalSuggestion;
  mode: SuggestionTab;
  onBack: () => void;
}

type SuggestionTab = 'explore' | 'use';

interface SuggestionOnlyProps {
  suggestion: MusicalSuggestion;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View className="mb-3">
      <Text className="mb-0.5 text-[10px] uppercase tracking-[1px] text-slate-600">
        {label}
      </Text>
      <Text className="text-sm font-medium text-slate-200">
        {value}
      </Text>
    </View>
  );
}

function TabButton({
  active,
  label,
  onPress,
}: {
  active: boolean;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      className="min-h-10 flex-1 items-center justify-center rounded-md border"
      android_disableSound
      onPress={onPress}
      style={({ pressed }) => ({
        backgroundColor: active ? '#0e7490' : '#111827',
        borderColor: active ? '#22d3ee' : '#1e293b',
        opacity: pressed ? 0.75 : 1,
      })}
    >
      <Text className="text-xs font-extrabold" style={{ color: active ? '#ecfeff' : '#94a3b8' }}>
        {label}
      </Text>
    </Pressable>
  );
}

function WhyItWorksPanel({ suggestion }: SuggestionOnlyProps) {
  const { scale, chord, bassNotes, rhythmPattern, soundHint, bpmRange } = suggestion;

  const scaleLabel = `${scale.root} ${scale.mode.replace('_', ' ')}`;
  const chordLabel = `${chord.root} ${chord.quality.replace('_', ' ')}`;
  const bassLabel = bassNotes.map(midiToNoteName).join('  ');
  const rhythmLabel = rhythmPattern.map((hit) => (hit ? 'hit' : '-')).join(' ');
  const bpmLabel = `${getMidBpm(suggestion)} BPM (${bpmRange[0]}-${bpmRange[1]})`;

  return (
    <View className="border-t border-slate-800 pt-4">
      <Text className="mb-3 text-lg font-extrabold text-slate-200">
        Why it works
      </Text>
      <Row label="BPM" value={bpmLabel} />
      <Row label="Bass notes" value={bassLabel} />
      <Row label="Rhythm" value={rhythmLabel} />
      <Row label="Sound" value={soundHint} />
      <Row label="Scale" value={scaleLabel} />
      <Row label="Chord" value={chordLabel} />
    </View>
  );
}

export function SuggestionPanel({ suggestion, mode, onBack }: Props) {
  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
      showsVerticalScrollIndicator={false}
    >
      <View className="mb-4 flex-row items-center gap-2.5">
        <Pressable
          className="py-2 pr-2.5"
          android_disableSound
          onPress={onBack}
          style={({ pressed }) => ({
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <Text className="text-[13px] font-extrabold text-sky-400">Back</Text>
        </Pressable>
        <View className="flex-1">
          <TabButton
            active
            label={mode === 'explore' ? 'Learning' : 'Use in DAW'}
            onPress={() => {}}
          />
        </View>
      </View>

      {mode === 'explore' ? (
        <IntuitiveLearningPanel suggestion={suggestion} />
      ) : (
        <>
          <DawStepsPanel suggestion={suggestion} />
          <WhyItWorksPanel suggestion={suggestion} />
        </>
      )}
    </ScrollView>
  );
}
