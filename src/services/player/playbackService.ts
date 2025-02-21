import TrackPlayer, {Event} from 'react-native-track-player';

// runs outside React — lock screen, notification and headphone buttons land here
export const playbackService = async (): Promise<void> => {
  TrackPlayer.addEventListener(Event.RemotePlay, () => TrackPlayer.play().catch(() => {}));
  TrackPlayer.addEventListener(Event.RemotePause, () => TrackPlayer.pause().catch(() => {}));
  TrackPlayer.addEventListener(Event.RemoteNext, () => TrackPlayer.skipToNext().catch(() => {}));
  TrackPlayer.addEventListener(Event.RemotePrevious, () =>
    TrackPlayer.skipToPrevious().catch(() => {}),
  );
};
