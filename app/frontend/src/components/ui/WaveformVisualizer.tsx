import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';

const BAR_COUNT = 6;
const BAR_WIDTH = 3;
const BAR_GAP = 2;
const MAX_HEIGHT = 20;
const MIN_HEIGHT = 3;

const PHASES = [0, 0.4, 0.8, 0.2, 0.6, 1.0];
const SPEEDS = [600, 700, 500, 750, 650, 550];

export function WaveformVisualizer({ isPlaying }: { isPlaying: boolean }) {
  const animations = useRef(PHASES.map(() => new Animated.Value(0))).current;
  const loopRefs = useRef<Animated.CompositeAnimation[]>([]);

  useEffect(() => {
    loopRefs.current.forEach((a) => a.stop());
    loopRefs.current = [];

    if (isPlaying) {
      animations.forEach((anim, i) => {
        const loop = Animated.loop(
          Animated.sequence([
            Animated.delay(PHASES[i] * SPEEDS[i]),
            Animated.timing(anim, {
              toValue: 1,
              duration: SPEEDS[i] / 2,
              useNativeDriver: false,
            }),
            Animated.timing(anim, {
              toValue: 0,
              duration: SPEEDS[i] / 2,
              useNativeDriver: false,
            }),
          ])
        );
        loopRefs.current.push(loop);
        loop.start();
      });
    } else {
      animations.forEach((anim) => {
        Animated.timing(anim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: false,
        }).start();
      });
    }
  }, [isPlaying]);

  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: MAX_HEIGHT }}>
      {animations.map((anim, i) => {
        const height = anim.interpolate({
          inputRange: [0, 1],
          outputRange: [MIN_HEIGHT, MAX_HEIGHT],
        });
        return (
          <Animated.View
            key={i}
            style={{
              width: BAR_WIDTH,
              height,
              marginLeft: i === 0 ? 0 : BAR_GAP,
              backgroundColor: '#38bdf8',
              borderRadius: 2,
            }}
          />
        );
      })}
    </View>
  );
}
