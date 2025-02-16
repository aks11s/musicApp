import {useCallback} from 'react';
import {useAppDispatch, useAppSelector} from '../../app/hooks';
import {pause, play, usePlaybackProgress} from '../../services/player/playerService';
import {toErrorMessage} from '../../shared/lib/errors';
import {toProgressRatio} from '../models/formatters';
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
  const {positionSeconds, durationSeconds} = usePlaybackProgress();

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
    progress: toProgressRatio(positionSeconds, durationSeconds),
    togglePlayback,
    // TODO: stop the engine too, not just hide the bar
    stop: () => dispatch(cleared()),
  };
};
