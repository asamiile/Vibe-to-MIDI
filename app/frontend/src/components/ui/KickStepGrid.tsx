import React from 'react';
import { View, Text } from 'react-native';
import { MIST, FONT } from '../../styles/theme';

const STEP_LABELS = ['1', 'e', '&', 'a'];

interface Props {
  pattern: readonly boolean[];
}

export function KickStepGrid({ pattern }: Props) {
  return (
    <View style={{ width: '100%', flexDirection: 'row', gap: 4 }}>
      {pattern.map((hit, index) => (
        <View
          key={`kick-step-${index}-${hit ? 'hit' : 'rest'}`}
          style={{
            flex: 1,
            minWidth: 0,
            flexDirection: 'column',
            gap: 5,
          }}
        >
          <View
            style={{
              aspectRatio: 1,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: hit ? MIST.accent : MIST.textMute,
              backgroundColor: hit ? MIST.accentDim : 'transparent',
            }}
          >
            {hit && (
              <View
                style={{
                  width: 4,
                  height: 4,
                  backgroundColor: MIST.accent,
                  flexShrink: 0,
                }}
              />
            )}
          </View>
          <Text
            style={{
              fontFamily: FONT.mono,
              fontSize: 7,
              lineHeight: 7,
              letterSpacing: 0.6,
              color: index % 4 === 0 ? MIST.textMute : MIST.textGhost,
              textAlign: 'center',
            }}
            numberOfLines={1}
          >
            {index % 4 === 0 ? `${index / 4 + 1}` : STEP_LABELS[index % 4]}
          </Text>
        </View>
      ))}
    </View>
  );
}
