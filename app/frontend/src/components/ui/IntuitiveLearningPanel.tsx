import React from 'react';
import { View, Text } from 'react-native';
import type { MusicalSuggestion } from '../../features/vibe-map/types';
import { getLearningCue } from '../../features/vibe-map/learning';
import { midiToNoteName } from '../../lib/notes';

interface Props {
  suggestion: MusicalSuggestion;
}

const STEP_LABELS = ['1', 'e', '&', 'a'];

function SectionTitle({ children }: { children: string }) {
  return (
    <Text style={{ color: '#94a3b8', fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>
      {children}
    </Text>
  );
}

function ReasonText({ children }: { children: React.ReactNode }) {
  return (
    <Text style={{ color: '#94a3b8', fontSize: 12, lineHeight: 17, marginTop: 8 }}>
      {children}
    </Text>
  );
}

export function IntuitiveLearningPanel({ suggestion }: Props) {
  const cue = getLearningCue(suggestion);
  const bassNoteNames = suggestion.bassNotes.map(midiToNoteName);
  const lowestBass = Math.min(...suggestion.bassNotes);
  const highestBass = Math.max(...suggestion.bassNotes);
  const bassRange = Math.max(1, highestBass - lowestBass);

  return (
    <View style={{ marginTop: 4, marginBottom: 18 }}>
      <Text style={{ color: '#e2e8f0', fontSize: 18, fontWeight: '800', marginBottom: 6 }}>
        Try this
      </Text>
      <Text style={{ color: '#94a3b8', fontSize: 13, lineHeight: 18, marginBottom: 14 }}>
        Make one small change and listen for the mood shift.
      </Text>

      <View style={{ padding: 12, borderRadius: 6, backgroundColor: '#111827', borderWidth: 1, borderColor: '#334155', marginBottom: 18 }}>
        <SectionTitle>First move</SectionTitle>
        <Text style={{ color: '#e2e8f0', fontSize: 14, lineHeight: 20, fontWeight: '600' }}>
          {cue.firstMove}
        </Text>
      </View>

      <View style={{ marginBottom: 18 }}>
        <SectionTitle>Pulse</SectionTitle>
        <View style={{ flexDirection: 'row', gap: 4 }}>
          {cue.pulseMap.map((kind, index) => {
            const isHit = kind !== 'rest';
            const isDownbeat = kind === 'downbeat';
            return (
              <View
                key={`${kind}-${index}`}
                style={{
                  flex: 1,
                  minHeight: 42,
                  borderRadius: 4,
                  borderWidth: 1,
                  borderColor: isHit ? '#38bdf8' : '#1e293b',
                  backgroundColor: isHit ? (isDownbeat ? '#0e7490' : '#164e63') : '#0f172a',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ color: isHit ? '#e0f2fe' : '#334155', fontSize: 9, fontWeight: '700' }}>
                  {STEP_LABELS[index % 4]}
                </Text>
              </View>
            );
          })}
        </View>
        <ReasonText>{cue.rhythmReason}</ReasonText>
      </View>

      <View style={{ marginBottom: 18 }}>
        <SectionTitle>Bass motion</SectionTitle>
        <View style={{ height: 86, flexDirection: 'row', alignItems: 'flex-end', gap: 8 }}>
          {bassNoteNames.map((note, index) => {
            const offset = ((suggestion.bassNotes[index] - lowestBass) / bassRange) * 34;
            return (
              <View
                key={`${note}-${index}`}
                style={{
                  flex: 1,
                  height: 46 + offset,
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                }}
              >
                <View
                  style={{
                    width: '100%',
                    paddingVertical: 5,
                    borderRadius: 4,
                    alignItems: 'center',
                    backgroundColor: '#172554',
                    borderWidth: 1,
                    borderColor: '#3b82f6',
                  }}
                >
                  <Text style={{ color: '#dbeafe', fontSize: 12, fontWeight: '700' }}>{note}</Text>
                </View>
              </View>
            );
          })}
        </View>
        <ReasonText>{cue.bassReason}</ReasonText>
      </View>

      <View style={{ marginBottom: 18 }}>
        <SectionTitle>Scale color</SectionTitle>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
          {cue.scaleNotes.map((note, index) => (
            <View
              key={note}
              style={{
                paddingHorizontal: 8,
                paddingVertical: 6,
                borderRadius: 4,
                backgroundColor: index === 0 ? '#365314' : '#1e293b',
                borderWidth: 1,
                borderColor: index === 0 ? '#84cc16' : '#334155',
              }}
            >
              <Text style={{ color: index === 0 ? '#ecfccb' : '#cbd5e1', fontSize: 12, fontWeight: '700' }}>
                {note}
              </Text>
            </View>
          ))}
        </View>
        <ReasonText>{cue.scaleReason}. {cue.chordReason}</ReasonText>
      </View>

    </View>
  );
}
