import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  StatusBar,
  Modal,
  ScrollView,
  BackHandler,
  Linking,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Constants from 'expo-constants';
import { useAppStore } from '../src/data/store';
import { getAllVibeIds } from '../src/features/vibe-map/engine';
import { isAudioAvailable } from '../src/features/audio-engine/adapter';
import { SuggestionPanel } from '../src/components/ui/SuggestionPanel';
import { VIBE_LABELS } from '../src/features/vibe-map/labels';
import { VibeGlyph } from '../src/components/ui/VibeGlyph';
import { withSettingsReturn } from '../src/lib/navigation';
import { MIST, FONT } from '../src/styles/theme';
import type { VibeId } from '../src/features/vibe-map/types';

const VIBE_IDS = getAllVibeIds();

type ViewMode = 'listen' | 'details' | 'learn';

function VibeCell({
  id,
  index,
  active,
  playing,
  audioAvailable,
  onPress,
}: {
  id: VibeId;
  index: number;
  active: boolean;
  playing: boolean;
  audioAvailable: boolean;
  onPress: () => void;
}) {
  const [pressed, setPressed] = useState(false);
  const glyphColor = active ? MIST.accent : MIST.text;
  return (
    <View
      style={{
        width: '33.33%',
        aspectRatio: 1,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderRightColor: MIST.hairline,
        borderBottomColor: MIST.hairline,
        overflow: 'hidden',
      }}
    >
      <Pressable
        android_disableSound
        disabled={!audioAvailable}
        onPress={onPress}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: pressed ? 0.7 : 1,
        }}
      >
        {active && (
          <View
            style={{
              position: 'absolute',
              top: 5,
              left: 5,
              right: 5,
              bottom: 5,
              borderWidth: 1,
              borderColor: MIST.accent,
            }}
          />
        )}
        <VibeGlyph id={id} size={28} color={glyphColor} />
        <View style={{ alignItems: 'center', width: '100%', paddingHorizontal: 4, marginTop: 6 }}>
          <Text
            style={{
              fontFamily: FONT.mono,
              fontSize: 8,
              color: active ? MIST.accent : MIST.textGhost,
              letterSpacing: 1.2,
              marginBottom: 2,
            }}
          >
            {String(index).padStart(3, '0')}
          </Text>
          <Text
            numberOfLines={1}
            style={{
              fontFamily: FONT.sans,
              fontSize: 10,
              fontWeight: active ? '500' : '400',
              color: active ? MIST.text : MIST.textMute,
              letterSpacing: 0.4,
              textAlign: 'center',
              width: '100%',
            }}
          >
            {VIBE_LABELS[id].toUpperCase()}
          </Text>
        </View>
        {playing && (
          <View
            style={{
              position: 'absolute',
              top: 8,
              right: 8,
              width: 5,
              height: 5,
              borderRadius: 99,
              backgroundColor: MIST.accent,
            }}
          />
        )}
      </Pressable>
    </View>
  );
}

function AHeader({
  left,
  right,
}: {
  left: React.ReactNode;
  right: React.ReactNode;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingVertical: 12,
        minHeight: 44,
        borderBottomWidth: 1,
        borderBottomColor: MIST.hairline,
      }}
    >
      {left}
      {right}
    </View>
  );
}

function AScreenLabel({
  section,
  index,
  total,
}: {
  section: string;
  index?: number;
  total?: number;
}) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 14 }}>
      <Text
        style={{
          fontFamily: FONT.mono,
          fontSize: 10,
          fontWeight: '500',
          letterSpacing: 2.2,
          textTransform: 'uppercase',
          color: MIST.text,
        }}
      >
        {section}
      </Text>
      {index !== undefined && total !== undefined && (
        <Text
          style={{
            fontFamily: FONT.mono,
            fontSize: 9,
            color: MIST.textFaint,
            letterSpacing: 1.8,
          }}
        >
          {String(index).padStart(3, '0')} · {String(total).padStart(3, '0')}
        </Text>
      )}
    </View>
  );
}

function NavLink({
  label,
  active,
  disabled,
  onPress,
}: {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      android_disableSound
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
    >
      <Text
        style={{
          fontFamily: FONT.mono,
          fontSize: 10,
          fontWeight: '500',
          letterSpacing: 2.2,
          textTransform: 'uppercase',
          color: active ? MIST.text : MIST.textFaint,
        }}
      >
        {label}
      </Text>
      {active && (
        <View style={{ height: 1, backgroundColor: MIST.text, marginTop: 2 }} />
      )}
    </Pressable>
  );
}

function SettingsModal({
  visible,
  onClose,
  onLicenses,
  onDebugAudio,
}: {
  visible: boolean;
  onClose: () => void;
  onLicenses: () => void;
  onDebugAudio: () => void;
}) {
  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="fade"
      onRequestClose={onClose}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: MIST.bg }}>
        <StatusBar barStyle="light-content" backgroundColor={MIST.bg} />

        <View
          style={{
            padding: 24,
            paddingBottom: 24,
            borderBottomWidth: 1,
            borderBottomColor: MIST.hairline,
          }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
            <Text style={{ fontFamily: FONT.mono, fontSize: 9, fontWeight: '500', letterSpacing: 2.2, color: MIST.textMute, textTransform: 'uppercase' }}>
              MENU
            </Text>
            <Pressable
              android_disableSound
              onPress={onClose}
              style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
            >
              <Text style={{ fontFamily: FONT.mono, fontSize: 10, fontWeight: '500', letterSpacing: 2.2, color: MIST.textFaint, textTransform: 'uppercase' }}>
                ← CLOSE
              </Text>
            </Pressable>
          </View>
          <Text style={{ fontFamily: FONT.sans, fontSize: 40, fontWeight: '300', color: MIST.text, letterSpacing: -1.2, lineHeight: 40 }}>
            Vibe<Text style={{ color: MIST.accent }}>→</Text>MIDI
          </Text>
        </View>

        <ScrollView style={{ flex: 1 }}>
          {[
            ...(__DEV__ ? [{ label: 'Audio Debug', onPress: () => { onClose(); onDebugAudio(); } }] : []),
            { label: 'Licenses',       onPress: () => { onClose(); onLicenses(); } },
            { label: 'Privacy Policy', onPress: () => { void Linking.openURL('https://asamiile.github.io/Vibe-to-MIDI/privacy-policy.html'); } },
          ].map((item) => (
            <Pressable
              key={item.label}
              android_disableSound
              onPress={item.onPress}
              style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
            >
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingVertical: 20,
                paddingHorizontal: 24,
                borderBottomWidth: 1,
                borderBottomColor: MIST.hairline,
              }}>
                <Text style={{ fontFamily: FONT.sans, fontSize: 15, color: MIST.text, fontWeight: '400' }}>
                  {item.label}
                </Text>
                <Text style={{ fontFamily: FONT.mono, fontSize: 10, color: MIST.textFaint, letterSpacing: 1 }}>
                  →
                </Text>
              </View>
            </Pressable>
          ))}
          <View style={{ paddingVertical: 20, paddingHorizontal: 24 }}>
            <Text style={{ fontFamily: FONT.mono, fontSize: 10, color: MIST.textGhost, letterSpacing: 1.5 }}>
              VERSION {Constants.expoConfig?.version ?? '—'}
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ settings?: string }>();
  const { activeVibeId, suggestion, isPlaying, selectVibe, play, stop } = useAppStore();
  const audioAvailable = isAudioAvailable();
  const [viewMode, setViewMode] = useState<ViewMode>('listen');
  const [settingsVisible, setSettingsVisible] = useState(false);

  const activeIndex = activeVibeId ? VIBE_IDS.indexOf(activeVibeId) + 1 : 0;

  useEffect(() => {
    if (params.settings === '1') {
      setSettingsVisible(true);
    }
  }, [params.settings]);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (settingsVisible) {
        setSettingsVisible(false);
        return true;
      }
      if (viewMode !== 'listen') {
        setViewMode('listen');
        return true;
      }
      return false;
    });
    return () => sub.remove();
  }, [settingsVisible, viewMode]);

  function handleVibePress(id: VibeId) {
    if (!audioAvailable) return;
    if (activeVibeId === id) {
      isPlaying ? stop() : play();
    } else {
      selectVibe(id);
      play();
    }
  }

  function openMode(mode: ViewMode) {
    if (!activeVibeId) return;
    setViewMode(mode);
  }

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1, backgroundColor: MIST.bg }}>
      <StatusBar barStyle="light-content" backgroundColor={MIST.bg} />

      <View style={{ flex: 1 }}>
        {viewMode === 'listen' ? (
          <View style={{ flex: 1 }}>
            <AHeader
              left={
                <AScreenLabel
                  section="MOOD"
                  index={activeIndex}
                  total={VIBE_IDS.length}
                />
              }
              right={
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                  <NavLink
                    label="MIDI"
                    disabled={!activeVibeId}
                    onPress={() => openMode('details')}
                  />
                  <NavLink
                    label="LEARN"
                    disabled={!activeVibeId}
                    onPress={() => openMode('learn')}
                  />
                  <NavLink
                    label="≡"
                    onPress={() => setSettingsVisible(true)}
                  />
                </View>
              }
            />

            {!audioAvailable && (
              <Text
                style={{
                  fontFamily: FONT.mono,
                  fontSize: 9,
                  color: MIST.textFaint,
                  letterSpacing: 1,
                  paddingHorizontal: 24,
                  paddingTop: 8,
                }}
              >
                AUDIO REQUIRES DEV BUILD
              </Text>
            )}

            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={{ paddingBottom: 16 }}
              showsVerticalScrollIndicator={false}
            >
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  borderLeftWidth: 1,
                  borderLeftColor: MIST.hairline,
                }}
              >
                {VIBE_IDS.map((id, i) => (
                  <VibeCell
                    key={id}
                    id={id}
                    index={i + 1}
                    active={id === activeVibeId}
                    playing={id === activeVibeId && isPlaying}
                    audioAvailable={audioAvailable}
                    onPress={() => handleVibePress(id)}
                  />
                ))}
                {Array.from({ length: (3 - (VIBE_IDS.length % 3)) % 3 }).map((_, i) => (
                  <View
                    key={`pad-${i}`}
                    style={{
                      width: '33.33%',
                      aspectRatio: 1,
                      borderRightWidth: 1,
                      borderBottomWidth: 1,
                      borderRightColor: MIST.hairline,
                      borderBottomColor: MIST.hairline,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text style={{ fontFamily: FONT.mono, fontSize: 14, color: MIST.textGhost }}>—</Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        ) : suggestion ? (
          <View style={{ flex: 1 }}>
            <AHeader
              left={
                <AScreenLabel
                  section={viewMode === 'details' ? 'MIDI' : 'LEARN'}
                  index={activeIndex}
                  total={VIBE_IDS.length}
                />
              }
              right={
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                  <NavLink
                    label="MIDI"
                    active={viewMode === 'details'}
                    onPress={() => openMode('details')}
                  />
                  <NavLink
                    label="LEARN"
                    active={viewMode === 'learn'}
                    onPress={() => openMode('learn')}
                  />
                  <NavLink label="≡" onPress={() => setSettingsVisible(true)} />
                </View>
              }
            />

            {/* Compact vibe row */}
            {activeVibeId && (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 14,
                  paddingHorizontal: 24,
                  paddingVertical: 14,
                  borderBottomWidth: 1,
                  borderBottomColor: MIST.hairline,
                }}
              >
                <VibeGlyph id={activeVibeId} size={32} color={MIST.accent} />
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'baseline', gap: 12, minWidth: 0 }}>
                  <Text
                    style={{
                      fontFamily: FONT.sans,
                      fontSize: 20,
                      fontWeight: '300',
                      color: MIST.text,
                      letterSpacing: -0.4,
                      lineHeight: 20,
                    }}
                    numberOfLines={1}
                  >
                    {VIBE_LABELS[activeVibeId]}
                  </Text>
                  <Text
                    style={{
                      fontFamily: FONT.mono,
                      fontSize: 10,
                      color: MIST.textFaint,
                      letterSpacing: 1.8,
                      flexShrink: 1,
                    }}
                    numberOfLines={1}
                  >
                    {suggestion.scale.root} {suggestion.scale.mode.toUpperCase().replace('_', ' ')} · {suggestion.bpmRange[0]}–{suggestion.bpmRange[1]} BPM
                  </Text>
                </View>
              </View>
            )}

            <SuggestionPanel
              suggestion={suggestion}
              mode={viewMode === 'learn' ? 'explore' : 'use'}
            />
          </View>
        ) : (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text
              style={{
                fontFamily: FONT.mono,
                fontSize: 10,
                color: MIST.textFaint,
                letterSpacing: 1,
              }}
            >
              SELECT A VIBE
            </Text>
          </View>
        )}
      </View>

      <SettingsModal
        visible={settingsVisible}
        onClose={() => setSettingsVisible(false)}
        onLicenses={() => router.push(withSettingsReturn('/licenses'))}
        onDebugAudio={() => router.push(withSettingsReturn('/debug-audio'))}
      />
    </SafeAreaView>
  );
}
