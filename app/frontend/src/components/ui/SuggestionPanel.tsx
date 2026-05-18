import React from 'react';
import { ScrollView } from 'react-native';
import type { MusicalSuggestion } from '../../features/vibe-map/types';
import { IntuitiveLearningPanel } from './IntuitiveLearningPanel';
import { DawStepsPanel } from './DawStepsPanel';

interface Props {
  suggestion: MusicalSuggestion;
  mode: 'explore' | 'use';
  onBack: () => void;
}

export function SuggestionPanel({ suggestion, mode }: Omit<Props, 'onBack'>) {
  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ paddingBottom: 32 }}
      showsVerticalScrollIndicator={false}
    >
      {mode === 'explore' ? (
        <IntuitiveLearningPanel suggestion={suggestion} />
      ) : (
        <DawStepsPanel suggestion={suggestion} />
      )}
    </ScrollView>
  );
}
