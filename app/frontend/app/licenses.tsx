import React from 'react';
import { Pressable, ScrollView, StatusBar, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  AUDIO_NOTICE,
  BUNDLED_ASSET_LICENSE_NOTICES,
  LICENSE_RELEASE_CHECKLIST,
  RUNTIME_LICENSE_NOTICES,
} from '../src/data/licenseNotices';
import { MIST, FONT } from '../src/styles/theme';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ marginBottom: 28 }}>
      <Text style={{ fontFamily: FONT.mono, fontSize: 9, fontWeight: '500', letterSpacing: 2.2, textTransform: 'uppercase', color: MIST.textMute, marginBottom: 6 }}>
        {title}
      </Text>
      <View style={{ height: 1, backgroundColor: MIST.hairlineX, marginBottom: 4 }} />
      {children}
    </View>
  );
}

export default function LicensesScreen() {
  const router = useRouter();

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1, backgroundColor: MIST.bg }}>
      <StatusBar barStyle="light-content" backgroundColor={MIST.bg} />

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: MIST.hairline }}>
        <Text style={{ fontFamily: FONT.mono, fontSize: 10, fontWeight: '500', letterSpacing: 2.2, textTransform: 'uppercase', color: MIST.text }}>
          Licenses
        </Text>
        <Pressable
          android_disableSound
          onPress={() => router.back()}
          style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
        >
          <Text style={{ fontFamily: FONT.mono, fontSize: 10, fontWeight: '500', letterSpacing: 2.2, textTransform: 'uppercase', color: MIST.textFaint }}>
            ← BACK
          </Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 48 }} showsVerticalScrollIndicator={false}>
        <Section title="Audio">
          <Text style={{ fontFamily: FONT.sans, fontSize: 13, color: MIST.textMute, lineHeight: 20 }}>
            {AUDIO_NOTICE}
          </Text>
        </Section>

        <Section title="Open source software">
          {RUNTIME_LICENSE_NOTICES.map((notice) => (
            <View key={notice.packageName} style={{ paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: MIST.hairline }}>
              <Text style={{ fontFamily: FONT.mono, fontSize: 12, color: MIST.text, fontWeight: '500' }}>
                {notice.packageName}
              </Text>
              <Text style={{ fontFamily: FONT.mono, fontSize: 10, color: MIST.textMute, marginTop: 4 }}>
                {notice.license}
              </Text>
              <Text style={{ fontFamily: FONT.mono, fontSize: 9, color: MIST.textFaint, marginTop: 2 }}>
                {notice.repository}
              </Text>
            </View>
          ))}
        </Section>

        <Section title="Bundled assets">
          {BUNDLED_ASSET_LICENSE_NOTICES.length === 0 ? (
            <Text style={{ fontFamily: FONT.sans, fontSize: 13, color: MIST.textMute, lineHeight: 20 }}>
              No third-party bundled media assets are currently listed.
            </Text>
          ) : (
            BUNDLED_ASSET_LICENSE_NOTICES.map((asset) => (
              <View key={`${asset.kind}-${asset.name}`} style={{ paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: MIST.hairline }}>
                <Text style={{ fontFamily: FONT.mono, fontSize: 12, color: MIST.text, fontWeight: '500' }}>
                  {asset.name}
                </Text>
                <Text style={{ fontFamily: FONT.mono, fontSize: 10, color: MIST.textMute, marginTop: 4 }}>
                  {asset.kind} · {asset.license}
                </Text>
                <Text style={{ fontFamily: FONT.mono, fontSize: 9, color: MIST.textFaint, marginTop: 2 }}>
                  {asset.creator} · checked {asset.dateChecked}
                </Text>
              </View>
            ))
          )}
        </Section>

        <Section title="Release checks">
          {LICENSE_RELEASE_CHECKLIST.map((item) => (
            <Text key={item} style={{ fontFamily: FONT.mono, fontSize: 10, color: MIST.textFaint, lineHeight: 18, marginBottom: 6 }}>
              {item}
            </Text>
          ))}
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}
