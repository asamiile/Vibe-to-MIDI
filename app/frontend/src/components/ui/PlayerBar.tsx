import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '../../data/store';
import { isAudioAvailable } from '../../features/audio-engine/adapter';
import { VIBE_LABELS } from '../../features/vibe-map/labels';
import { WaveformVisualizer } from './WaveformVisualizer';
import { ALL_AUDIO_LAYERS } from '../../features/audio-engine/constants';
import type { AudioLayer } from '../../features/audio-engine/constants';

const LAYER_LABELS: Record<AudioLayer, string> = {
  kick: 'KICK',
  bass: 'BASS',
  noise: 'NOISE',
  melody: 'STAB',
};

export function PlayerBar() {
  const { bottom } = useSafeAreaInsets();
  const { activeVibeId, suggestion, isPlaying, play, stop, activeLayers, toggleLayer } = useAppStore();
  const audioAvailable = isAudioAvailable();

  const label = activeVibeId ? VIBE_LABELS[activeVibeId] ?? activeVibeId : null;
  const visibleLayers = ALL_AUDIO_LAYERS.filter((layer) => {
    if (layer === 'melody') return suggestion?.melodySuggested === true;
    return true;
  });

  return (
    <View
      style={{
        borderTopWidth: 1,
        borderTopColor: '#1e293b',
        backgroundColor: '#060a10',
        paddingBottom: bottom,
      }}
    >
      {activeVibeId && (
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 20,
            paddingTop: 10,
            gap: 8,
          }}
        >
          {visibleLayers.map((layer) => {
            const active = activeLayers.has(layer);
            return (
              <Pressable
                key={layer}
                android_disableSound
                onPress={() => toggleLayer(layer)}
                style={({ pressed }) => ({
                  paddingHorizontal: 12,
                  paddingVertical: 4,
                  borderRadius: 4,
                  borderWidth: 1,
                  borderColor: active ? '#38bdf8' : '#334155',
                  backgroundColor: active ? '#0c2a3e' : '#0b111c',
                  opacity: pressed ? 0.7 : 1,
                })}
              >
                <Text
                  style={{
                    color: active ? '#38bdf8' : '#475569',
                    fontSize: 10,
                    fontWeight: '800',
                    letterSpacing: 0.5,
                  }}
                >
                  {LAYER_LABELS[layer]}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}

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
