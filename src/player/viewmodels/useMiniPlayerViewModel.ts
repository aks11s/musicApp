import {useCallback} from 'react';
import {useAppDispatch, useAppSelector} from '../../app/hooks';
import {pause, play} from '../../services/player/playerService';
import {toErrorMessage} from '../../shared/lib/errors';
import {cleared, playbackFailed, selectCurrentTrack} from '../store/playerSlice';

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
  togglePlayback: () => void;
  stop: () => void;
};

export const useMiniPlayerViewModel = (): MiniPlayerViewModel => {
  const dispatch = useAppDispatch();
  const track = useAppSelector(selectCurrentTrack);
  const isPlaying = useAppSelector(state => state.player.status === 'playing');

  const togglePlayback = useCallback(async () => {
    try {
      await (isPlaying ? pause() : play());
    } catch (error) {
      dispatch(playbackFailed(toErrorMessage(error)));
    }
  }, [dispatch, isPlaying]);

  return {
    track,
    isPlaying,
    // TODO: real progress from useProgress
    progress: 0,
    togglePlayback,
    // TODO: stop the engine too, not just hide the bar
    stop: () => dispatch(cleared()),
  };
};
