import React from 'react';
import { View, Text } from 'react-native';
import type { MusicalSuggestion } from '../../features/vibe-map/types';
import { getLearningCue } from '../../features/vibe-map/learning';
import { midiToNoteName } from '../../lib/notes';

interface Props {
  suggestion: MusicalSuggestion;
}

const STEP_LABELS = ['1', 'e', '&', 'a'];

function LayerChip({ label, detail }: { label: string; detail: string }) {
  return (
    <View
      className="min-w-24 flex-1 rounded-md border border-slate-800 bg-slate-900 p-2.5"
    >
      <Text className="mb-1 text-[13px] font-extrabold text-slate-200">
        {label}
      </Text>
      <Text className="text-[11px] leading-[15px] text-slate-400">
        {detail}
      </Text>
    </View>
  );
}

function SectionTitle({ children }: { children: string }) {
  return (
    <Text className="mb-2 text-[10px] uppercase tracking-[1px] text-slate-400">
      {children}
    </Text>
  );
}

function ReasonText({ children }: { children: React.ReactNode }) {
  return (
    <Text className="mt-2 text-xs leading-[17px] text-slate-400">
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
    <View className="mb-[18px]">
      <View className="mb-[18px] flex-row flex-wrap gap-2">
        <LayerChip label="Pulse" detail={`${cue.rhythmFeel} rhythm hits`} />
        <LayerChip label="Bass" detail={`${cue.bassMotion} motion`} />
        <LayerChip label="Color" detail={`${suggestion.scale.root} ${suggestion.scale.mode.replace('_', ' ')}`} />
      </View>

      <View className="mb-[18px] rounded-lg border border-slate-700 bg-gray-900 p-3.5">
        <SectionTitle>Try this</SectionTitle>
        <Text className="mb-2.5 text-[15px] font-bold leading-[21px] text-slate-200">
          {cue.tryChange}
        </Text>
        <View className="self-start rounded bg-cyan-900 px-2.5 py-1.5">
          <Text className="text-xs font-extrabold text-cyan-100">
            Result: {cue.resultWord}
          </Text>
        </View>
      </View>

      <View className="mb-[18px] rounded-lg border border-slate-800 bg-slate-900 p-3.5">
        <SectionTitle>What changed?</SectionTitle>
        <Text className="text-sm font-semibold leading-5 text-slate-300">
          {cue.whatChanged}
        </Text>
      </View>

      <View className="mb-[18px]">
        <SectionTitle>Pulse</SectionTitle>
        <View className="flex-row gap-1">
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

      <View className="mb-[18px]">
        <SectionTitle>Bass motion</SectionTitle>
        <View className="h-[86px] flex-row items-end gap-2">
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

      <View className="mb-[18px]">
        <SectionTitle>Scale color</SectionTitle>
        <View className="flex-row flex-wrap gap-1.5">
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

      <View className="mb-[18px]">
        <SectionTitle>Sound layers</SectionTitle>
        <View className="flex-row flex-wrap gap-2">
          {suggestion.soundLayers.map((layer) => (
            <View
              key={layer.role}
              style={{
                paddingHorizontal: 10,
                paddingVertical: 8,
                borderRadius: 6,
                borderWidth: 1,
                borderColor: layer.optional ? '#334155' : '#0e7490',
                backgroundColor: layer.optional ? '#0f172a' : '#0c2a33',
                opacity: layer.optional ? 0.5 : 1,
              }}
            >
              <Text style={{ color: '#94a3b8', fontSize: 9, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 }}>
                {layer.role}
              </Text>
              <Text style={{ color: layer.optional ? '#475569' : '#e2e8f0', fontSize: 12, fontWeight: '600' }}>
                {layer.descriptor}
              </Text>
            </View>
          ))}
        </View>
      </View>

    </View>
  );
}
