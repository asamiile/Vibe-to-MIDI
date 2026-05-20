import React, { useRef } from 'react';
import { View, Text, Pressable, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getAudioContext, isAudioAvailable } from '../src/features/audio-engine/adapter';
import { backToReturnTarget, useSettingsReturnOnStackBack } from '../src/lib/navigation';
import { MIST, FONT } from '../src/styles/theme';

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
    osc.frequency.value = 55;
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
    const freqs = [220, 220.5, 330];
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
  { id: 'sine',     label: 'Sine',       description: 'sine / 440Hz',        play: oscPreset('sine', 440) },
  { id: 'square',   label: 'Square',     description: 'square / 440Hz',      play: oscPreset('square', 440, 0.2) },
  { id: 'sawtooth', label: 'Sawtooth',   description: 'sawtooth / 440Hz',    play: oscPreset('sawtooth', 440, 0.2) },
  { id: 'triangle', label: 'Triangle',   description: 'triangle / 440Hz',    play: oscPreset('triangle', 440) },
  { id: 'bass',     label: 'Synth Bass', description: 'sawtooth 55Hz + lowpass Q=2', play: bassPreset() },
  { id: 'pad',      label: 'Pad',        description: 'sawtooth x3 detuned + lowpass', play: padPreset() },
  { id: 'kick',     label: 'Kick',       description: 'sine 200→40Hz pitch envelope', play: kickPreset() },
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
        borderWidth: 1,
        borderColor: pressed ? MIST.accent : MIST.hairlineX,
        backgroundColor: pressed ? MIST.accentDim : 'transparent',
        padding: 14,
        margin: 4,
        opacity: pressed ? 0.85 : 1,
      })}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <Text style={{ fontFamily: FONT.mono, fontSize: 9, color: MIST.accent }}>▶</Text>
        <Text style={{ fontFamily: FONT.mono, fontSize: 11, color: MIST.text, fontWeight: '500', letterSpacing: 0.5 }}>
          {preset.label}
        </Text>
      </View>
      <Text style={{ fontFamily: FONT.sans, fontSize: 11, color: MIST.textFaint, lineHeight: 16 }}>
        {preset.description}
      </Text>
    </Pressable>
  );
}

function SectionLabel({ children }: { children: string }) {
  return (
    <View style={{ marginBottom: 8, marginTop: 24 }}>
      <Text style={{ fontFamily: FONT.mono, fontSize: 9, fontWeight: '500', letterSpacing: 2.2, textTransform: 'uppercase', color: MIST.textMute }}>
        {children}
      </Text>
      <View style={{ height: 1, backgroundColor: MIST.hairlineX, marginTop: 4 }} />
    </View>
  );
}

export default function DebugAudioScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ returnTo?: string }>();
  const audioAvailable = isAudioAvailable();
  useSettingsReturnOnStackBack(params.returnTo);

  function handleBack() {
    backToReturnTarget(router, params.returnTo);
  }

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1, backgroundColor: MIST.bg }}>
      <StatusBar barStyle="light-content" backgroundColor={MIST.bg} />

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: MIST.hairline }}>
        <Text style={{ fontFamily: FONT.mono, fontSize: 10, fontWeight: '500', letterSpacing: 2.2, textTransform: 'uppercase', color: MIST.text }}>
          Audio Debug
        </Text>
        <Pressable
          android_disableSound
          onPress={handleBack}
          style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
        >
          <Text style={{ fontFamily: FONT.mono, fontSize: 10, fontWeight: '500', letterSpacing: 2.2, textTransform: 'uppercase', color: MIST.textFaint }}>
            BACK
          </Text>
        </Pressable>
      </View>

      {!audioAvailable ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
          <Text style={{ fontFamily: FONT.mono, fontSize: 10, color: MIST.textFaint, letterSpacing: 1, textAlign: 'center' }}>
            AUDIO REQUIRES DEV BUILD
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 48 }} showsVerticalScrollIndicator={false}>
          <Text style={{ fontFamily: FONT.mono, fontSize: 9, color: MIST.textFaint, letterSpacing: 1, marginBottom: 20 }}>
            TAP TO PLAY · AUTO STOP 1.5s
          </Text>

          <SectionLabel>Oscillator Waveforms</SectionLabel>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 }}>
            {PRESETS.slice(0, 4).map((p) => (
              <PresetButton key={p.id} preset={p} />
            ))}
          </View>

          <SectionLabel>Synth Presets</SectionLabel>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 }}>
            {PRESETS.slice(4).map((p) => (
              <PresetButton key={p.id} preset={p} />
            ))}
          </View>

          <SectionLabel>Audio Node Reference</SectionLabel>
          <View style={{ marginTop: 8 }}>
            {([
              ['OscillatorNode',    'sine / square / sawtooth / triangle'],
              ['BiquadFilterNode',  'lowpass / highpass / bandpass / notch'],
              ['GainNode',          'volume · envelope'],
              ['WaveShaperNode',    'distortion · waveshaping'],
              ['DelayNode',         'delay'],
              ['ConvolverNode',     'reverb (IR file required)'],
              ['StereoPannerNode',  'pan'],
              ['AnalyserNode',      'frequency analysis'],
            ] as const).map(([node, desc]) => (
              <View key={node} style={{ flexDirection: 'row', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: MIST.hairline, gap: 12 }}>
                <Text style={{ fontFamily: FONT.mono, fontSize: 10, color: MIST.accent, width: 140 }}>{node}</Text>
                <Text style={{ fontFamily: FONT.mono, fontSize: 10, color: MIST.textFaint, flex: 1 }}>{desc}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
