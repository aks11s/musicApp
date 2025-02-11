import {useAppDispatch, useAppSelector} from '../../app/hooks';
import {cleared, selectCurrentTrack} from '../store/playerSlice';

export type MiniPlayerTrack = {
  id: string;
  title: string;
  artist: string;
  artworkUrl: string;
};

export type MiniPlayerViewModel = {
  track: MiniPlayerTrack | null;
  isPlaying: boolean;
  progress: number;
  stop: () => void;
};

export const useMiniPlayerViewModel = (): MiniPlayerViewModel => {
  const dispatch = useAppDispatch();
  const track = useAppSelector(selectCurrentTrack);

  return {
    track,
    // TODO: real state and progress once the slice mirrors TrackPlayer events
    isPlaying: true,
    progress: 0,
    // TODO: stop the engine too, not just hide the bar
    stop: () => dispatch(cleared()),
  };
};
