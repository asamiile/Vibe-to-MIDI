import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import type { MusicalSuggestion } from '../../features/vibe-map/types';
import { midiToNoteName } from '../../lib/notes';
import { getMidBpm } from '../../features/vibe-map/engine';
import { IntuitiveLearningPanel } from './IntuitiveLearningPanel';
import { DawStepsPanel } from './DawStepsPanel';

interface Props {
  suggestion: MusicalSuggestion;
  mode: 'explore' | 'use';
  onBack: () => void;
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

function WhyItWorksPanel({ suggestion }: { suggestion: MusicalSuggestion }) {
  const { scale, chord, bassNotes, rhythmPattern, soundHint, bpmRange } = suggestion;

  const scaleLabel = `${scale.root} ${scale.mode.replace('_', ' ')}`;
  const chordLabel = `${chord.root} ${chord.quality.replace('_', ' ')}`;
  const bassLabel = bassNotes.map(midiToNoteName).join('  ');
  const rhythmLabel = rhythmPattern.map((hit) => (hit ? 'hit' : '-')).join(' ');
  const bpmLabel = `${getMidBpm(suggestion)} BPM (${bpmRange[0]}-${bpmRange[1]})`;

  return (
    <View className="border-t border-slate-800 pt-4">
      <Text className="mb-3 text-lg font-extrabold text-slate-200">Why it works</Text>
      <Row label="BPM" value={bpmLabel} />
      <Row label="Bass notes" value={bassLabel} />
      <Row label="Rhythm" value={rhythmLabel} />
      <Row label="Sound" value={soundHint} />
      <Row label="Scale" value={scaleLabel} />
      <Row label="Chord" value={chordLabel} />
    </View>
  );
}

export function SuggestionPanel({ suggestion, mode }: Omit<Props, 'onBack'>) {
  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
      showsVerticalScrollIndicator={false}
    >
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
