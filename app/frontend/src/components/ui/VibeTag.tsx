import React from 'react';
import { Pressable, Text } from 'react-native';
import type { VibeId } from '../../features/vibe-map/types';

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
        paddingVertical: 10,
        paddingHorizontal: 16,
        margin: 4,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: active ? '#e2e8f0' : '#334155',
        backgroundColor: pressed
          ? '#1e293b'
          : active
          ? '#1e3a5f'
          : '#0f172a',
        opacity: pressed ? 0.8 : 1,
      })}
    >
      <Text
        style={{
          color: active ? '#e2e8f0' : '#64748b',
          fontSize: 13,
          fontWeight: active ? '600' : '400',
          letterSpacing: 0.5,
          textTransform: 'uppercase',
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
