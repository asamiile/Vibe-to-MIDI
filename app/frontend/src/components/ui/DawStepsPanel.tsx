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
    <View style={{ marginBottom: 8 }}>
      <Text style={{ color: '#cbd5e1', fontSize: 13, lineHeight: 19, fontWeight: '600' }}>
        {children}
      </Text>
    </View>
  );
}

function MiniLabel({ children }: { children: string }) {
  return (
    <Text style={{ color: '#94a3b8', fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>
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
    <View
      style={{
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#1e293b',
        marginTop: 2,
        marginBottom: 8,
      }}
    >
      <Text style={{ color: '#e2e8f0', fontSize: 18, fontWeight: '800', marginBottom: 4 }}>
        Use in MIDI / DAW
      </Text>
      <Text style={{ color: '#94a3b8', fontSize: 13, lineHeight: 18, marginBottom: 14 }}>
        When you find a sound you like, copy these values into a 1-bar MIDI clip.
      </Text>

      <View
        style={{
          padding: 12,
          borderRadius: 6,
          backgroundColor: '#111827',
          borderWidth: 1,
          borderColor: '#334155',
          marginBottom: 14,
        }}
      >
        <StepText>Tempo: {bpm} BPM</StepText>
        <StepText>Bass notes: {bassNotes.join('  ')}</StepText>
        <StepText>Hit steps: {hitSteps.join(', ')}</StepText>
        <StepText>Sound: {suggestion.soundHint}</StepText>
      </View>

      <View
        style={{
          padding: 12,
          borderRadius: 6,
          backgroundColor: '#0f172a',
          borderWidth: 1,
          borderColor: '#1e293b',
        }}
      >
        <MiniLabel>16-step clip</MiniLabel>
        <View style={{ flexDirection: 'row', gap: 4 }}>
          {suggestion.rhythmPattern.map((hit, index) => (
            <View key={`daw-step-${index}`} style={{ flex: 1, gap: 4 }}>
              <View
                style={{
                  height: 32,
                  borderRadius: 4,
                  borderWidth: 1,
                  borderColor: hit ? '#22d3ee' : '#1e293b',
                  backgroundColor: hit ? '#0e7490' : '#111827',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ color: hit ? '#ecfeff' : '#475569', fontSize: 10, fontWeight: '700' }}>
                  {hit ? 'hit' : ''}
                </Text>
              </View>
              <Text style={{ color: index % 4 === 0 ? '#cbd5e1' : '#475569', textAlign: 'center', fontSize: 9 }}>
                {STEP_LABELS[index % 4]}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
