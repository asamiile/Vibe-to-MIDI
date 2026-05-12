import '../global.css';
import React from 'react';
import { View } from 'react-native';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PlayerBar } from '../src/components/ui/PlayerBar';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <View style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }} />
        <PlayerBar />
      </View>
    </SafeAreaProvider>
  );
}
