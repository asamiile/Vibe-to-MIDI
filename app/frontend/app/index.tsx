import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  StatusBar,
  Modal,
  ScrollView,
  BackHandler,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Constants from 'expo-constants';
import { useAppStore } from '../src/data/store';
import { isAudioAvailable } from '../src/features/audio-engine/adapter';
import { PlaybackVisual } from '../src/components/ui/PlaybackVisual';
import { SuggestionPanel } from '../src/components/ui/SuggestionPanel';
import { openAllowedExternalUrl, PRIVACY_POLICY_URL } from '../src/lib/external-links';
import { withSettingsReturn } from '../src/lib/navigation';
import { MIST, FONT } from '../src/styles/theme';

type ViewMode = 'listen' | 'details' | 'learn';

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
  onPro,
  onLicenses,
  onDebugAudio,
}: {
  visible: boolean;
  onClose: () => void;
  onPro: () => void;
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
            { label: 'Pro',            onPress: () => { onClose(); onPro(); } },
            ...(__DEV__ ? [{ label: 'Audio Debug', onPress: () => { onClose(); onDebugAudio(); } }] : []),
            { label: 'Licenses',       onPress: () => { onClose(); onLicenses(); } },
            { label: 'Privacy Policy', onPress: () => { void openAllowedExternalUrl(PRIVACY_POLICY_URL); } },
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
  const activeSoundCombination = useAppStore((state) => state.activeSoundCombination);
  const activeChord = useAppStore((state) => state.activeChord);
  const suggestion = useAppStore((state) => state.suggestion);
  const isPlaying = useAppStore((state) => state.isPlaying);
  const activeArtworkId = useAppStore((state) => state.activeArtworkId);
  const playRandomSoundCombination = useAppStore((state) => state.playRandomSoundCombination);
  const audioAvailable = isAudioAvailable();
  const [viewMode, setViewMode] = useState<ViewMode>('listen');
  const [settingsVisible, setSettingsVisible] = useState(false);

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

  function handleRandomPress() {
    if (!audioAvailable) return;
    playRandomSoundCombination();
  }

  function openMode(mode: ViewMode) {
    if (!suggestion) return;
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
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                  <NavLink
                    label="PLAY"
                    active
                    onPress={() => setViewMode('listen')}
                  />
                  <NavLink
                    label="MIDI"
                    disabled={!suggestion}
                    onPress={() => openMode('details')}
                  />
                  <NavLink
                    label="LEARN"
                    disabled={!suggestion}
                    onPress={() => openMode('learn')}
                  />
                </View>
              }
              right={<NavLink label="≡" onPress={() => setSettingsVisible(true)} />}
            />

            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              <PlaybackVisual isPlaying={isPlaying} artworkId={activeArtworkId} />
              <Pressable
                android_disableSound
                accessibilityRole="button"
                accessibilityLabel="ランダムな音の組み合わせを再生"
                disabled={!audioAvailable}
                onPress={handleRandomPress}
                style={({ pressed }) => ({
                  width: 112,
                  height: 112,
                  borderRadius: 999,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 1,
                  borderColor: isPlaying ? MIST.accent : MIST.hairline,
                  backgroundColor: isPlaying ? 'rgba(10,10,10,0.36)' : 'rgba(10,10,10,0.62)',
                  opacity: !audioAvailable ? 0.35 : pressed ? 0.62 : 1,
                  zIndex: 1,
                })}
              >
                <Text
                  style={{
                    marginLeft: 4,
                    fontSize: 28,
                    color: isPlaying ? MIST.accent : MIST.text,
                  }}
                >
                  ▶
                </Text>
              </Pressable>
            </View>
          </View>
        ) : suggestion ? (
          <View style={{ flex: 1 }}>
            <AHeader
              left={
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                  <NavLink
                    label="PLAY"
                    onPress={() => setViewMode('listen')}
                  />
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
                </View>
              }
              right={<NavLink label="≡" onPress={() => setSettingsVisible(true)} />}
            />

            {(activeSoundCombination || activeChord) && (
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
                    {[activeSoundCombination?.label, activeChord?.label].filter(Boolean).join(' · ')}
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
        onPro={() => router.push(withSettingsReturn('/pro'))}
        onLicenses={() => router.push(withSettingsReturn('/licenses'))}
        onDebugAudio={() => router.push(withSettingsReturn('/debug-audio'))}
      />
    </SafeAreaView>
  );
}
