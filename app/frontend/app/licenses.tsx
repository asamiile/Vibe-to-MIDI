import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  AUDIO_NOTICE,
  BUNDLED_ASSET_LICENSE_NOTICES,
  LICENSE_RELEASE_CHECKLIST,
  RUNTIME_LICENSE_NOTICES,
} from '../src/data/licenseNotices';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ marginBottom: 24 }}>
      <Text style={{ color: '#94a3b8', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 }}>
        {title}
      </Text>
      {children}
    </View>
  );
}

export default function LicensesScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#060a10' }}>
      <View
        style={{
          paddingHorizontal: 20,
          paddingTop: 16,
          paddingBottom: 12,
          borderBottomWidth: 1,
          borderBottomColor: '#1e293b',
        }}
      >
        <Pressable
          android_disableSound
          onPress={() => router.back()}
          style={({ pressed }) => ({
            alignSelf: 'flex-start',
            paddingVertical: 6,
            paddingRight: 12,
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <Text style={{ color: '#38bdf8', fontSize: 13, fontWeight: '700' }}>Back</Text>
        </Pressable>
        <Text style={{ color: '#e2e8f0', fontSize: 24, fontWeight: '700', marginTop: 8 }}>
          Licenses
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }} showsVerticalScrollIndicator={false}>
        <Section title="Audio">
          <Text style={{ color: '#cbd5e1', fontSize: 14, lineHeight: 20 }}>{AUDIO_NOTICE}</Text>
        </Section>

        <Section title="Open source software">
          {RUNTIME_LICENSE_NOTICES.map((notice) => (
            <View
              key={notice.packageName}
              style={{
                paddingVertical: 12,
                borderBottomWidth: 1,
                borderBottomColor: '#1e293b',
              }}
            >
              <Text style={{ color: '#e2e8f0', fontSize: 14, fontWeight: '700' }}>
                {notice.packageName}
              </Text>
              <Text style={{ color: '#94a3b8', fontSize: 12, marginTop: 4 }}>
                {notice.license}
              </Text>
              <Text style={{ color: '#64748b', fontSize: 11, marginTop: 4 }}>
                {notice.repository}
              </Text>
            </View>
          ))}
        </Section>

        <Section title="Bundled assets">
          {BUNDLED_ASSET_LICENSE_NOTICES.length === 0 ? (
            <Text style={{ color: '#cbd5e1', fontSize: 14, lineHeight: 20 }}>
              No third-party bundled media assets are currently listed.
            </Text>
          ) : (
            BUNDLED_ASSET_LICENSE_NOTICES.map((asset) => (
              <View key={`${asset.kind}-${asset.name}`} style={{ paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#1e293b' }}>
                <Text style={{ color: '#e2e8f0', fontSize: 14, fontWeight: '700' }}>{asset.name}</Text>
                <Text style={{ color: '#94a3b8', fontSize: 12, marginTop: 4 }}>
                  {asset.kind} · {asset.license}
                </Text>
                <Text style={{ color: '#64748b', fontSize: 11, marginTop: 4 }}>
                  {asset.creator} · checked {asset.dateChecked}
                </Text>
              </View>
            ))
          )}
        </Section>

        <Section title="Release checks">
          {LICENSE_RELEASE_CHECKLIST.map((item) => (
            <Text key={item} style={{ color: '#64748b', fontSize: 11, lineHeight: 16, marginBottom: 6 }}>
              {item}
            </Text>
          ))}
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}
