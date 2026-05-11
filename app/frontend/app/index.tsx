import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  StatusBar,
  Modal,
  useWindowDimensions,
  BackHandler,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '../src/data/store';
import { getAllVibeIds } from '../src/features/vibe-map/engine';
import { isAudioAvailable } from '../src/features/audio-engine/adapter';
import { SuggestionPanel } from '../src/components/ui/SuggestionPanel';
import type { VibeId } from '../src/features/vibe-map/types';

const VIBE_IDS = getAllVibeIds();

const VIBE_LABELS: Record<VibeId, string> = {
  dark: 'Dark',
  floating: 'Floating',
  tense: 'Tense',
  repetitive: 'Repetitive',
  underground: 'Underground',
  wide: 'Wide',
  hypnotic: 'Hypnotic',
  metallic: 'Metallic',
  warm: 'Warm',
  unstable: 'Unstable',
};

type ViewMode = 'listen' | 'details' | 'learn';

function VibeButton({
  label,
  active,
  playing,
  audioAvailable,
  size,
  onPress,
}: {
  label: string;
  active: boolean;
  playing: boolean;
  audioAvailable: boolean;
  size: number;
  onPress: () => void;
}) {
  return (
    <View className="m-1" style={{ width: size, height: size }}>
      <Pressable
        className="h-full w-full items-center justify-center rounded-md border p-2"
        android_disableSound
        disabled={!audioAvailable}
        onPress={onPress}
        hitSlop={4}
        style={({ pressed }) => ({
          backgroundColor: active ? (playing ? '#14532d' : '#0f172a') : '#0b111c',
          borderWidth: active ? 2 : 1,
          borderColor: active ? '#38bdf8' : '#334155',
          opacity: pressed ? 0.75 : 1,
        })}
      >
        <Text
          numberOfLines={2}
          adjustsFontSizeToFit
          minimumFontScale={0.72}
          className="text-center text-sm font-black"
          style={{ color: active ? '#e2e8f0' : '#64748b' }}
        >
          {label}
        </Text>
      </Pressable>
    </View>
  );
}

function HeaderAction({
  label,
  disabled,
  active,
  onPress,
}: {
  label: string;
  disabled: boolean;
  active?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      className="min-h-9 items-center justify-center rounded-md border px-3"
      android_disableSound
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => ({
        backgroundColor: disabled ? '#111827' : active ? '#164e63' : '#0f172a',
        borderColor: disabled ? '#1e293b' : active ? '#22d3ee' : '#334155',
        opacity: pressed ? 0.75 : 1,
      })}
    >
      <Text className="text-xs font-black" style={{ color: disabled ? '#334155' : active ? '#ecfeff' : '#cbd5e1' }}>
        {label}
      </Text>
    </Pressable>
  );
}

function CogButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      className="min-h-9 w-9 items-center justify-center rounded-md border"
      android_disableSound
      onPress={onPress}
      style={({ pressed }) => ({
        backgroundColor: '#0f172a',
        borderColor: '#334155',
        opacity: pressed ? 0.75 : 1,
      })}
    >
      <Text style={{ color: '#64748b', fontSize: 16 }}>⚙</Text>
    </Pressable>
  );
}

function PlayButton({
  isPlaying,
  audioAvailable,
  disabled,
  onPress,
}: {
  isPlaying: boolean;
  audioAvailable: boolean;
  disabled?: boolean;
  onPress: () => void;
}) {
  const off = !audioAvailable || disabled;
  return (
    <Pressable
      className="min-h-9 w-9 items-center justify-center rounded-full border-2"
      android_disableSound
      disabled={off}
      onPress={onPress}
      style={({ pressed }) => ({
        borderColor: off ? '#1e293b' : isPlaying ? '#ef4444' : '#22c55e',
        opacity: pressed ? 0.6 : 1,
      })}
    >
      <Text style={{
        color: off ? '#334155' : isPlaying ? '#ef4444' : '#22c55e',
        fontSize: 16,
        lineHeight: 20,
      }}>
        {isPlaying ? '■' : '▶'}
      </Text>
    </Pressable>
  );
}

function SettingsModal({
  visible,
  onClose,
  onLicenses,
}: {
  visible: boolean;
  onClose: () => void;
  onLicenses: () => void;
}) {
  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="fade"
      onRequestClose={onClose}
    >
      <SafeAreaView className="flex-1 bg-[#060a10]">
        <StatusBar barStyle="light-content" backgroundColor="#060a10" />
        <View className="flex-row items-center justify-between px-5 pb-3.5 pt-3">
          <Text className="text-[28px] font-black text-slate-200">Menu</Text>
          <Pressable
            className="min-h-9 w-9 items-center justify-center rounded-md border"
            android_disableSound
            onPress={onClose}
            style={({ pressed }) => ({
              backgroundColor: '#0f172a',
              borderColor: '#334155',
              opacity: pressed ? 0.75 : 1,
            })}
          >
            <Text style={{ color: '#64748b', fontSize: 16 }}>✕</Text>
          </Pressable>
        </View>
        <View className="flex-1 px-5 pt-2">
          <Pressable
            className="border-b border-slate-800 py-4"
            android_disableSound
            onPress={() => { onClose(); onLicenses(); }}
            style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
          >
            <Text className="text-base font-semibold text-slate-300">Licenses</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const { activeVibeId, suggestion, isPlaying, selectVibe, play, stop } = useAppStore();
  const audioAvailable = isAudioAvailable();
  const [viewMode, setViewMode] = useState<ViewMode>('listen');
  const [settingsVisible, setSettingsVisible] = useState(false);
  const vibeButtonSize = Math.floor((width - 40 - 24) / 3);

  useEffect(() => {
    if (viewMode === 'listen') return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      setViewMode('listen');
      return true;
    });
    return () => sub.remove();
  }, [viewMode]);

  function handleVibePress(id: VibeId) {
    if (!audioAvailable) return;
    if (activeVibeId === id) {
      isPlaying ? stop() : play();
    } else {
      selectVibe(id);
      play();
    }
  }

  function openMode(id: VibeId, mode: ViewMode) {
    if (activeVibeId !== id) {
      selectVibe(id);
    }
    setViewMode(mode);
  }

  function openActiveMode(mode: ViewMode) {
    if (!activeVibeId) return;
    openMode(activeVibeId, mode);
  }

  return (
    <SafeAreaView className="flex-1 bg-[#060a10]">
      <StatusBar barStyle="light-content" backgroundColor="#060a10" />

      <View className="flex-1">
        <View className="flex-1">
          {viewMode === 'listen' ? (
            <View className="flex-1 pt-3">
              <View className="flex-row items-center justify-between gap-3 px-5 pb-3.5">
                <Text className="flex-1 text-[28px] font-black text-slate-200">
                  Mood?
                </Text>
                <View className="flex-row gap-2">
                  <HeaderAction
                    label="MIDI"
                    disabled={!activeVibeId}
                    onPress={() => openActiveMode('details')}
                  />
                  <HeaderAction
                    label="Learn"
                    disabled={!activeVibeId}
                    onPress={() => openActiveMode('learn')}
                  />
                  <CogButton onPress={() => setSettingsVisible(true)} />
                </View>
              </View>
              {!audioAvailable && (
                <Text className="mb-2.5 px-5 text-[10px] text-slate-600">
                  Audio requires Dev Build
                </Text>
              )}
              <View className="flex-row flex-wrap px-4">
                {VIBE_IDS.map((item) => {
                  const active = item === activeVibeId;
                  return (
                    <VibeButton
                      key={item}
                      label={VIBE_LABELS[item]}
                      active={active}
                      playing={active && isPlaying}
                      audioAvailable={audioAvailable}
                      size={vibeButtonSize}
                      onPress={() => handleVibePress(item)}
                    />
                  );
                })}
              </View>
            </View>
          ) : suggestion ? (
            <>
              <View className="flex-row items-center justify-between gap-3 px-5 pb-3.5 pt-3">
                <View className="flex-1 flex-row items-center gap-3">
                  <Text className="text-[28px] font-black text-slate-200">
                    {viewMode === 'details' ? 'MIDI?' : 'Learn?'}
                  </Text>
                  <PlayButton
                    isPlaying={isPlaying}
                    audioAvailable={audioAvailable}
                    onPress={() => isPlaying ? stop() : play()}
                  />
                </View>
                <View className="flex-row gap-2">
                  <HeaderAction
                    label="MIDI"
                    disabled={false}
                    active={viewMode === 'details'}
                    onPress={() => openActiveMode('details')}
                  />
                  <HeaderAction
                    label="Learn"
                    disabled={false}
                    active={viewMode === 'learn'}
                    onPress={() => openActiveMode('learn')}
                  />
                  <CogButton onPress={() => setSettingsVisible(true)} />
                </View>
              </View>

              <View className="flex-1">
                <SuggestionPanel
                  suggestion={suggestion}
                  mode={viewMode === 'learn' ? 'explore' : 'use'}
                />
              </View>
            </>
          ) : (
            <View className="flex-1 items-center justify-center">
              <Text className="text-[13px] text-slate-700">
                Select a vibe to see suggestions
              </Text>
            </View>
          )}
        </View>
      </View>

      <SettingsModal
        visible={settingsVisible}
        onClose={() => setSettingsVisible(false)}
        onLicenses={() => router.push('/licenses')}
      />
    </SafeAreaView>
  );
}
