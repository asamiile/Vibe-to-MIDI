import React from 'react';
import { Pressable, ScrollView, StatusBar, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '../src/data/store';
import { PRO_ENTITLEMENT_ID, PRO_FEATURES, PRO_PRODUCT_ID } from '../src/features/entitlements/pro-features';
import { backToReturnTarget, useSettingsReturnOnStackBack } from '../src/lib/navigation';
import { MIST, FONT } from '../src/styles/theme';

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
  useSettingsReturnOnStackBack(params.returnTo);

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1, backgroundColor: MIST.bg }}>
      <StatusBar barStyle="light-content" backgroundColor={MIST.bg} />

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: MIST.hairline }}>
        <Text style={{ fontFamily: FONT.mono, fontSize: 10, fontWeight: '500', letterSpacing: 2.2, textTransform: 'uppercase', color: MIST.text }}>
          Pro
        </Text>
        <Pressable
          android_disableSound
          onPress={() => backToReturnTarget(router, params.returnTo)}
          style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
        >
          <Text style={{ fontFamily: FONT.mono, fontSize: 10, fontWeight: '500', letterSpacing: 2.2, textTransform: 'uppercase', color: MIST.textFaint }}>
            ← BACK
          </Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 48 }} showsVerticalScrollIndicator={false}>
        <Text style={{ fontFamily: FONT.sans, fontSize: 34, fontWeight: '300', color: MIST.text, letterSpacing: -0.8, lineHeight: 38 }}>
          Vibe→MIDI Pro
        </Text>
        <Text style={{ fontFamily: FONT.sans, fontSize: 13, color: MIST.textMute, lineHeight: 20, marginTop: 14 }}>
          Pro is prepared for a one-time unlock after Google Play Billing is connected. The free app should remain useful; Pro adds DAW export and deeper playback experiences.
        </Text>

        <View style={{ marginTop: 28, padding: 16, borderWidth: 1, borderColor: MIST.hairlineX }}>
          <Text style={{ fontFamily: FONT.mono, fontSize: 9, fontWeight: '500', letterSpacing: 2.2, textTransform: 'uppercase', color: MIST.textMute }}>
            Billing setup
          </Text>
          <Text style={{ fontFamily: FONT.mono, fontSize: 11, color: MIST.textFaint, lineHeight: 18, marginTop: 10 }}>
            Product {PRO_PRODUCT_ID}{'\n'}
            Entitlement {PRO_ENTITLEMENT_ID}{'\n'}
            Status {hasProAccess ? `active (${proAccessSource})` : 'not active'}
          </Text>
        </View>

        <View style={{ marginTop: 28 }}>
          <Text style={{ fontFamily: FONT.mono, fontSize: 9, fontWeight: '500', letterSpacing: 2.2, textTransform: 'uppercase', color: MIST.textMute, marginBottom: 4 }}>
            Included
          </Text>
          <View style={{ height: 1, backgroundColor: MIST.hairlineX }} />
          {PRO_FEATURES.map((feature) => (
            <ProRow key={feature.id} label={feature.label} summary={feature.summary} />
          ))}
        </View>

        {__DEV__ && (
          <Pressable
            android_disableSound
            onPress={() => setDevProAccess(!hasProAccess)}
            style={({ pressed }) => ({
              marginTop: 32,
              paddingVertical: 16,
              paddingHorizontal: 18,
              borderWidth: 1,
              borderColor: hasProAccess ? MIST.accent : MIST.hairlineX,
              backgroundColor: hasProAccess ? MIST.accentDim : 'transparent',
              opacity: pressed ? 0.65 : 1,
            })}
          >
            <Text style={{ fontFamily: FONT.mono, fontSize: 10, fontWeight: '500', letterSpacing: 2.2, textTransform: 'uppercase', color: hasProAccess ? MIST.accent : MIST.text }}>
              {hasProAccess ? 'Disable Pro Preview' : 'Enable Pro Preview'}
            </Text>
          </Pressable>
        )}

        <Text style={{ fontFamily: FONT.sans, fontSize: 11, color: MIST.textGhost, lineHeight: 17, marginTop: 18 }}>
          Real purchases are intentionally disabled until release setup is ready. Do not add external checkout links for in-app digital features.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
