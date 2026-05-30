import React from 'react';
import { Pressable, ScrollView, StatusBar, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '../src/data/store';
import { PRO_FEATURES } from '../src/features/entitlements/pro-features';
import { backToReturnTarget, useSettingsReturnOnStackBack } from '../src/lib/navigation';
import { MIST, FONT } from '../src/styles/theme';
import { AButton } from '../src/components/ui/AButton';

function ProRow({ label, summary }: { label: string; summary: string }) {
  return (
    <View style={{ paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: MIST.hairline }}>
      <Text style={{ fontFamily: FONT.sans, fontSize: 15, color: MIST.text, fontWeight: '400' }}>
        {label}
      </Text>
      <Text style={{ fontFamily: FONT.sans, fontSize: 12, color: MIST.textFaint, lineHeight: 18, marginTop: 6 }}>
        {summary}
      </Text>
    </View>
  );
}

export default function ProScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ returnTo?: string }>();
  const { hasProAccess, proAccessSource, setDevProAccess } = useAppStore();
  const BILLING_LIVE = false; // State 2: Toggle this when billing is integrated
  useSettingsReturnOnStackBack(params.returnTo);

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1, backgroundColor: MIST.bg }}>
      <StatusBar barStyle="light-content" backgroundColor={MIST.bg} />

      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: MIST.hairline }}>
        <Text style={{ fontFamily: FONT.mono, fontSize: 9, fontWeight: '500', letterSpacing: 2.2, textTransform: 'uppercase', color: MIST.textMute }}>
          PRO
        </Text>
        <Pressable
          android_disableSound
          onPress={() => backToReturnTarget(router, params.returnTo)}
          style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
        >
          <Text style={{ fontFamily: FONT.mono, fontSize: 9, fontWeight: '500', letterSpacing: 2.2, textTransform: 'uppercase', color: MIST.textFaint }}>
            ← BACK
          </Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 48 }} showsVerticalScrollIndicator={false}>

        {/* Hero */}
        <View style={{ paddingHorizontal: 24, paddingTop: 32, paddingBottom: 24, borderBottomWidth: 1, borderBottomColor: MIST.hairline }}>
          <Text style={{ fontFamily: FONT.mono, fontSize: 9, fontWeight: '500', letterSpacing: 2.2, textTransform: 'uppercase', color: MIST.textFaint, marginBottom: 16 }}>
            ONE-TIME UNLOCK
          </Text>
          <Text style={{ fontFamily: FONT.sans, fontSize: 42, fontWeight: '300', color: MIST.text, letterSpacing: -1.2, lineHeight: 46 }}>
            Vibe<Text style={{ color: MIST.accent }}>→</Text>MIDI
          </Text>
          <Text style={{ fontFamily: FONT.sans, fontSize: 42, fontWeight: '300', color: MIST.accent, letterSpacing: -1.2, lineHeight: 46 }}>
            Pro
          </Text>
          <Text style={{ fontFamily: FONT.sans, fontSize: 13, color: MIST.textMute, lineHeight: 20, marginTop: 14 }}>
            DAW export and deeper playback. The free app stays useful.
          </Text>
        </View>

        {/* Purchase CTA */}
        <View style={{ paddingHorizontal: 24, paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: MIST.hairline }}>
          {hasProAccess ? (
            <>
              <AButton
                variant="accent"
                align="flex-start"
                label={`PRO ACTIVE${proAccessSource ? ` · ${proAccessSource.toUpperCase()}` : ''}`}
                onPress={() => {}}
              />
              <Text style={{ fontFamily: FONT.sans, fontSize: 11, color: MIST.textMute, lineHeight: 16, marginTop: 10, textAlign: 'left' }}>
                All Pro features are unlocked.
              </Text>
            </>
          ) : (
            <>
              <AButton
                variant={BILLING_LIVE ? 'busy' : 'default'}
                label={BILLING_LIVE ? 'Unlock Pro · One-Time' : 'Unlock Pro'}
                disabled={!BILLING_LIVE}
                onPress={() => { /* Purchase logic here */ }}
              />
              {!BILLING_LIVE && (
                <Text style={{ fontFamily: FONT.mono, fontSize: 11, color: MIST.textGhost, lineHeight: 16, marginTop: 10, letterSpacing: 0.5, textAlign: 'left' }}>
                  Purchase available after billing setup.
                </Text>
              )}
            </>
          )}
        </View>

        {/* Feature list */}
        <View style={{ paddingHorizontal: 24 }}>
          <Text style={{ fontFamily: FONT.mono, fontSize: 9, fontWeight: '500', letterSpacing: 2.2, textTransform: 'uppercase', color: MIST.textFaint, paddingVertical: 16 }}>
            INCLUDED
          </Text>
          <View style={{ height: 1, backgroundColor: MIST.hairlineX }} />
          {PRO_FEATURES.map((feature) => (
            <ProRow key={feature.id} label={feature.label} summary={feature.summary} />
          ))}
        </View>

        {__DEV__ && (
          <View style={{ paddingHorizontal: 24, paddingTop: 16 }}>
            <Pressable
              android_disableSound
              onPress={() => setDevProAccess(!hasProAccess)}
              style={({ pressed }) => ({
                paddingVertical: 16,
                paddingHorizontal: 18,
                borderWidth: 1,
                borderColor: hasProAccess ? MIST.accent : MIST.hairlineX,
                backgroundColor: hasProAccess ? MIST.accentDim : 'transparent',
                alignItems: 'center',
                opacity: pressed ? 0.65 : 1,
              })}
            >
              <Text style={{ fontFamily: FONT.mono, fontSize: 10, fontWeight: '500', letterSpacing: 2.2, textTransform: 'uppercase', color: hasProAccess ? MIST.accent : MIST.text }}>
                {hasProAccess ? 'Disable Pro Preview' : 'Enable Pro Preview'}
              </Text>
            </Pressable>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}
