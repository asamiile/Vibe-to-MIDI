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
import { MIST, FONT } from '../../styles/theme';
import { KickStepGrid } from './KickStepGrid';
import { AButton } from './AButton';

interface Props {
  suggestion: MusicalSuggestion;
}

type CompareTarget = 'original' | 'changed';

const FOCUS_OPTIONS: readonly LearningFocus[] = ['pulse', 'bass'];

function AMiniLabel({ children, color }: { children: string; color?: string }) {
  return (
    <Text
      style={{
        fontFamily: FONT.mono,
        fontSize: 9,
        fontWeight: '500',
        letterSpacing: 2.2,
        textTransform: 'uppercase',
        color: color ?? MIST.textMute,
      }}
    >
      {children}
    </Text>
  );
}

function TabLink({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <View style={{ flex: 1, minWidth: 0, minHeight: 40, alignItems: 'stretch' }}>
      <Pressable
        android_disableSound
        onPress={onPress}
        style={({ pressed }) => ({
          width: '100%',
          height: 40,
          minHeight: 40,
          alignItems: 'center',
          opacity: pressed ? 0.5 : 1,
          paddingHorizontal: 12,
          paddingTop: 8,
        })}
      >
        <Text
          style={{
            fontFamily: FONT.mono,
            fontSize: 10,
            fontWeight: '500',
            letterSpacing: 2.2,
            textTransform: 'uppercase',
            color: active ? MIST.accent : MIST.textFaint,
            textAlign: 'center',
          }}
          numberOfLines={1}
        >
          {label}
        </Text>
        <View
          style={{
            width: '100%',
            height: 1,
            marginTop: 8,
            backgroundColor: active ? MIST.accent : 'transparent',
          }}
        />
      </Pressable>
    </View>
  );
}



function BassStrip({ notes }: { notes: readonly number[] }) {
  const labels = notes.map(midiToNoteName);
  const lowest = Math.min(...notes);
  const highest = Math.max(...notes);
  const range = Math.max(1, highest - lowest);

  return (
    <View style={{ height: 86, flexDirection: 'row', alignItems: 'flex-end', gap: 6 }}>
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
                borderWidth: 1,
                borderColor: MIST.accent,
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  fontFamily: FONT.mono,
                  fontSize: 10,
                  color: MIST.text,
                  fontWeight: '500',
                }}
              >
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
  const view = React.useMemo(() => buildLearningFocusView(suggestion, focus), [suggestion, focus]);

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
    <View style={{ paddingBottom: 24 }}>
      {/* Focus tabs */}
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: 24,
          paddingVertical: 10,
          borderBottomWidth: 1,
          borderBottomColor: MIST.hairline,
        }}
      >
        {FOCUS_OPTIONS.map((item) => (
          <TabLink
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

      <View style={{ padding: 24 }}>
        {/* Goal */}
        <View style={{ marginBottom: 32 }}>
          <AMiniLabel>{focus === 'pulse' ? 'pulse · the heartbeat' : 'bass · the gravity'}</AMiniLabel>
          <Text
            style={{
              marginTop: 12,
              fontFamily: FONT.sans,
              fontSize: 28,
              fontWeight: '300',
              color: MIST.text,
              lineHeight: 32,
              letterSpacing: -0.6,
            }}
          >
            {view.goal}
          </Text>
        </View>

        {/* A / B compare — labels with gap, strips without gap */}
        <View style={{ marginBottom: 24 }}>
          {/* Tap buttons */}
          <View style={{ flexDirection: 'row', gap: 24, marginBottom: 10 }}>
            {([
              { k: 'original' as CompareTarget, label: 'A · Original' },
              { k: 'changed'  as CompareTarget, label: 'B · Try change' },
            ]).map((opt) => {
              const active = activeCompare === opt.k;
              return (
                <AButton
                  key={opt.k}
                  flex={true}
                  disabled={!audioAvailable}
                  variant={active ? 'accent' : 'default'}
                  label={opt.label}
                  onPress={() => { void playCompare(opt.k); }}
                />
              );
            })}
          </View>
        </View>

        {/* Result chip */}
        <View
          style={{
            alignSelf: 'flex-start',
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderWidth: 1,
            borderColor: MIST.accent,
            marginBottom: 24,
          }}
        >
          <Text
            style={{
              fontFamily: FONT.mono,
              fontSize: 10,
              color: MIST.accent,
              letterSpacing: 1.8,
              textTransform: 'uppercase',
            }}
          >
            Loop feels · {view.resultWord}
          </Text>
        </View>

        {/* Visual detail strip */}
        <View style={{ marginBottom: 18 }}>
          <View style={{ marginBottom: 8 }}>
            <AMiniLabel>
              {activeCompare === 'changed' ? 'Try' : 'Original'}
            </AMiniLabel>
          </View>
          {focus === 'pulse' ? (
            <KickStepGrid pattern={visualSource.rhythmPattern} />
          ) : (
            <BassStrip notes={visualSource.bassNotes} />
          )}
          <Text
            style={{
              marginTop: 8,
              fontFamily: FONT.sans,
              fontSize: 12,
              color: MIST.textMute,
              lineHeight: 17,
            }}
          >
            {view.reason}
          </Text>
        </View>

        {!audioAvailable && (
          <Text
            style={{
              fontFamily: FONT.mono,
              fontSize: 10,
              color: MIST.textFaint,
              letterSpacing: 1,
              marginTop: 8,
            }}
          >
            AUDIO REQUIRES DEV BUILD
          </Text>
        )}
      </View>
    </View>
  );
}
