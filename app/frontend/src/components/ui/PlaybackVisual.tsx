import React from 'react';
import { View } from 'react-native';
import { MIST } from '../../styles/theme';

const PLAYBACK_LOOP = require('../../../assets/visuals/free-playback-loop-bioluminescent-network-01.mp4');

type ExpoVideoModule = typeof import('expo-video');

function loadExpoVideo(): ExpoVideoModule | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require('expo-video') as ExpoVideoModule;
  } catch {
    return null;
  }
}

interface Props {
  isPlaying: boolean;
}

export function PlaybackVisual({ isPlaying }: Props) {
  const expoVideo = React.useMemo(() => loadExpoVideo(), []);
  if (!expoVideo) {
    return <PlaybackVisualFallback isPlaying={isPlaying} />;
  }
  return <PlaybackVideo expoVideo={expoVideo} isPlaying={isPlaying} />;
}

function PlaybackVideo({
  expoVideo,
  isPlaying,
}: Props & {
  expoVideo: ExpoVideoModule;
}) {
  const player = expoVideo.useVideoPlayer(PLAYBACK_LOOP, (instance) => {
    instance.loop = true;
    instance.muted = true;
    instance.volume = 0;
    instance.audioMixingMode = 'mixWithOthers';
    instance.showNowPlayingNotification = false;
  });

  React.useEffect(() => {
    if (isPlaying) {
      player.play();
      return;
    }
    player.pause();
  }, [isPlaying, player]);

  return (
    <View
      pointerEvents="none"
      importantForAccessibility="no-hide-descendants"
      style={{
        position: 'absolute',
        inset: 0,
        opacity: isPlaying ? 0.78 : 0.18,
        backgroundColor: MIST.bg,
      }}
    >
      <expoVideo.VideoView
        player={player}
        nativeControls={false}
        contentFit="cover"
        fullscreenOptions={{ enable: false }}
        allowsPictureInPicture={false}
        surfaceType="textureView"
        style={{ flex: 1 }}
      />
      <View
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: isPlaying ? 'rgba(10,10,10,0.38)' : 'rgba(10,10,10,0.7)',
        }}
      />
    </View>
  );
}

function PlaybackVisualFallback({ isPlaying }: Props) {
  return (
    <View
      pointerEvents="none"
      importantForAccessibility="no-hide-descendants"
      style={{
        position: 'absolute',
        inset: 0,
        opacity: isPlaying ? 0.5 : 0.16,
        backgroundColor: isPlaying ? MIST.accentDim : MIST.bg,
      }}
    />
  );
}
