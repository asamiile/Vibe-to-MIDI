import React from 'react';
import { View, Text, Pressable, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '../../data/store';
import { isAudioAvailable } from '../../features/audio-engine/adapter';
import { WaveformVisualizer } from './WaveformVisualizer';
import { ALL_AUDIO_LAYERS } from '../../features/audio-engine/constants';
import type { AudioLayer } from '../../features/audio-engine/constants';
import { isProFeatureEnabled } from '../../features/entitlements/pro-features';
import {
  getPlaybackArtwork,
  getSelectablePlaybackArtworks,
} from '../../features/playback-visuals/artworks';
import { MIST, FONT } from '../../styles/theme';

const LAYER_LABELS: Record<AudioLayer, string> = {
  kick: 'KICK',
  bass: 'BASS',
  noise: 'NOISE',
  melody: 'STAB',
};

export function PlayerBar() {
  const { bottom } = useSafeAreaInsets();
  const [artPickerVisible, setArtPickerVisible] = React.useState(false);
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
    activeArtworkId,
    setActiveArtworkId,
  } = useAppStore();
  const audioAvailable = isAudioAvailable();
  const artEnabled = isProFeatureEnabled('generative_art_playback', hasProAccess);
  const activeArtwork = getPlaybackArtwork(activeArtworkId);
  const selectableArtworks = getSelectablePlaybackArtworks(hasProAccess);

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
          {artEnabled && (
            <Pressable
              android_disableSound
              accessibilityRole="button"
              accessibilityLabel="アートワークを選択"
              onPress={() => setArtPickerVisible(true)}
              style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, paddingVertical: 4 })}
            >
              <Text
                style={{
                  fontFamily: FONT.mono,
                  fontSize: 9,
                  fontWeight: '500',
                  letterSpacing: 2.2,
                  color: isPlaying ? MIST.accent : MIST.textGhost,
                }}
              >
                ART: {activeArtwork.shortLabel}
              </Text>
            </Pressable>
          )}
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

      <Modal
        visible={artPickerVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setArtPickerVisible(false)}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="アートワーク選択を閉じる"
          onPress={() => setArtPickerVisible(false)}
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            backgroundColor: 'rgba(0,0,0,0.58)',
          }}
        >
          <Pressable
            onPress={(event) => event.stopPropagation()}
            style={{
              borderTopWidth: 1,
              borderTopColor: MIST.hairline,
              backgroundColor: MIST.bg,
              paddingHorizontal: 24,
              paddingTop: 18,
              paddingBottom: bottom + 18,
              gap: 14,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
              <Text
                style={{
                  fontFamily: FONT.mono,
                  fontSize: 10,
                  fontWeight: '500',
                  letterSpacing: 2.2,
                  color: MIST.textFaint,
                }}
              >
                ARTWORK
              </Text>
              <Pressable
                android_disableSound
                onPress={() => setArtPickerVisible(false)}
                style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, paddingVertical: 6 })}
              >
                <Text
                  style={{
                    fontFamily: FONT.mono,
                    fontSize: 10,
                    fontWeight: '500',
                    letterSpacing: 2.2,
                    color: MIST.textFaint,
                  }}
                >
                  CLOSE
                </Text>
              </Pressable>
            </View>

            {selectableArtworks.map((artwork) => {
              const selected = artwork.id === activeArtworkId;
              return (
                <Pressable
                  key={artwork.id}
                  android_disableSound
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  onPress={() => {
                    setActiveArtworkId(artwork.id);
                    setArtPickerVisible(false);
                  }}
                  style={({ pressed }) => ({
                    opacity: pressed ? 0.62 : 1,
                    borderWidth: 1,
                    borderColor: selected ? MIST.accent : MIST.hairline,
                    backgroundColor: selected ? MIST.accentDim : 'transparent',
                    paddingHorizontal: 16,
                    paddingVertical: 16,
                    borderRadius: 8,
                  })}
                >
                  <Text
                    style={{
                      fontFamily: FONT.sans,
                      fontSize: 15,
                      fontWeight: '400',
                      color: selected ? MIST.accent : MIST.text,
                    }}
                  >
                    {artwork.label}
                  </Text>
                </Pressable>
              );
            })}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
