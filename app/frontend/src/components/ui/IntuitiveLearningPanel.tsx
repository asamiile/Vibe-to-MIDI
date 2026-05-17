import React from 'react';
import { View, Text, Pressable } from 'react-native';
import type { MusicalSuggestion } from '../../features/vibe-map/types';
import { buildLearningFocusView } from '../../features/vibe-map/learning';
import type { LearningFocus } from '../../features/vibe-map/learning';
import { isAudioAvailable } from '../../features/audio-engine/adapter';
import { playPreview } from '../../features/audio-engine/player';
import type { PlayerHandle } from '../../features/audio-engine/player';
import { useAppStore } from '../../data/store';
import { midiToNoteName } from '../../lib/notes';

interface Props {
  suggestion: MusicalSuggestion;
}

type CompareTarget = 'original' | 'changed';

const STEP_LABELS = ['1', 'e', '&', 'a'];
const FOCUS_OPTIONS: readonly LearningFocus[] = ['pulse', 'bass'];

function SectionTitle({ children }: { children: string }) {
  return (
    <Text className="mb-2 text-[10px] uppercase tracking-[1px] text-slate-400">
      {children}
    </Text>
  );
}

function FocusButton({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      android_disableSound
      onPress={onPress}
      className="min-h-10 flex-1 items-center justify-center rounded-md border px-3"
      style={({ pressed }) => ({
        backgroundColor: active ? '#164e63' : '#0f172a',
        borderColor: active ? '#22d3ee' : '#334155',
        opacity: pressed ? 0.75 : 1,
      })}
    >
      <Text className="text-xs font-black" style={{ color: active ? '#ecfeff' : '#94a3b8' }}>
        {label}
      </Text>
    </Pressable>
  );
}

function PlayButton({
  label,
  active,
  disabled,
  onPress,
}: {
  label: string;
  active: boolean;
  disabled: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      android_disableSound
      disabled={disabled}
      onPress={onPress}
      className="min-h-12 flex-1 items-center justify-center rounded-md border px-3"
      style={({ pressed }) => ({
        backgroundColor: disabled ? '#111827' : active ? '#14532d' : '#0b111c',
        borderColor: disabled ? '#1e293b' : active ? '#22c55e' : '#334155',
        opacity: pressed ? 0.75 : 1,
      })}
    >
      <Text className="text-[13px] font-black" style={{ color: disabled ? '#334155' : active ? '#dcfce7' : '#cbd5e1' }}>
        ▶ {label}
      </Text>
    </Pressable>
  );
}

function RhythmStrip({ pattern }: { pattern: readonly boolean[] }) {
  return (
    <View className="flex-row gap-1">
      {pattern.map((hit, index) => {
        const isDownbeat = index % 4 === 0;
        return (
          <View
            key={`pulse-${index}-${hit ? 'hit' : 'rest'}`}
            style={{
              flex: 1,
              minHeight: 42,
              borderRadius: 4,
              borderWidth: 1,
              borderColor: hit ? '#38bdf8' : '#1e293b',
              backgroundColor: hit ? (isDownbeat ? '#0e7490' : '#164e63') : '#0f172a',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: hit ? '#e0f2fe' : '#334155', fontSize: 9, fontWeight: '700' }}>
              {STEP_LABELS[index % 4]}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

function BassStrip({ notes }: { notes: readonly number[] }) {
  const labels = notes.map(midiToNoteName);
  const lowest = Math.min(...notes);
  const highest = Math.max(...notes);
  const range = Math.max(1, highest - lowest);

  return (
    <View className="h-[86px] flex-row items-end gap-2">
      {labels.map((note, index) => {
        const offset = ((notes[index] - lowest) / range) * 34;
        return (
          <View
            key={`${note}-${index}`}
            style={{
              flex: 1,
              height: 46 + offset,
              justifyContent: 'flex-start',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                width: '100%',
                paddingVertical: 5,
                borderRadius: 4,
                alignItems: 'center',
                backgroundColor: '#172554',
                borderWidth: 1,
                borderColor: '#3b82f6',
              }}
            >
              <Text style={{ color: '#dbeafe', fontSize: 12, fontWeight: '700' }}>
                {note}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

export function IntuitiveLearningPanel({ suggestion }: Props) {
  const [focus, setFocus] = React.useState<LearningFocus>('pulse');
  const [activeCompare, setActiveCompare] = React.useState<CompareTarget | null>(null);
  const localPlayer = React.useRef<PlayerHandle | null>(null);
  const stopTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const audioAvailable = isAudioAvailable();
  const stopGlobalPreview = useAppStore((state) => state.stop);
  const view = buildLearningFocusView(suggestion, focus);

  const stopLocalPreview = React.useCallback((resetActive = true) => {
    if (stopTimer.current) {
      clearTimeout(stopTimer.current);
      stopTimer.current = null;
    }
    localPlayer.current?.stop();
    localPlayer.current = null;
    if (resetActive) setActiveCompare(null);
  }, []);

  React.useEffect(() => () => stopLocalPreview(false), [stopLocalPreview, suggestion, focus]);

  async function playCompare(target: CompareTarget) {
    if (!audioAvailable) return;
    stopGlobalPreview();
    stopLocalPreview();
    setActiveCompare(target);

    const source = target === 'original' ? view.original : view.changed;
    const handle = await playPreview({
      ...suggestion,
      rhythmPattern: source.rhythmPattern,
      bassNotes: source.bassNotes,
    });
    localPlayer.current = handle;
    stopTimer.current = setTimeout(stopLocalPreview, 3600);
  }

  const visualSource = activeCompare === 'changed' ? view.changed : view.original;

  return (
    <View className="mb-[18px]">
      <View className="mb-3 flex-row gap-2">
        {FOCUS_OPTIONS.map((item) => (
          <FocusButton
            key={item}
            label={item === 'pulse' ? 'Pulse' : 'Bass'}
            active={focus === item}
            onPress={() => {
              stopLocalPreview();
              setFocus(item);
            }}
          />
        ))}
      </View>

      <View className="mb-[18px] rounded-lg border border-slate-700 bg-gray-900 p-3.5">
        <SectionTitle>{view.title}</SectionTitle>
        <Text className="mb-3 text-[16px] font-black leading-[22px] text-slate-100">
          {view.goal}
        </Text>
        <View className="mb-3 flex-row gap-2">
          <PlayButton
            label="Original"
            active={activeCompare === 'original'}
            disabled={!audioAvailable}
            onPress={() => { void playCompare('original'); }}
          />
          <PlayButton
            label="Try change"
            active={activeCompare === 'changed'}
            disabled={!audioAvailable}
            onPress={() => { void playCompare('changed'); }}
          />
        </View>
        <View className="self-start rounded bg-cyan-900 px-2.5 py-1.5">
          <Text className="text-xs font-extrabold text-cyan-100">
            Result: {view.resultWord}
          </Text>
        </View>
      </View>

      <View className="mb-[18px]">
        <SectionTitle>{activeCompare === 'changed' ? view.tryLabel : view.originalLabel}</SectionTitle>
        {focus === 'pulse' ? (
          <RhythmStrip pattern={visualSource.rhythmPattern} />
        ) : (
          <BassStrip notes={visualSource.bassNotes} />
        )}
        <Text className="mt-2 text-xs leading-[17px] text-slate-400">
          {view.reason}
        </Text>
      </View>

      {!audioAvailable && (
        <Text className="text-[12px] font-semibold leading-[18px] text-slate-500">
          Audio compare requires the native audio runtime.
        </Text>
      )}
    </View>
  );
}
