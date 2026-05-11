import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import type { MusicalSuggestion } from '../../features/vibe-map/types';
import { midiToNoteName } from '../../lib/notes';
import { getMidBpm } from '../../features/vibe-map/engine';
import { IntuitiveLearningPanel } from './IntuitiveLearningPanel';
import { DawStepsPanel } from './DawStepsPanel';

interface Props {
  suggestion: MusicalSuggestion;
}

type SuggestionTab = 'explore' | 'use';

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
      android_disableSound
      onPress={onPress}
      style={({ pressed }) => ({
        flex: 1,
        minHeight: 40,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: active ? '#0e7490' : '#111827',
        borderWidth: 1,
        borderColor: active ? '#22d3ee' : '#1e293b',
        opacity: pressed ? 0.75 : 1,
      })}
    >
      <Text style={{ color: active ? '#ecfeff' : '#94a3b8', fontSize: 12, fontWeight: '800' }}>
        {label}
      </Text>
    </Pressable>
  );
}

function WhyItWorksPanel({ suggestion }: Props) {
  const { scale, chord, bassNotes, rhythmPattern, soundHint, bpmRange } = suggestion;

  const scaleLabel = `${scale.root} ${scale.mode.replace('_', ' ')}`;
  const chordLabel = `${chord.root} ${chord.quality.replace('_', ' ')}`;
  const bassLabel = bassNotes.map(midiToNoteName).join('  ');
  const rhythmLabel = rhythmPattern.map((hit) => (hit ? 'hit' : '-')).join(' ');
  const bpmLabel = `${getMidBpm(suggestion)} BPM (${bpmRange[0]}-${bpmRange[1]})`;

  return (
    <View style={{ paddingTop: 16, borderTopWidth: 1, borderTopColor: '#1e293b' }}>
      <Text style={{ color: '#e2e8f0', fontSize: 18, fontWeight: '800', marginBottom: 12 }}>
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

export function SuggestionPanel({ suggestion }: Props) {
  const [activeTab, setActiveTab] = useState<SuggestionTab>('explore');

  useEffect(() => {
    setActiveTab('explore');
  }, [suggestion.vibeId]);

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
        <TabButton
          active={activeTab === 'explore'}
          label="Explore"
          onPress={() => setActiveTab('explore')}
        />
        <TabButton
          active={activeTab === 'use'}
          label="Use in DAW"
          onPress={() => setActiveTab('use')}
        />
      </View>

      {activeTab === 'explore' ? (
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
