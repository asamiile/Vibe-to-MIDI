import React, { useRef } from 'react';
import { View, Text, Pressable, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { getAudioContext, isAudioAvailable } from '../src/features/audio-engine/adapter';

type AudioCtx = NonNullable<Awaited<ReturnType<typeof getAudioContext>>>;
type StopFn = () => void;

interface SoundPreset {
  id: string;
  label: string;
  description: string;
  play: (ctx: AudioCtx) => StopFn;
}

function oscPreset(type: OscillatorType, freq: number, gain = 0.3): SoundPreset['play'] {
  return (ctx) => {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    g.gain.setValueAtTime(0, ctx.currentTime);
    g.gain.linearRampToValueAtTime(gain, ctx.currentTime + 0.01);
    osc.connect(g);
    g.connect(ctx.destination);
    osc.start(ctx.currentTime);
    return () => {
      const t = ctx.currentTime;
      g.gain.setValueAtTime(gain, t);
      g.gain.linearRampToValueAtTime(0, t + 0.05);
      try { osc.stop(t + 0.06); } catch {}
    };
  };
}

function bassPreset(): SoundPreset['play'] {
  return (ctx) => {
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const g = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.value = 55; // A1
    filter.type = 'lowpass';
    filter.frequency.value = 300;
    filter.Q.value = 2;
    g.gain.setValueAtTime(0, ctx.currentTime);
    g.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.01);
    osc.connect(filter);
    filter.connect(g);
    g.connect(ctx.destination);
    osc.start(ctx.currentTime);
    return () => {
      const t = ctx.currentTime;
      g.gain.setValueAtTime(g.gain.value, t);
      g.gain.linearRampToValueAtTime(0, t + 0.08);
      try { osc.stop(t + 0.09); } catch {}
    };
  };
}

function padPreset(): SoundPreset['play'] {
  return (ctx) => {
    const freqs = [220, 220.5, 330]; // A3 detuned pair + E4
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1200;
    filter.Q.value = 0;
    filter.connect(ctx.destination);

    const nodes = freqs.map((freq) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.value = freq;
      g.gain.setValueAtTime(0, ctx.currentTime);
      g.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.3);
      osc.connect(g);
      g.connect(filter);
      osc.start(ctx.currentTime);
      return { osc, g };
    });

    return () => {
      const t = ctx.currentTime;
      nodes.forEach(({ osc, g }) => {
        g.gain.setValueAtTime(g.gain.value, t);
        g.gain.linearRampToValueAtTime(0, t + 0.4);
        try { osc.stop(t + 0.45); } catch {}
      });
    };
  };
}

function kickPreset(): SoundPreset['play'] {
  return (ctx) => {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    const now = ctx.currentTime;
    osc.frequency.value = 200;
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.linearRampToValueAtTime(40, now + 0.08);
    g.gain.setValueAtTime(0.8, now);
    g.gain.linearRampToValueAtTime(0, now + 0.25);
    osc.connect(g);
    g.connect(ctx.destination);
    osc.start(now);
    try { osc.stop(now + 0.3); } catch {}
    return () => {};
  };
}

const PRESETS: SoundPreset[] = [
  { id: 'sine',     label: 'Sine',      description: 'sine / 440Hz\n純音・フルート系',        play: oscPreset('sine', 440) },
  { id: 'square',   label: 'Square',    description: 'square / 440Hz\n矩形波・クラリネット系', play: oscPreset('square', 440, 0.2) },
  { id: 'sawtooth', label: 'Sawtooth',  description: 'sawtooth / 440Hz\nノコギリ波・シンセリード', play: oscPreset('sawtooth', 440, 0.2) },
  { id: 'triangle', label: 'Triangle',  description: 'triangle / 440Hz\n三角波・柔らかめ',     play: oscPreset('triangle', 440) },
  { id: 'bass',     label: 'Synth Bass', description: 'sawtooth / 55Hz\n+ lowpass filter Q=2', play: bassPreset() },
  { id: 'pad',      label: 'Pad',        description: 'sawtooth x3 detuned\n+ lowpass, slow attack', play: padPreset() },
  { id: 'kick',     label: 'Kick',       description: 'sine / 200→40Hz\nピッチダウンエンベロープ', play: kickPreset() },
];

function PresetButton({ preset }: { preset: SoundPreset }) {
  const stopRef = useRef<StopFn | null>(null);

  function handlePress() {
    stopRef.current?.();
    getAudioContext().then((ctx) => {
      if (!ctx) return;
      const stop = preset.play(ctx);
      stopRef.current = stop;
      setTimeout(() => {
        stop();
        stopRef.current = null;
      }, 1500);
    });
  }

  return (
    <Pressable
      onPress={handlePress}
      android_disableSound
      style={({ pressed }) => ({
        flex: 1,
        minWidth: '45%',
        backgroundColor: pressed ? '#0e4a6e' : '#0b111c',
        borderWidth: 1,
        borderColor: '#1e4a6e',
        borderRadius: 8,
        padding: 14,
        margin: 4,
        opacity: pressed ? 0.85 : 1,
      })}
    >
      <Text style={{ color: '#38bdf8', fontSize: 13, fontWeight: '800', marginBottom: 4 }}>
        {preset.label}
      </Text>
      <Text style={{ color: '#475569', fontSize: 11, lineHeight: 16 }}>
        {preset.description}
      </Text>
    </Pressable>
  );
}

export default function DebugAudioScreen() {
  const router = useRouter();
  const audioAvailable = isAudioAvailable();

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1, backgroundColor: '#060a10' }}>
      <StatusBar barStyle="light-content" backgroundColor="#060a10" />
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 12 }}>
        <Text style={{ color: '#e2e8f0', fontSize: 22, fontWeight: '900' }}>Audio Debug</Text>
        <Pressable
          android_disableSound
          onPress={() => router.back()}
          style={({ pressed }) => ({
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 6,
            borderWidth: 1,
            borderColor: '#334155',
            backgroundColor: '#0f172a',
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <Text style={{ color: '#64748b', fontSize: 12 }}>✕ Close</Text>
        </Pressable>
      </View>

      {!audioAvailable ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
          <Text style={{ color: '#ef4444', fontSize: 14, fontWeight: '700', textAlign: 'center' }}>
            Audio not available
          </Text>
          <Text style={{ color: '#475569', fontSize: 12, textAlign: 'center', marginTop: 8 }}>
            Dev Build が必要です
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 12, paddingBottom: 24 }}>
          <Text style={{ color: '#475569', fontSize: 11, marginBottom: 16, paddingHorizontal: 4 }}>
            タップで再生（1.5秒後に自動停止）
          </Text>

          <Text style={{ color: '#64748b', fontSize: 10, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8, paddingHorizontal: 4 }}>
            Oscillator Waveforms
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {PRESETS.slice(0, 4).map((p) => (
              <PresetButton key={p.id} preset={p} />
            ))}
          </View>

          <Text style={{ color: '#64748b', fontSize: 10, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginTop: 20, marginBottom: 8, paddingHorizontal: 4 }}>
            Synth Presets
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {PRESETS.slice(4).map((p) => (
              <PresetButton key={p.id} preset={p} />
            ))}
          </View>

          <View style={{ marginTop: 28, paddingHorizontal: 4 }}>
            <Text style={{ color: '#64748b', fontSize: 10, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 }}>
              Audio Node Reference
            </Text>
            {([
              ['OscillatorNode', 'sine / square / sawtooth / triangle / custom'],
              ['BiquadFilterNode', 'lowpass / highpass / bandpass / notch / allpass / ...'],
              ['GainNode', 'ボリューム・エンベロープ制御'],
              ['WaveShaperNode', 'ディストーション・波形整形'],
              ['DelayNode', 'ディレイ'],
              ['ConvolverNode', 'リバーブ（IRファイル必要）'],
              ['StereoPannerNode', 'パン'],
              ['AnalyserNode', '周波数解析（可視化用）'],
            ] as const).map(([node, desc]) => (
              <View key={node} style={{ flexDirection: 'row', marginBottom: 8, gap: 8 }}>
                <Text style={{ color: '#38bdf8', fontSize: 11, fontWeight: '700', width: 140 }}>{node}</Text>
                <Text style={{ color: '#475569', fontSize: 11, flex: 1 }}>{desc}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
