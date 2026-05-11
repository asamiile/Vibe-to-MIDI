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
      className="m-1 rounded-md border px-4 py-2.5"
      android_disableSound
      onPress={() => onPress(id)}
      style={({ pressed }) => ({
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
        className="text-[13px] uppercase tracking-[0.5px]"
        style={{
          color: active ? '#e2e8f0' : '#64748b',
          fontWeight: active ? '600' : '400',
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
