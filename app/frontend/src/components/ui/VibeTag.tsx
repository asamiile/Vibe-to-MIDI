import React from 'react';
import { Pressable, Text } from 'react-native';
import type { VibeId } from '../../features/vibe-map/types';
import { MIST, FONT } from '../../styles/theme';

interface Props {
  id: VibeId;
  label: string;
  active: boolean;
  onPress: (id: VibeId) => void;
}

export function VibeTag({ id, label, active, onPress }: Props) {
  return (
    <Pressable
      android_disableSound
      onPress={() => onPress(id)}
      style={({ pressed }) => ({
        margin: 4,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderWidth: 1,
        borderRadius: 0,
        borderColor: active ? MIST.accent : MIST.hairline,
        backgroundColor: active ? MIST.accentDim : pressed ? MIST.hairline : 'transparent',
        opacity: pressed ? 0.75 : 1,
      })}
    >
      <Text
        style={{
          fontFamily: FONT.mono,
          fontSize: 11,
          color: active ? MIST.accent : MIST.textFaint,
          fontWeight: '500',
          letterSpacing: 1.8,
          textTransform: 'uppercase',
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
