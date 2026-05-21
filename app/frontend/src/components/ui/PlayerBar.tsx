import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '../../data/store';
import { isAudioAvailable } from '../../features/audio-engine/adapter';
import { WaveformVisualizer } from './WaveformVisualizer';
import { ALL_AUDIO_LAYERS } from '../../features/audio-engine/constants';
import type { AudioLayer } from '../../features/audio-engine/constants';
import { isProFeatureEnabled } from '../../features/entitlements/pro-features';
import { MIST, FONT } from '../../styles/theme';

const LAYER_LABELS: Record<AudioLayer, string> = {
  kick: 'KICK',
  bass: 'BASS',
  noise: 'NOISE',
  melody: 'STAB',
};

export function PlayerBar() {
  const router = useRouter();
  const { bottom } = useSafeAreaInsets();
  const {
    activeSoundCombination,
    activeChord,
    suggestion,
    isPlaying,
    play,
    stop,
    activeLayers,
    toggleLayer,
    hasProAccess,
  } = useAppStore();
  const audioAvailable = isAudioAvailable();
  const artEnabled = isProFeatureEnabled('generative_art_playback', hasProAccess);

  const idle = !suggestion;
  const activeLabel = [
    activeSoundCombination?.label,
    activeChord?.label,
  ].filter(Boolean).join(' · ');
  const visibleLayers = ALL_AUDIO_LAYERS.filter((layer) => {
    if (layer === 'melody') return suggestion?.melodySuggested === true;
    return true;
  });

  return (
    <View
      style={{
        borderTopWidth: 1,
        borderTopColor: MIST.hairline,
        backgroundColor: MIST.bg,
        paddingBottom: bottom,
      }}
    >
      {suggestion && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
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
                    color: active ? MIST.accent : MIST.textFaint,
                  }}
                >
                  {LAYER_LABELS[layer]}
                </Text>
              </Pressable>
            );
          })}
          <View style={{ flex: 1 }} />
          <Pressable
            android_disableSound
            onPress={() => {
              if (!artEnabled) router.push('/pro');
            }}
            style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, paddingVertical: 4 })}
          >
            <Text
              style={{
                fontFamily: FONT.mono,
                fontSize: 9,
                fontWeight: '500',
                letterSpacing: 2.2,
                color: artEnabled && isPlaying ? MIST.accent : MIST.textGhost,
              }}
            >
              ART {artEnabled ? 'READY' : 'PRO'}
            </Text>
          </Pressable>
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
              color: idle ? MIST.textGhost : isPlaying ? MIST.accent : MIST.text,
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
            color: activeLabel ? MIST.text : MIST.textGhost,
            textTransform: 'uppercase',
          }}
          numberOfLines={1}
        >
          {activeLabel || '— tap play —'}
        </Text>
      </View>
    </View>
  );
}
