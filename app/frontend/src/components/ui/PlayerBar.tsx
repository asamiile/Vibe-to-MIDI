import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '../../data/store';
import { isAudioAvailable } from '../../features/audio-engine/adapter';
import { VIBE_LABELS } from '../../features/vibe-map/labels';
import { WaveformVisualizer } from './WaveformVisualizer';
import { ALL_AUDIO_LAYERS } from '../../features/audio-engine/constants';
import type { AudioLayer } from '../../features/audio-engine/constants';
import { A, FONT } from '../../styles/theme';

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
  const idle = !activeVibeId;
  const visibleLayers = ALL_AUDIO_LAYERS.filter((layer) => {
    if (layer === 'melody') return suggestion?.melodySuggested === true;
    return true;
  });

  return (
    <View
      style={{
        borderTopWidth: 1,
        borderTopColor: A.hairline,
        backgroundColor: A.bg,
        paddingBottom: bottom,
      }}
    >
      {activeVibeId && (
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 24,
            paddingTop: 14,
            gap: 18,
          }}
        >
          {visibleLayers.map((layer) => {
            const active = activeLayers.has(layer);
            return (
              <Pressable
                key={layer}
                android_disableSound
                onPress={() => toggleLayer(layer)}
                style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, paddingVertical: 4 })}
              >
                <Text
                  style={{
                    fontFamily: FONT.mono,
                    fontSize: 9,
                    fontWeight: '500',
                    letterSpacing: 2.2,
                    color: active ? A.accent : A.textFaint,
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
          height: 64,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 24,
          gap: 16,
        }}
      >
        {/* play/stop — text button with glow when playing */}
        <Pressable
          android_disableSound
          disabled={!audioAvailable || idle}
          onPress={() => (isPlaying ? stop() : play())}
          style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
        >
          <Text
            style={{
              fontSize: 14,
              color: idle ? A.textGhost : isPlaying ? A.accent : A.text,
            }}
          >
            {isPlaying ? '■' : '▶'}
          </Text>
        </Pressable>

        <WaveformVisualizer isPlaying={isPlaying} />

        <Text
          style={{
            flex: 1,
            fontFamily: FONT.sans,
            fontSize: 12,
            fontWeight: '400',
            letterSpacing: 0.4,
            color: label ? A.text : A.textGhost,
            textTransform: 'uppercase',
          }}
          numberOfLines={1}
        >
          {label ?? '— select vibe —'}
        </Text>
      </View>
    </View>
  );
}
