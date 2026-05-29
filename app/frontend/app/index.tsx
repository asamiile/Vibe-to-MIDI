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
import { MaterialIcons } from '@expo/vector-icons';
import { useAppStore } from '../src/data/store';
import { isAudioAvailable } from '../src/features/audio-engine/adapter';
import { PlaybackVisual } from '../src/components/ui/PlaybackVisual';
import { SuggestionPanel } from '../src/components/ui/SuggestionPanel';
import { getAppRuntimeMetadata } from '../src/lib/app-metadata';
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
      style={({ pressed }) => ({
        opacity: disabled ? 0.3 : pressed ? 0.5 : 1,
        paddingVertical: 12,
      })}
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

function IconButton({
  name,
  onPress,
  size = 20,
  color,
}: {
  name: React.ComponentProps<typeof MaterialIcons>['name'];
  onPress: () => void;
  size?: number;
  color?: string;
}) {
  return (
    <Pressable
      android_disableSound
      onPress={onPress}
      style={({ pressed }) => ({
        opacity: pressed ? 0.5 : 1,
        paddingVertical: 12,
        paddingHorizontal: 4,
        justifyContent: 'center',
        alignItems: 'center',
      })}
    >
      <MaterialIcons name={name} size={size} color={color ?? MIST.textFaint} />
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
  const metadata = getAppRuntimeMetadata();
  const metadataRows = [
    ['VERSION', metadata.version],
    ['BUILD', metadata.nativeBuild],
    ['PACKAGE', metadata.packageName],
    ['EAS PROJECT', metadata.easProjectId],
    ['RUNTIME', metadata.executionEnvironment],
  ] as const;

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
              style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, padding: 4 })}
            >
              <MaterialIcons name="close" size={20} color={MIST.textFaint} />
            </Pressable>
          </View>
          <Text style={{ fontFamily: FONT.sans, fontSize: 40, fontWeight: '300', color: MIST.text, letterSpacing: -1.2, lineHeight: 40 }}>
            Vibe<Text style={{ color: MIST.accent }}>→</Text>MIDI
          </Text>
        </View>

        <ScrollView style={{ flex: 1 }}>
          {[
            { label: 'Pro',            accent: true,  onPress: () => { onClose(); onPro(); } },
            ...(__DEV__ ? [{ label: 'Audio Debug', accent: false, onPress: () => { onClose(); onDebugAudio(); } }] : []),
            { label: 'Licenses',       accent: false, onPress: () => { onClose(); onLicenses(); } },
            { label: 'Privacy Policy', accent: false, onPress: () => { void openAllowedExternalUrl(PRIVACY_POLICY_URL); } },
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
                paddingHorizontal: item.accent ? 21 : 24,
                borderBottomWidth: 1,
                borderBottomColor: MIST.hairline,
                borderLeftWidth: item.accent ? 3 : 0,
                borderLeftColor: item.accent ? MIST.accent : 'transparent',
              }}>
                <Text style={{ fontFamily: FONT.sans, fontSize: 15, color: item.accent ? MIST.accent : MIST.text, fontWeight: '400' }}>
                  {item.label}
                </Text>
                <MaterialIcons name="chevron-right" size={16} color={item.accent ? MIST.accent : MIST.textFaint} />
              </View>
            </Pressable>
          ))}
          <View style={{ paddingVertical: 20, paddingHorizontal: 24, gap: 7 }}>
            {metadataRows.map(([label, value]) => (
              <Text
                key={label}
                selectable
                style={{ fontFamily: FONT.mono, fontSize: 10, color: MIST.textGhost, letterSpacing: 1.3 }}
              >
                {label} {value}
              </Text>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

function SavedIdeasModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const savedIdeas = useAppStore((state) => state.savedIdeas);
  const loadIdea = useAppStore((state) => state.loadIdea);
  const deleteIdea = useAppStore((state) => state.deleteIdea);

  function formatDate(ts: number): string {
    const d = new Date(ts);
    return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  }

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="fade"
      onRequestClose={onClose}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: MIST.bg }}>
        <StatusBar barStyle="light-content" backgroundColor={MIST.bg} />

        <View style={{ padding: 24, paddingBottom: 24, borderBottomWidth: 1, borderBottomColor: MIST.hairline }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
            <Text style={{ fontFamily: FONT.mono, fontSize: 9, fontWeight: '500', letterSpacing: 2.2, color: MIST.textMute, textTransform: 'uppercase' }}>
              SAVED
            </Text>
            <Pressable
              android_disableSound
              onPress={onClose}
              style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, padding: 4 })}
            >
              <MaterialIcons name="close" size={20} color={MIST.textFaint} />
            </Pressable>
          </View>
          <Text style={{ fontFamily: FONT.sans, fontSize: 40, fontWeight: '300', color: MIST.text, letterSpacing: -1.2, lineHeight: 40 }}>
            Saved Ideas
          </Text>
        </View>

        <ScrollView style={{ flex: 1 }}>
          {savedIdeas.length === 0 ? (
            <View style={{ paddingVertical: 48, alignItems: 'center' }}>
              <Text style={{ fontFamily: FONT.mono, fontSize: 10, color: MIST.textGhost, letterSpacing: 1.3 }}>
                NO SAVED IDEAS
              </Text>
            </View>
          ) : (
            savedIdeas.map((idea) => (
              <View
                key={idea.id}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderBottomWidth: 1,
                  borderBottomColor: MIST.hairline,
                }}
              >
                <Pressable
                  android_disableSound
                  onPress={() => { loadIdea(idea.id); onClose(); }}
                  style={({ pressed }) => ({ flex: 1, opacity: pressed ? 0.6 : 1, paddingVertical: 20, paddingHorizontal: 24 })}
                >
                  <Text style={{ fontFamily: FONT.sans, fontSize: 15, color: MIST.text, fontWeight: '400' }}>
                    {idea.chord.label} · {idea.activeBpm} BPM
                  </Text>
                  <Text style={{ fontFamily: FONT.mono, fontSize: 10, color: MIST.textFaint, letterSpacing: 1, marginTop: 4 }}>
                    {idea.soundCombination.label.toUpperCase()} · {formatDate(idea.savedAt)}
                  </Text>
                </Pressable>
                <Pressable
                  android_disableSound
                  onPress={() => { void deleteIdea(idea.id); }}
                  style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, paddingVertical: 20, paddingHorizontal: 20 })}
                >
                  <MaterialIcons name="delete-outline" size={18} color={MIST.textFaint} />
                </Pressable>
              </View>
            ))
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ settings?: string }>();
  const suggestion = useAppStore((state) => state.suggestion);
  const isPlaying = useAppStore((state) => state.isPlaying);
  const activeArtworkId = useAppStore((state) => state.activeArtworkId);
  const playRandomSoundCombination = useAppStore((state) => state.playRandomSoundCombination);
  const initSavedIdeas = useAppStore((state) => state.initSavedIdeas);
  const audioAvailable = isAudioAvailable();
  const [viewMode, setViewMode] = useState<ViewMode>('listen');
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [savedIdeasVisible, setSavedIdeasVisible] = useState(false);

  useEffect(() => {
    void initSavedIdeas();
  }, [initSavedIdeas]);

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
      if (savedIdeasVisible) {
        setSavedIdeasVisible(false);
        return true;
      }
      if (viewMode !== 'listen') {
        setViewMode('listen');
        return true;
      }
      return false;
    });
    return () => sub.remove();
  }, [settingsVisible, savedIdeasVisible, viewMode]);

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
              right={
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <IconButton name="bookmark" onPress={() => setSavedIdeasVisible(true)} />
                  <IconButton name="settings" onPress={() => setSettingsVisible(true)} />
                </View>
              }
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
                <MaterialIcons
                  name="play-arrow"
                  size={28}
                  color={!audioAvailable ? MIST.textGhost : isPlaying ? MIST.accent : MIST.text}
                  style={{ marginLeft: 4 }}
                />
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
              right={
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <IconButton name="bookmark" onPress={() => setSavedIdeasVisible(true)} />
                  <IconButton name="settings" onPress={() => setSettingsVisible(true)} />
                </View>
              }
            />

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

      <SavedIdeasModal
        visible={savedIdeasVisible}
        onClose={() => setSavedIdeasVisible(false)}
      />

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
