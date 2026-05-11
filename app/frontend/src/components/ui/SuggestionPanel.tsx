import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import type { MusicalSuggestion } from '../../features/vibe-map/types';
import { midiToNoteName } from '../../lib/notes';
import { getMidBpm } from '../../features/vibe-map/engine';
import { IntuitiveLearningPanel } from './IntuitiveLearningPanel';

interface Props {
  suggestion: MusicalSuggestion;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={{ color: '#475569', fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 2 }}>
        {label}
      </Text>
      <Text style={{ color: '#e2e8f0', fontSize: 14, fontWeight: '500' }}>
        {value}
      </Text>
    </View>
  );
}

export function SuggestionPanel({ suggestion }: Props) {
  const { scale, chord, bassNotes, rhythmPattern, soundHint, bpmRange } = suggestion;

  const scaleLabel = `${scale.root} ${scale.mode.replace('_', ' ')}`;
  const chordLabel = `${chord.root} ${chord.quality.replace('_', ' ')}`;
  const bassLabel = bassNotes.map(midiToNoteName).join('  ');
  const rhythmLabel = rhythmPattern.map((hit) => (hit ? '●' : '○')).join(' ');
  const bpmLabel = `${getMidBpm(suggestion)} BPM  (${bpmRange[0]}–${bpmRange[1]})`;

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ padding: 16 }}
      showsVerticalScrollIndicator={false}
    >
      <Row label="Scale" value={scaleLabel} />
      <Row label="Chord" value={chordLabel} />
      <Row label="Bass notes" value={bassLabel} />
      <Row label="Rhythm" value={rhythmLabel} />
      <Row label="BPM" value={bpmLabel} />
      <Row label="Sound" value={soundHint} />
      <IntuitiveLearningPanel suggestion={suggestion} />
    </ScrollView>
  );
}
