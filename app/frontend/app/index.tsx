import React, { useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '../src/data/store';
import { getAllVibeIds } from '../src/features/vibe-map/engine';
import { playPreview } from '../src/features/audio-engine/player';
import { isAudioAvailable } from '../src/features/audio-engine/adapter';
import { VibeTag } from '../src/components/ui/VibeTag';
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

export default function HomeScreen() {
  const { activeVibeId, suggestion, isPlaying, selectVibe, setPlaying } =
    useAppStore();
  const playerRef = useRef<PlayerHandle | null>(null);

  function handleVibePress(id: VibeId) {
    playerRef.current?.stop();
    playerRef.current = null;
    setPlaying(false);
    selectVibe(id);
  }

  function handlePlayPress() {
    if (!suggestion) return;
    if (isPlaying) {
      playerRef.current?.stop();
      playerRef.current = null;
      setPlaying(false);
    } else {
      playerRef.current = playPreview(suggestion);
      setPlaying(true);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#060a10' }}>
      <StatusBar barStyle="light-content" backgroundColor="#060a10" />

      <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 }}>
        <Text style={{ color: '#64748b', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase' }}>
          Vibe-to-MIDI
        </Text>
      </View>

      <View style={{ paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#1e293b' }}>
        <FlatList
          data={VIBE_IDS}
          keyExtractor={(id) => id}
          horizontal
          renderItem={({ item }) => (
            <View style={{ width: 132 }}>
              <VibeTag
                id={item}
                label={VIBE_LABELS[item]}
                active={item === activeVibeId}
                onPress={handleVibePress}
              />
            </View>
          )}
          contentContainerStyle={{ paddingHorizontal: 12 }}
          showsHorizontalScrollIndicator={false}
        />
      </View>

      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          {suggestion ? (
            <>
              <SuggestionPanel suggestion={suggestion} />
              {/* Play / Stop button */}
              <Pressable
                android_disableSound
                onPress={handlePlayPress}
                style={({ pressed }) => ({
                  margin: 16,
                  paddingVertical: 12,
                  borderRadius: 6,
                  alignItems: 'center',
                  backgroundColor: isPlaying ? '#7f1d1d' : '#14532d',
                  opacity: pressed ? 0.7 : 1,
                })}
              >
                <Text style={{ color: '#e2e8f0', fontWeight: '600', fontSize: 13, letterSpacing: 1 }}>
                  {isPlaying ? '■  STOP' : '▶  PLAY'}
                </Text>
              </Pressable>
              {!isAudioAvailable() && (
                <Text style={{ color: '#475569', fontSize: 10, textAlign: 'center', marginBottom: 8 }}>
                  Audio requires Dev Build
                </Text>
              )}
            </>
          ) : (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: '#334155', fontSize: 13 }}>
                Select a vibe to see suggestions
              </Text>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
