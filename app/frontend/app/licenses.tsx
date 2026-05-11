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
    <View className="mb-6">
      <Text className="mb-2.5 text-[11px] uppercase tracking-[1px] text-slate-400">
        {title}
      </Text>
      {children}
    </View>
  );
}

export default function LicensesScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-[#060a10]">
      <View className="border-b border-slate-800 px-5 pb-3 pt-4">
        <Pressable
          className="self-start py-1.5 pr-3"
          android_disableSound
          onPress={() => router.back()}
          style={({ pressed }) => ({
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <Text className="text-[13px] font-bold text-sky-400">Back</Text>
        </Pressable>
        <Text className="mt-2 text-2xl font-bold text-slate-200">
          Licenses
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }} showsVerticalScrollIndicator={false}>
        <Section title="Audio">
          <Text className="text-sm leading-5 text-slate-300">{AUDIO_NOTICE}</Text>
        </Section>

        <Section title="Open source software">
          {RUNTIME_LICENSE_NOTICES.map((notice) => (
            <View
              key={notice.packageName}
              className="border-b border-slate-800 py-3"
            >
              <Text className="text-sm font-bold text-slate-200">
                {notice.packageName}
              </Text>
              <Text className="mt-1 text-xs text-slate-400">
                {notice.license}
              </Text>
              <Text className="mt-1 text-[11px] text-slate-500">
                {notice.repository}
              </Text>
            </View>
          ))}
        </Section>

        <Section title="Bundled assets">
          {BUNDLED_ASSET_LICENSE_NOTICES.length === 0 ? (
            <Text className="text-sm leading-5 text-slate-300">
              No third-party bundled media assets are currently listed.
            </Text>
          ) : (
            BUNDLED_ASSET_LICENSE_NOTICES.map((asset) => (
              <View key={`${asset.kind}-${asset.name}`} className="border-b border-slate-800 py-3">
                <Text className="text-sm font-bold text-slate-200">{asset.name}</Text>
                <Text className="mt-1 text-xs text-slate-400">
                  {asset.kind} · {asset.license}
                </Text>
                <Text className="mt-1 text-[11px] text-slate-500">
                  {asset.creator} · checked {asset.dateChecked}
                </Text>
              </View>
            ))
          )}
        </Section>

        <Section title="Release checks">
          {LICENSE_RELEASE_CHECKLIST.map((item) => (
            <Text key={item} className="mb-1.5 text-[11px] leading-4 text-slate-500">
              {item}
            </Text>
          ))}
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}
