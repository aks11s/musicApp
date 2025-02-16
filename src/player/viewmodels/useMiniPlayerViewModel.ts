import {useCallback} from 'react';
import {useAppDispatch, useAppSelector} from '../../app/hooks';
import {pause, play, stop, usePlaybackProgress} from '../../services/player/playerService';
import {toErrorMessage} from '../../shared/lib/errors';
import {PLAYBACK_ERROR_TEXT} from '../models/constants';
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
  subtitle: string;
  hasError: boolean;
  isPlaying: boolean;
  progress: number;
  togglePlayback: () => void;
  stop: () => void;
};

export const useMiniPlayerViewModel = (): MiniPlayerViewModel => {
  const dispatch = useAppDispatch();
  const track = useAppSelector(selectCurrentTrack);
  const isPlaying = useAppSelector(state => state.player.status === 'playing');
  const error = useAppSelector(state => state.player.error);
  const {positionSeconds, durationSeconds} = usePlaybackProgress();

  const togglePlayback = useCallback(async () => {
    try {
      await (isPlaying ? pause() : play());
    } catch (error) {
      dispatch(playbackFailed(toErrorMessage(error)));
    }
  }, [dispatch, isPlaying]);

  const close = useCallback(() => {
    dispatch(cleared());
    stop().catch(() => undefined);
  }, [dispatch]);

  return {
    track,
    subtitle: error ? PLAYBACK_ERROR_TEXT : track?.artist ?? '',
    hasError: error !== null,
    isPlaying,
    progress: toProgressRatio(positionSeconds, durationSeconds),
    togglePlayback,
    stop: close,
  };
};
