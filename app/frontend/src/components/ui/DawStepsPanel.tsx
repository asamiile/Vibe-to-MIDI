import React from 'react';
import { View, Text, Pressable } from 'react-native';
import type { MusicalSuggestion } from '../../features/vibe-map/types';
import { buildDawStepsView } from '../../features/vibe-map/daw-view';
import type { DawNoteView, DawTrackSetupRow } from '../../features/vibe-map/daw-view';
import { isAudioAvailable } from '../../features/audio-engine/adapter';
import { playAuditionChord, playAuditionNote } from '../../features/audio-engine/audition';
import { useAppStore } from '../../data/store';
import { MIST, FONT } from '../../styles/theme';

interface Props {
  suggestion: MusicalSuggestion;
}

type MidiTab = 'sequence' | 'audition' | 'synth';
const MIDI_TABS: readonly MidiTab[] = ['sequence', 'audition', 'synth'];
const STEP_LABELS = ['1', 'e', '&', 'a'];

function AMiniLabel({ children }: { children: string }) {
  return (
    <Text
      style={{
        fontFamily: FONT.mono,
        fontSize: 9,
        fontWeight: '500',
        letterSpacing: 2.2,
        textTransform: 'uppercase',
        color: MIST.textMute,
      }}
    >
      {children}
    </Text>
  );
}

function AHairline() {
  return <View style={{ height: 1, backgroundColor: MIST.hairlineX, marginBottom: 4 }} />;
}

function ARow({
  label,
  value,
  mono = true,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: MIST.hairline,
      }}
    >
      <AMiniLabel>{label}</AMiniLabel>
      <Text
        style={{
          fontFamily: mono ? FONT.mono : FONT.sans,
          fontSize: 13,
          color: MIST.text,
          fontWeight: '400',
          letterSpacing: mono ? 0.4 : 0,
          flexShrink: 1,
          marginLeft: 8,
          textAlign: 'right',
        }}
      >
        {value}
      </Text>
    </View>
  );
}

function ASection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={{ marginBottom: 28 }}>
      <View style={{ marginBottom: 4 }}>
        <AMiniLabel>{label}</AMiniLabel>
      </View>
      <AHairline />
      {children}
    </View>
  );
}

function TabLink({
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
      android_disableSound
      onPress={onPress}
      style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, paddingVertical: 2 })}
    >
      <Text
        style={{
          fontFamily: FONT.mono,
          fontSize: 10,
          fontWeight: '500',
          letterSpacing: 2.2,
          textTransform: 'uppercase',
          color: active ? MIST.accent : MIST.textFaint,
        }}
      >
        {label}
      </Text>
      {active && (
        <View style={{ height: 1, backgroundColor: MIST.accent, marginTop: 2 }} />
      )}
    </Pressable>
  );
}

function AuditionPill({
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
      android_disableSound
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: disabled ? MIST.hairline : MIST.hairlineX,
        marginRight: 8,
        marginBottom: 8,
        opacity: pressed ? 0.6 : 1,
      })}
    >
      <Text style={{ fontFamily: FONT.mono, fontSize: 9, color: disabled ? MIST.textGhost : MIST.accent }}>
        ▶
      </Text>
      <Text
        style={{
          fontFamily: FONT.mono,
          fontSize: 11,
          color: disabled ? MIST.textGhost : MIST.text,
          letterSpacing: 0.5,
        }}
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
    <ASection label={label}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingTop: 14 }}>
        {notes.map((note, index) => (
          <AuditionPill
            key={`${label}-${index}-${note.midi}`}
            label={note.label}
            disabled={disabled}
            onPress={() => onPlayNote(note.midi)}
          />
        ))}
      </View>
    </ASection>
  );
}

function TrackSetupCard({ row }: { row: DawTrackSetupRow }) {
  return (
    <ASection label={row.label}>
      <ARow label="Variant"     value={row.variant}      mono={false} />
      <ARow label="Type"        value={row.type}         mono={false} />
      <ARow label="Source"      value={row.source}       mono={false} />
      <ARow label="DAW target"  value={row.target}       mono={false} />
      <ARow label="FX"          value={row.fx}           mono={false} />
      <ARow label="Alternatives" value={row.alternatives} mono={false} />
    </ASection>
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
    <View>
      {/* Tab row */}
      <View
        style={{
          flexDirection: 'row',
          gap: 24,
          paddingHorizontal: 24,
          paddingVertical: 10,
          borderBottomWidth: 1,
          borderBottomColor: MIST.hairline,
        }}
      >
        {MIDI_TABS.map((tab) => (
          <TabLink
            key={tab}
            label={tab}
            active={activeTab === tab}
            onPress={() => setActiveTab(tab)}
          />
        ))}
      </View>

      <View style={{ padding: 24, paddingBottom: 32 }}>
        {activeTab === 'sequence' && (
          <>
            <ASection label="Setup">
              {view.setupRows.map((row) => (
                <ARow key={row.label} label={row.label} value={row.value} />
              ))}
            </ASection>

            <ASection label="Sequence">
              {view.sequenceRows.map((row) => (
                <ARow key={row.label} label={row.label} value={row.value} />
              ))}
            </ASection>

            <ASection label="Kick · step grid">
              <View style={{ paddingTop: 14 }}>
                <View
                  style={{
                    flexDirection: 'row',
                    gap: 4,
                    flexWrap: 'nowrap',
                  }}
                >
                  {view.kickPattern.map((hit, index) => (
                    <View
                      key={`step-${index}`}
                      style={{
                        flex: 1,
                        aspectRatio: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderWidth: 1,
                        borderColor: hit ? MIST.accent : MIST.hairline,
                        backgroundColor: hit ? MIST.accentDim : 'transparent',
                      }}
                    >
                      {hit && (
                        <View style={{ width: 4, height: 4, backgroundColor: MIST.accent }} />
                      )}
                    </View>
                  ))}
                </View>
                <View style={{ flexDirection: 'row', gap: 4, marginTop: 6 }}>
                  {Array.from({ length: 16 }).map((_, i) => (
                    <View key={i} style={{ flex: 1, alignItems: 'center' }}>
                      <Text
                        style={{
                          fontFamily: FONT.mono,
                          fontSize: 8,
                          color: i % 4 === 0 ? MIST.textMute : MIST.textGhost,
                          letterSpacing: 1,
                        }}
                      >
                        {i % 4 === 0 ? `${i / 4 + 1}` : STEP_LABELS[i % 4]}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </ASection>
          </>
        )}

        {activeTab === 'audition' && (
          <>
            <ASection label="Chord">
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingTop: 14 }}>
                <AuditionPill
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
            </ASection>

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
              <Text
                style={{
                  fontFamily: FONT.mono,
                  fontSize: 10,
                  color: MIST.textFaint,
                  letterSpacing: 1,
                  marginTop: 8,
                }}
              >
                AUDIO REQUIRES DEV BUILD
              </Text>
            )}
          </>
        )}

        {activeTab === 'synth' && (
          <>
            {view.trackSetupRows.map((row) => (
              <TrackSetupCard key={row.label} row={row} />
            ))}
            <ASection label="Synth settings">
              {view.soundRows.map((row) => (
                <ARow key={row.label} label={row.label} value={row.value} />
              ))}
            </ASection>
          </>
        )}
      </View>
    </View>
  );
}
