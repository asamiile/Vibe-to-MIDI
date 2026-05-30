import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { MIST, FONT } from '../../styles/theme';

interface AButtonProps {
  variant: 'default' | 'accent' | 'busy' | 'success';
  label: string;
  onPress: () => void;
  disabled?: boolean;
  busy?: boolean;
  flex?: boolean;
  align?: 'flex-start' | 'center' | 'flex-end';
}

export function AButton({
  variant, label, onPress,
  disabled = false, busy = false, flex = false, align = 'center'
}: AButtonProps) {
  const isAccent = variant === 'accent' || variant === 'success';
  const isBusy = variant === 'busy' || busy;
  return (
    <Pressable
      android_disableSound
      disabled={disabled || isBusy}
      onPress={onPress}
      style={({ pressed }) => ({
        opacity: disabled ? 0.4 : isBusy ? 0.5 : pressed ? 0.65 : 1,
        ...(flex && { flex: 1 }),
      })}
    >
      <View style={{
        ...(flex && { minHeight: 48 }),
        paddingVertical: flex ? 14 : 12,
        paddingHorizontal: 14,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: isAccent ? MIST.accent : MIST.hairlineX,
        backgroundColor: isAccent ? MIST.accentDim : 'transparent',
        alignItems: align,
        justifyContent: 'center',
      }}>
        <Text style={{
          fontFamily: FONT.mono, fontSize: 10, fontWeight: '500',
          letterSpacing: 2.2, textTransform: 'uppercase',
          color: isAccent ? MIST.accent : MIST.text,
        }}>
          {label}
        </Text>
      </View>
    </Pressable>
  );
}
