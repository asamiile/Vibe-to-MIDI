import React from 'react';
import { View, Text, Pressable } from 'react-native';
import type { MusicalSuggestion } from '../../features/vibe-map/types';
import { buildDawStepsView } from '../../features/vibe-map/daw-view';
import type { DawNoteView, DawTrackSetupRow } from '../../features/vibe-map/daw-view';
import { isAudioAvailable } from '../../features/audio-engine/adapter';
import { playAuditionChord, playAuditionNote } from '../../features/audio-engine/audition';
import { useAppStore } from '../../data/store';

interface Props {
  suggestion: MusicalSuggestion;
}

type MidiTab = 'sequence' | 'audition' | 'synth';

const STEP_LABELS = ['1', 'e', '&', 'a'];
const MIDI_TABS: readonly MidiTab[] = ['sequence', 'audition', 'synth'];

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

function TrackSetupRow({ row }: { row: DawTrackSetupRow }) {
  return (
    <View className="mb-3 rounded-md border border-slate-800 bg-slate-900 p-3">
      <Text className="mb-2 text-[13px] font-black text-slate-200">
        {row.label}
      </Text>
      <ValueRow label="Variant" value={row.variant} />
      <ValueRow label="Type" value={row.type} />
      <ValueRow label="Source" value={row.source} />
      <ValueRow label="DAW target" value={row.target} />
      <ValueRow label="FX" value={row.fx} />
      <ValueRow label="Other usable sounds" value={row.alternatives} />
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

function TabButton({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      android_disableSound
      onPress={onPress}
      className="min-h-10 flex-1 items-center justify-center rounded-md border px-3"
      style={({ pressed }) => ({
        backgroundColor: active ? '#164e63' : '#0f172a',
        borderColor: active ? '#22d3ee' : '#334155',
        opacity: pressed ? 0.75 : 1,
      })}
    >
      <Text
        className="text-xs font-black"
        style={{ color: active ? '#ecfeff' : '#94a3b8' }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function AuditionButton({
  label,
  disabled,
  onPress,
}: {
  label: string;
  disabled: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Play ${label}`}
      android_disableSound
      disabled={disabled}
      onPress={onPress}
      className="mr-2 mb-2 flex-row items-center rounded border px-2.5 py-1.5"
      style={({ pressed }) => ({
        borderColor: disabled ? '#1e293b' : '#334155',
        backgroundColor: disabled ? '#0f172a' : pressed ? '#164e63' : '#111827',
        opacity: pressed ? 0.75 : 1,
      })}
    >
      <Text
        className="mr-1 text-[11px] font-bold"
        style={{ color: disabled ? '#334155' : '#22d3ee' }}
      >
        ▶
      </Text>
      <Text
        className="text-[12px] font-semibold leading-[16px]"
        style={{ color: disabled ? '#475569' : '#cbd5e1' }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function AuditionNoteGroup({
  label,
  notes,
  disabled,
  onPlayNote,
}: {
  label: string;
  notes: readonly DawNoteView[];
  disabled: boolean;
  onPlayNote: (midi: number) => void;
}) {
  return (
    <View className="mb-3">
      <Text className="mb-2 text-[10px] uppercase tracking-[1px] text-slate-500">
        {label}
      </Text>
      <View className="flex-row flex-wrap">
        {notes.map((note, index) => (
          <AuditionButton
            key={`${label}-${index}-${note.midi}`}
            label={note.label}
            disabled={disabled}
            onPress={() => onPlayNote(note.midi)}
          />
        ))}
      </View>
    </View>
  );
}

export function DawStepsPanel({ suggestion }: Props) {
  const [activeTab, setActiveTab] = React.useState<MidiTab>('sequence');
  const view = buildDawStepsView(suggestion);
  const audioAvailable = isAudioAvailable();
  const { isPlaying, stop } = useAppStore();
  const stopPreviewBeforeAudition = React.useCallback(() => {
    if (isPlaying) stop();
  }, [isPlaying, stop]);

  return (
    <View className="mb-2">
      <View className="mb-3 flex-row gap-2">
        {MIDI_TABS.map((tab) => (
          <TabButton
            key={tab}
            label={tab === 'sequence' ? 'Sequence' : tab === 'audition' ? 'Audition' : 'Synth'}
            active={activeTab === tab}
            onPress={() => setActiveTab(tab)}
          />
        ))}
      </View>

      {activeTab === 'sequence' && (
        <>
          <View className="mb-3.5 rounded-md border border-slate-700 bg-gray-900 p-3">
            <MiniLabel>Setup</MiniLabel>
            {view.setupRows.map((row) => (
              <ValueRow key={row.label} label={row.label} value={row.value} />
            ))}
          </View>

          <View className="mb-3.5 rounded-md border border-slate-800 bg-slate-950 p-3">
            <MiniLabel>Sequence</MiniLabel>
            {view.sequenceRows.map((row) => (
              <ValueRow key={row.label} label={row.label} value={row.value} />
            ))}
          </View>

          <View className="rounded-md border border-slate-800 bg-slate-900 p-3">
            <MiniLabel>Kick step grid</MiniLabel>
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
        </>
      )}

      {activeTab === 'audition' && (
        <View className="mb-3.5 rounded-md border border-slate-800 bg-slate-950 p-3">
          <MiniLabel>Audition MIDI</MiniLabel>
          <View className="mb-3">
            <Text className="mb-2 text-[10px] uppercase tracking-[1px] text-slate-500">
              Chord
            </Text>
            <AuditionButton
              label={view.audition.chordLabel}
              disabled={!audioAvailable}
              onPress={() => {
                stopPreviewBeforeAudition();
                void playAuditionChord(
                  view.audition.chordNotes.map((note) => note.midi),
                  suggestion
                );
              }}
            />
          </View>
          <AuditionNoteGroup
            label="Chord notes"
            notes={view.audition.chordNotes}
            disabled={!audioAvailable}
            onPlayNote={(midi) => {
              stopPreviewBeforeAudition();
              void playAuditionNote(midi, suggestion, { tone: 'stab' });
            }}
          />
          <AuditionNoteGroup
            label="Bass notes"
            notes={view.audition.bassNotes}
            disabled={!audioAvailable}
            onPlayNote={(midi) => {
              stopPreviewBeforeAudition();
              void playAuditionNote(midi, suggestion, { tone: 'bass' });
            }}
          />
          <AuditionNoteGroup
            label="Scale notes"
            notes={view.audition.scaleNotes}
            disabled={!audioAvailable}
            onPlayNote={(midi) => {
              stopPreviewBeforeAudition();
              void playAuditionNote(midi, suggestion, { tone: 'stab', duration: 0.32, gain: 0.14 });
            }}
          />
          {!audioAvailable && (
            <Text className="text-[12px] font-semibold leading-[18px] text-slate-500">
              Audio audition requires the native audio runtime.
            </Text>
          )}
        </View>
      )}

      {activeTab === 'synth' && (
        <>
          <View className="mb-3.5 rounded-md border border-slate-800 bg-slate-950 p-3">
            <MiniLabel>Track setup</MiniLabel>
            {view.trackSetupRows.map((row) => (
              <TrackSetupRow key={row.label} row={row} />
            ))}
          </View>

          <View className="mb-3.5 rounded-md border border-slate-800 bg-slate-950 p-3">
            <MiniLabel>Synth settings</MiniLabel>
            {view.soundRows.map((row) => (
              <ValueRow key={row.label} label={row.label} value={row.value} />
            ))}
          </View>
        </>
      )}
    </View>
  );
}
