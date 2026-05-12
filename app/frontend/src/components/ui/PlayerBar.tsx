import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '../../data/store';
import { isAudioAvailable } from '../../features/audio-engine/adapter';
import { VIBE_LABELS } from '../../features/vibe-map/labels';
import { WaveformVisualizer } from './WaveformVisualizer';

export function PlayerBar() {
  const { bottom } = useSafeAreaInsets();
  const { activeVibeId, isPlaying, play, stop } = useAppStore();
  const audioAvailable = isAudioAvailable();

  const label = activeVibeId ? VIBE_LABELS[activeVibeId] ?? activeVibeId : null;

  return (
    <View
      style={{
        borderTopWidth: 1,
        borderTopColor: '#1e293b',
        backgroundColor: '#060a10',
        paddingBottom: bottom,
      }}
    >
      <View
        style={{
          height: 56,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 20,
          gap: 12,
        }}
      >
        <WaveformVisualizer isPlaying={isPlaying} />

        <Text
          style={{
            flex: 1,
            color: label ? '#94a3b8' : '#334155',
            fontSize: 13,
            fontWeight: '600',
          }}
          numberOfLines={1}
        >
          {label ?? '---'}
        </Text>

        <Pressable
          android_disableSound
          disabled={!audioAvailable || !activeVibeId}
          onPress={() => (isPlaying ? stop() : play())}
          style={({ pressed }) => ({
            width: 36,
            height: 36,
            borderRadius: 18,
            borderWidth: 2,
            borderColor:
              !audioAvailable || !activeVibeId
                ? '#1e293b'
                : isPlaying
                ? '#ef4444'
                : '#22c55e',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: pressed ? 0.6 : 1,
          })}
        >
          <Text
            style={{
              color:
                !audioAvailable || !activeVibeId
                  ? '#334155'
                  : isPlaying
                  ? '#ef4444'
                  : '#22c55e',
              fontSize: 16,
              lineHeight: 20,
            }}
          >
            {isPlaying ? '■' : '▶'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
