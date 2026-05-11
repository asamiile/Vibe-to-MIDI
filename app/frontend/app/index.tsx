import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StatusBar,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '../src/data/store';
import { getAllVibeIds, getMusicalSuggestion } from '../src/features/vibe-map/engine';
import { playPreview } from '../src/features/audio-engine/player';
import { isAudioAvailable } from '../src/features/audio-engine/adapter';
import { SuggestionPanel } from '../src/components/ui/SuggestionPanel';
import type { VibeId } from '../src/features/vibe-map/types';
import type { PlayerHandle } from '../src/features/audio-engine/player';

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
  onPlay,
}: {
  label: string;
  active: boolean;
  playing: boolean;
  audioAvailable: boolean;
  size: number;
  onPlay: () => void;
}) {
  return (
    <View className="m-1" style={{ width: size, height: size }}>
      <Pressable
        className="h-full w-full items-center justify-center rounded-md border p-2"
        android_disableSound
        disabled={!audioAvailable}
        onPress={onPlay}
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
  onPress,
}: {
  label: string;
  disabled: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      className="min-h-9 items-center justify-center rounded-md border px-3"
      android_disableSound
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => ({
        backgroundColor: disabled ? '#111827' : '#0f172a',
        borderColor: disabled ? '#1e293b' : '#334155',
        opacity: pressed ? 0.75 : 1,
      })}
    >
      <Text className="text-xs font-black" style={{ color: disabled ? '#334155' : '#cbd5e1' }}>
        {label}
      </Text>
    </Pressable>
  );
}

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const { activeVibeId, suggestion, isPlaying, selectVibe, setPlaying } =
    useAppStore();
  const playerRef = useRef<PlayerHandle | null>(null);
  const audioAvailable = isAudioAvailable();
  const [viewMode, setViewMode] = useState<ViewMode>('listen');
  const vibeButtonSize = Math.floor((width - 40 - 24) / 3);

  function stopPlayback() {
    playerRef.current?.stop();
    playerRef.current = null;
    setPlaying(false);
  }

  function handleVibePlay(id: VibeId) {
    if (!audioAvailable) return;
    if (activeVibeId === id && isPlaying) {
      stopPlayback();
      return;
    }

    stopPlayback();
    const nextSuggestion = getMusicalSuggestion(id);
    selectVibe(id);
    setViewMode('listen');
    playerRef.current = playPreview(nextSuggestion);
    setPlaying(true);
  }

  function openMode(id: VibeId, mode: ViewMode) {
    if (activeVibeId !== id) {
      stopPlayback();
    }
    selectVibe(id);
    setViewMode(mode);
  }

  function openActiveMode(mode: ViewMode) {
    if (!activeVibeId) return;
    openMode(activeVibeId, mode);
  }

  function handlePlayPress() {
    if (!suggestion) return;
    if (!audioAvailable) return;
    if (isPlaying) {
      stopPlayback();
    } else {
      playerRef.current = playPreview(suggestion);
      setPlaying(true);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-[#060a10]">
      <StatusBar barStyle="light-content" backgroundColor="#060a10" />

      <View className="px-5 pb-2 pt-4">
        <View className="flex-row items-center justify-between">
          <Text className="text-[11px] uppercase tracking-[2px] text-slate-500">
            Vibe-to-MIDI
          </Text>
          <Pressable
            className="py-1.5 pl-3"
            android_disableSound
            onPress={() => router.push('/licenses')}
            style={({ pressed }) => ({
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <Text className="text-[11px] font-bold uppercase text-slate-500">
              Licenses
            </Text>
          </Pressable>
        </View>
      </View>

      <View className="flex-1">
        <View className="flex-1">
          {viewMode === 'listen' ? (
            <View className="flex-1 pt-3">
              <View className="flex-row items-center justify-between gap-3 px-5 pb-3.5">
                <Text className="flex-1 text-[28px] font-black text-slate-200">
                  Listen
                </Text>
                <View className="flex-row gap-2">
                  <HeaderAction
                    label="Learn"
                    disabled={!activeVibeId}
                    onPress={() => openActiveMode('learn')}
                  />
                  <HeaderAction
                    label="MIDI"
                    disabled={!activeVibeId}
                    onPress={() => openActiveMode('details')}
                  />
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
                      onPlay={() => handleVibePlay(item)}
                    />
                  );
                })}
              </View>
            </View>
          ) : suggestion ? (
            <>
              <SuggestionPanel
                suggestion={suggestion}
                mode={viewMode === 'learn' ? 'explore' : 'use'}
                onBack={() => setViewMode('listen')}
              />
              <Pressable
                className="m-4 items-center rounded-md py-3"
                android_disableSound
                disabled={!audioAvailable}
                onPress={handlePlayPress}
                style={({ pressed }) => ({
                  backgroundColor: !audioAvailable ? '#1f2937' : isPlaying ? '#7f1d1d' : '#14532d',
                  opacity: pressed ? 0.7 : 1,
                })}
              >
                <Text className="text-[13px] font-semibold tracking-[1px] text-slate-200">
                  {!audioAvailable ? 'DEV BUILD REQUIRED' : isPlaying ? '■  STOP' : '▶  PLAY'}
                </Text>
              </Pressable>
              {!audioAvailable && (
                <Text className="mb-2 text-center text-[10px] text-slate-600">
                  Audio requires Dev Build
                </Text>
              )}
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
    </SafeAreaView>
  );
}
