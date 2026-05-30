import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import type { MusicalSuggestion } from '../../features/vibe-map/types';
import { buildDawStepsView } from '../../features/vibe-map/daw-view';
import type { DawNoteView } from '../../features/vibe-map/daw-view';
import { isAudioAvailable } from '../../features/audio-engine/adapter';
import { playAuditionChord, playAuditionNote } from '../../features/audio-engine/audition';
import { useAppStore } from '../../data/store';
import { isProFeatureEnabled } from '../../features/entitlements/pro-features';
import { buildMidiExport } from '../../features/midi-export/export-midi';
import { shareMidiExport } from '../../features/midi-export/share-midi';
import { MIST, FONT } from '../../styles/theme';
import { KickStepGrid } from './KickStepGrid';
import { AButton } from './AButton';

interface Props {
  suggestion: MusicalSuggestion;
}

type MidiTab = 'pattern' | 'notes' | 'sound';
const MIDI_TABS: readonly MidiTab[] = ['pattern', 'notes', 'sound'];
const TAB_LABELS: Record<MidiTab, string> = { pattern: 'Pattern', notes: 'Notes', sound: 'Sound' };

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

function ValueBlock({
  label,
  value,
  mono = true,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <View style={{ marginBottom: 12 }}>
      <AMiniLabel>{label}</AMiniLabel>
      <Text
        style={{
          fontFamily: mono ? FONT.mono : FONT.sans,
          fontSize: 13,
          color: MIST.text,
          fontWeight: '400',
          letterSpacing: 0.4,
          lineHeight: 19,
          marginTop: 3,
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
      <View style={{ marginBottom: 8 }}>
        <AMiniLabel>{label}</AMiniLabel>
      </View>
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
    <View style={{ flex: 1, minWidth: 0, minHeight: 40, alignItems: 'stretch' }}>
      <Pressable
        android_disableSound
        onPress={onPress}
        style={({ pressed }) => ({
          width: '100%',
          height: 40,
          minHeight: 40,
          alignItems: 'center',
          opacity: pressed ? 0.5 : 1,
          paddingHorizontal: 12,
          paddingTop: 8,
        })}
      >
        <Text
          style={{
            fontFamily: FONT.mono,
            fontSize: 10,
            fontWeight: '500',
            letterSpacing: 2.2,
            textTransform: 'uppercase',
            color: active ? MIST.accent : MIST.textFaint,
            textAlign: 'center',
          }}
          numberOfLines={1}
        >
          {label}
        </Text>
        <View
          style={{
            width: '100%',
            height: 1,
            marginTop: 8,
            backgroundColor: active ? MIST.accent : 'transparent',
          }}
        />
      </Pressable>
    </View>
  );
}

function TrackNameBar({
  title,
  meta,
}: {
  title: string;
  meta: string;
}) {
  return (
    <View
      style={{
        width: '100%',
        alignSelf: 'stretch',
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 12,
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: MIST.hairline,
      }}
    >
      <Text
        style={{
          flex: 1,
          fontFamily: FONT.sans,
          fontSize: 20,
          fontWeight: '300',
          color: MIST.text,
          letterSpacing: -0.4,
          lineHeight: 20,
        }}
        numberOfLines={1}
      >
        {title}
      </Text>
      <Text
        style={{
          fontFamily: FONT.mono,
          fontSize: 10,
          color: MIST.textFaint,
          letterSpacing: 1.8,
          lineHeight: 12,
          textAlign: 'right',
        }}
      >
        {meta}
      </Text>
    </View>
  );
}

function MidiExportBar({
  enabled,
  busy,
  message,
  onExport,
  onUpgrade,
}: {
  enabled: boolean;
  busy: boolean;
  message: string | null;
  onExport: () => void;
  onUpgrade: () => void;
}) {
  // State 1 · Free: hairlineX border, transparent bg, text color
  // State 2 · Ready / 3 · Busy / 4 · Success / 5 · Error: accent border, accentDim bg, accent color
  const btnLabel = enabled
    ? (busy ? 'Exporting .mid' : 'Export .mid')
    : 'Export MIDI · Pro';

  // Sub-label color per state
  const sublabelColor = busy
    ? MIST.textFaint                                   // State 3 · Busy
    : message?.includes('failed')
      ? MIST.textFaint                                 // State 5 · Error
      : message
        ? MIST.textMute                                // State 4 · Success
        : enabled ? MIST.textMute : MIST.textFaint;   // State 2 · Ready / State 1 · Free

  const sublabelText = message
    ?? (enabled
      ? 'Share the current loop as a DAW-ready MIDI file.'
      : 'Unlock .mid export for DAW editing.');

  const buttonVariant = !enabled
    ? 'default'
    : busy
      ? 'busy'
      : message && !message.includes('failed')
        ? 'success'
        : 'accent';

  return (
    <View
      style={{
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: MIST.hairline,
      }}
    >
      <AButton
        variant={buttonVariant}
        label={btnLabel}
        onPress={enabled ? onExport : onUpgrade}
      />
      <Text
        style={{
          marginTop: 8,
          fontFamily: FONT.sans,
          fontSize: 11,
          lineHeight: 16,
          color: sublabelColor,
        }}
      >
        {sublabelText}
      </Text>
    </View>
  );
}

function AuditionPill({
  label,
  disabled,
  playing,
  onPress,
}: {
  label: string;
  disabled: boolean;
  playing: boolean;
  onPress: () => void;
}) {
  const arrowColor = disabled ? MIST.textGhost : MIST.accent;
  const labelColor = disabled ? MIST.textGhost : MIST.text;
  return (
    <Pressable
      android_disableSound
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => ({
        opacity: pressed ? 0.6 : 1,
      })}
    >
      <View
        style={{
          minHeight: 38,
          minWidth: 58,
          paddingVertical: 10,
          paddingHorizontal: 14,
          borderWidth: 1,
          borderStyle: 'solid',
          borderColor: disabled ? MIST.hairline : playing ? MIST.accent : 'rgba(255,255,255,0.2)',
          backgroundColor: playing ? MIST.accentDim : 'transparent',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <Text style={{ fontFamily: FONT.mono, fontSize: 9, color: arrowColor }}>▶</Text>
        <Text style={{ fontFamily: FONT.mono, fontSize: 11, color: labelColor, letterSpacing: 0.5 }}>
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
  playingKey,
  onPlayNote,
}: {
  label: string;
  notes: readonly DawNoteView[];
  disabled: boolean;
  playingKey: string | null;
  onPlayNote: (midi: number) => void;
}) {
  return (
    <View style={{ marginBottom: 12 }}>
      <View style={{ marginBottom: 8 }}>
        <AMiniLabel>{label}</AMiniLabel>
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginRight: -10, marginBottom: -10 }}>
        {notes.map((note, index) => (
          <View key={`${label}-${index}-${note.midi}`} style={{ marginRight: 10, marginBottom: 10 }}>
            <AuditionPill
              label={note.label}
              disabled={disabled}
              playing={playingKey === String(note.midi)}
              onPress={() => onPlayNote(note.midi)}
            />
          </View>
        ))}
      </View>
    </View>
  );
}

function hitStepsLabel(pattern?: readonly boolean[]): string {
  if (!pattern) return 'none';
  const steps = pattern
    .map((hit, index) => (hit ? index + 1 : null))
    .filter((step): step is number => step !== null);
  return steps.length > 0 ? steps.join(' · ') : 'none';
}

export function DawStepsPanel({ suggestion }: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState<MidiTab>('pattern');
  const [playingKey, setPlayingKey] = React.useState<string | null>(null);
  const [midiExportMessage, setMidiExportMessage] = React.useState<string | null>(null);
  const [midiExportBusy, setMidiExportBusy] = React.useState(false);
  const playTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const view = React.useMemo(() => buildDawStepsView(suggestion), [suggestion]);
  const audioAvailable = isAudioAvailable();
  const isPlaying = useAppStore((state) => state.isPlaying);
  const stop = useAppStore((state) => state.stop);
  const hasProAccess = useAppStore((state) => state.hasProAccess);
  const midiExportEnabled = isProFeatureEnabled('midi_export', hasProAccess);
  const stopPreviewBeforeAudition = React.useCallback(() => {
    if (isPlaying) stop();
  }, [isPlaying, stop]);

  React.useEffect(() => () => {
    if (playTimer.current) {
      clearTimeout(playTimer.current);
      playTimer.current = null;
    }
  }, []);

  React.useEffect(() => {
    setMidiExportMessage(null);
  }, [suggestion]);

  function auditPlay(key: string, fn: () => void) {
    requestAnimationFrame(() => {
      if (playTimer.current) clearTimeout(playTimer.current);
      stopPreviewBeforeAudition();
      setPlayingKey(key);
      fn();
      playTimer.current = setTimeout(() => setPlayingKey(null), 900);
    });
  }

  async function handleMidiExport() {
    if (midiExportBusy) return;
    setMidiExportBusy(true);
    setMidiExportMessage(null);
    requestAnimationFrame(async () => {
      try {
        const exported = buildMidiExport(suggestion);
        const shared = await shareMidiExport(exported);
        setMidiExportMessage(`${shared.filename} ready to share`);
      } catch {
        setMidiExportMessage('MIDI export failed. Try again from a development build.');
      } finally {
        setMidiExportBusy(false);
      }
    });
  }

  const chordNotesLabel = view.audition.chordNotes.map((note) => note.label).join(' ');
  const bassNotesLabel = view.audition.bassNotes.map((note) => note.label).join(' · ');
  const trackTitle = `${suggestion.scale.root} ${suggestion.scale.mode.replace('_', ' ')} · ${view.audition.chordLabel}`;
  const trackMeta = `${view.bpm}\nBPM`;

  return (
    <View style={{ width: '100%', alignSelf: 'stretch' }}>
      <TrackNameBar title={trackTitle} meta={trackMeta} />

      {/* Tab row */}
      <View
        style={{
          width: '100%',
          alignSelf: 'stretch',
          flexDirection: 'row',
          gap: 0,
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

      <MidiExportBar
        enabled={midiExportEnabled}
        busy={midiExportBusy}
        message={midiExportMessage}
        onExport={() => { void handleMidiExport(); }}
        onUpgrade={() => router.push('/pro')}
      />

      <View style={{ width: '100%', alignSelf: 'stretch', padding: 24, paddingBottom: 32 }}>

        {/* PATTERN — setup info + kick step grid */}
        {activeTab === 'pattern' && (
          <>
            <ASection label="Setup">
              <ValueBlock
                label="Tempo"
                value={`${view.bpm} BPM · 16 steps`}
              />
              <ValueBlock
                label="Scale"
                value={`${suggestion.scale.root} ${suggestion.scale.mode.replace('_', ' ')}`}
              />
              <ValueBlock
                label="Chord"
                value={`${view.audition.chordLabel} · ${chordNotesLabel}`}
              />
            </ASection>

            <ASection label="Sequence">
              <ValueBlock label="Bass notes" value={bassNotesLabel} />
              <ValueBlock label="Note length" value="1/4 · long sustain (1.0s)" />
              <ValueBlock label="Kick steps" value={hitStepsLabel(view.kickPattern)} />
            </ASection>

            <ASection label="Kick step grid">
              <View style={{ width: '100%', alignSelf: 'stretch', paddingTop: 14 }}>
                <KickStepGrid pattern={view.kickPattern} />
              </View>
            </ASection>

          </>
        )}

        {/* NOTES — playable chord, chord notes, bass notes, scale notes */}
        {activeTab === 'notes' && (
          <>
            <View style={{ marginBottom: 14 }}>
              <AMiniLabel>Audition MIDI</AMiniLabel>
            </View>
            <View style={{ marginBottom: 12 }}>
              <View style={{ marginBottom: 8 }}>
                <AMiniLabel>Chord</AMiniLabel>
              </View>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginRight: -10, marginBottom: -10 }}>
                <View style={{ marginRight: 10, marginBottom: 10 }}>
                  <AuditionPill
                    label={view.audition.chordLabel}
                    disabled={!audioAvailable}
                    playing={playingKey === 'chord'}
                    onPress={() => auditPlay('chord', () => {
                      void playAuditionChord(
                        view.audition.chordNotes.map((note) => note.midi),
                        suggestion
                      );
                    })}
                  />
                </View>
              </View>
            </View>
            <AuditionNoteGroup
              label="Chord notes"
              notes={view.audition.chordNotes}
              disabled={!audioAvailable}
              playingKey={playingKey}
              onPlayNote={(midi) => auditPlay(String(midi), () => { void playAuditionNote(midi, suggestion, { tone: 'stab' }); })}
            />
            <AuditionNoteGroup
              label="Bass notes"
              notes={view.audition.bassNotes}
              disabled={!audioAvailable}
              playingKey={playingKey}
              onPlayNote={(midi) => auditPlay(String(midi), () => { void playAuditionNote(midi, suggestion, { tone: 'bass' }); })}
            />
            <AuditionNoteGroup
              label="Scale notes"
              notes={view.audition.scaleNotes}
              disabled={!audioAvailable}
              playingKey={playingKey}
              onPlayNote={(midi) => auditPlay(String(midi), () => { void playAuditionNote(midi, suggestion, { tone: 'stab', duration: 0.32, gain: 0.14 }); })}
            />
            {!audioAvailable && (
              <Text style={{ fontFamily: FONT.mono, fontSize: 10, color: MIST.textFaint, letterSpacing: 1, marginTop: 8 }}>
                AUDIO REQUIRES DEV BUILD
              </Text>
            )}
          </>
        )}

        {/* SOUND — per-track details: variant, type, source, DAW target, FX */}
        {activeTab === 'sound' && (
          <ASection label="Track Setup">
            {view.trackSetupRows.map((row) => (
              <View
                key={row.label}
                style={{
                  marginBottom: 12,
                  padding: 12,
                  borderWidth: 1,
                  borderColor: MIST.hairline,
                }}
              >
                <Text style={{
                  fontFamily: FONT.sans,
                  fontSize: 13,
                  fontWeight: '900',
                  color: MIST.text,
                  marginBottom: 8,
                }}>
                  {row.label}
                </Text>
                {[
                  { label: 'Variant',    value: row.variant },
                  { label: 'Type',       value: row.type },
                  { label: 'Source',     value: row.source },
                  { label: 'DAW Target', value: row.target },
                  { label: 'FX',         value: row.fx.split(';')[0].trim() },
                ].map(({ label, value }) => (
                  <View key={label} style={{ marginBottom: 10 }}>
                    <ValueBlock label={label} value={value} mono={false} />
                  </View>
                ))}
              </View>
            ))}
          </ASection>
        )}
      </View>
    </View>
  );
}
