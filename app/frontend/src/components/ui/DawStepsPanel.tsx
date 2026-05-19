import React from 'react';
import { View, Text, Pressable } from 'react-native';
import type { MusicalSuggestion } from '../../features/vibe-map/types';
import { buildDawStepsView } from '../../features/vibe-map/daw-view';
import type { DawNoteView } from '../../features/vibe-map/daw-view';
import { isAudioAvailable } from '../../features/audio-engine/adapter';
import { playAuditionChord, playAuditionNote } from '../../features/audio-engine/audition';
import { useAppStore } from '../../data/store';
import { MIST, FONT } from '../../styles/theme';

interface Props {
  suggestion: MusicalSuggestion;
}

type MidiTab = 'pattern' | 'notes' | 'sound';
const MIDI_TABS: readonly MidiTab[] = ['pattern', 'notes', 'sound'];
const TAB_LABELS: Record<MidiTab, string> = { pattern: 'Pattern', notes: 'Notes', sound: 'Sound' };
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

function ARow({ label, value }: { label: string; value: string }) {
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
          fontFamily: FONT.mono,
          fontSize: 13,
          color: MIST.text,
          fontWeight: '400',
          letterSpacing: 0.4,
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

function TabLink({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
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
      {active && <View style={{ height: 1, backgroundColor: MIST.accent, marginTop: 2 }} />}
    </Pressable>
  );
}

function AuditionPill({ label, disabled, onPress }: { label: string; disabled: boolean; onPress: () => void }) {
  return (
    <Pressable
      android_disableSound
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => ({
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderWidth: 1,
        borderColor: disabled ? MIST.hairline : MIST.hairlineX,
        opacity: pressed ? 0.6 : 1,
      })}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Text style={{ fontFamily: FONT.mono, fontSize: 9, color: disabled ? MIST.textGhost : MIST.accent }}>
          ▶
        </Text>
        <Text style={{ fontFamily: FONT.mono, fontSize: 11, color: disabled ? MIST.textGhost : MIST.text, letterSpacing: 0.5 }}>
          {label}
        </Text>
      </View>
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
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingTop: 14, gap: 10 }}>
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

export function DawStepsPanel({ suggestion }: Props) {
  const [activeTab, setActiveTab] = React.useState<MidiTab>('pattern');
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
            label={TAB_LABELS[tab]}
            active={activeTab === tab}
            onPress={() => setActiveTab(tab)}
          />
        ))}
      </View>

      <View style={{ padding: 24, paddingBottom: 32 }}>

        {/* PATTERN — BPM + scale info, kick step grid, step placement */}
        {activeTab === 'pattern' && (
          <>
            <View style={{ flexDirection: 'row', gap: 10, marginBottom: 28 }}>
              <View style={{ paddingVertical: 12, paddingHorizontal: 16, borderWidth: 1, borderColor: MIST.hairlineX }}>
                <Text style={{ fontFamily: FONT.mono, fontSize: 24, color: MIST.text, letterSpacing: -0.5 }}>
                  {view.bpm}
                </Text>
                <Text style={{ fontFamily: FONT.mono, fontSize: 8, color: MIST.textFaint, letterSpacing: 2.2, marginTop: 2 }}>
                  BPM
                </Text>
              </View>
              <View style={{ flex: 1, paddingVertical: 12, paddingHorizontal: 16, borderWidth: 1, borderColor: MIST.hairline, justifyContent: 'center', gap: 5 }}>
                <Text style={{ fontFamily: FONT.mono, fontSize: 10, color: MIST.textMute, letterSpacing: 1.5 }}>
                  {suggestion.scale.root} {suggestion.scale.mode.replace('_', ' ').toUpperCase()}
                </Text>
                <Text style={{ fontFamily: FONT.mono, fontSize: 9, color: MIST.textFaint, letterSpacing: 1 }}>
                  {view.audition.chordLabel.toUpperCase()}
                </Text>
              </View>
            </View>

            <ASection label="Kick">
              <View style={{ paddingTop: 14 }}>
                <View style={{ flexDirection: 'row', gap: 4 }}>
                  {view.kickPattern.map((hit, index) => (
                    <Pressable
                      key={`step-${index}`}
                      android_disableSound
                      style={({ pressed }) => ({
                        flex: 1,
                        aspectRatio: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderWidth: 1,
                        borderColor: hit ? MIST.accent : MIST.hairline,
                        backgroundColor: hit
                          ? (pressed ? MIST.accent : MIST.accentDim)
                          : (pressed ? MIST.hairline : 'transparent'),
                      })}
                    >
                      {hit && <View style={{ width: 4, height: 4, backgroundColor: MIST.accent }} />}
                    </Pressable>
                  ))}
                </View>
                <View style={{ flexDirection: 'row', gap: 4, marginTop: 6 }}>
                  {Array.from({ length: 16 }).map((_, i) => (
                    <View key={i} style={{ flex: 1, alignItems: 'center' }}>
                      <Text style={{ fontFamily: FONT.mono, fontSize: 8, color: i % 4 === 0 ? MIST.textMute : MIST.textGhost, letterSpacing: 1 }}>
                        {i % 4 === 0 ? `${i / 4 + 1}` : STEP_LABELS[i % 4]}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </ASection>

            <ARow label="Bass" value={`steps ${view.patternSteps.bass}`} />
            <ARow label="Chord" value={`steps ${view.patternSteps.chord}`} />
            <ARow label="Noise" value={`steps ${view.patternSteps.noise}`} />
          </>
        )}

        {/* NOTES — playable chord, chord notes, bass notes, scale notes */}
        {activeTab === 'notes' && (
          <>
            <ASection label="Chord">
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingTop: 14, gap: 10 }}>
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
              onPlayNote={(midi) => { stopPreviewBeforeAudition(); void playAuditionNote(midi, suggestion, { tone: 'stab' }); }}
            />
            <AuditionNoteGroup
              label="Bass notes"
              notes={view.audition.bassNotes}
              disabled={!audioAvailable}
              onPlayNote={(midi) => { stopPreviewBeforeAudition(); void playAuditionNote(midi, suggestion, { tone: 'bass' }); }}
            />
            <AuditionNoteGroup
              label="Scale notes"
              notes={view.audition.scaleNotes}
              disabled={!audioAvailable}
              onPlayNote={(midi) => { stopPreviewBeforeAudition(); void playAuditionNote(midi, suggestion, { tone: 'stab', duration: 0.32, gain: 0.14 }); }}
            />
            {!audioAvailable && (
              <Text style={{ fontFamily: FONT.mono, fontSize: 10, color: MIST.textFaint, letterSpacing: 1, marginTop: 8 }}>
                AUDIO REQUIRES DEV BUILD
              </Text>
            )}
          </>
        )}

        {/* SOUND — track name + variant name only */}
        {activeTab === 'sound' && (
          <>
            {view.trackSetupRows.map((row) => (
              <View
                key={row.label}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingVertical: 16,
                  borderBottomWidth: 1,
                  borderBottomColor: MIST.hairline,
                }}
              >
                <AMiniLabel>{row.label}</AMiniLabel>
                <Text style={{ fontFamily: FONT.sans, fontSize: 13, color: MIST.text, fontWeight: '400' }}>
                  {row.variant}
                </Text>
              </View>
            ))}
          </>
        )}
      </View>
    </View>
  );
}
