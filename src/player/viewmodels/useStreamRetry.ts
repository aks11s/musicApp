import {useEffect, useRef} from 'react';
import {useAppDispatch, useAppSelector} from '../../app/hooks';
import {reresolveAudiusHost} from '../../services/api/audiusHost';
import {onPlaybackError, reloadActiveTrack} from '../../services/player/playerService';
import {toErrorMessage} from '../../shared/lib/errors';
import {shouldRetryStream, streamRetryDelayMs} from '../models/selectors';
import {playbackFailed} from '../store/playerSlice';

export const useStreamRetry = (): void => {
  const dispatch = useAppDispatch();
  const failedAttempts = useRef(0);
  const queue = useAppSelector(state => state.player.queue);
  const currentIndex = useAppSelector(state => state.player.currentIndex);
  const status = useAppSelector(state => state.player.status);
  const isPlaying = status === 'playing';
  const isPaused = useRef(false);
  isPaused.current = status === 'paused';
  const timer = useRef<ReturnType<typeof setTimeout>>();

  // not on the engine's track event: reloadActiveTrack fires it too, and the retries would never run out
  useEffect(() => {
    failedAttempts.current = 0;
    clearTimeout(timer.current);
  }, [queue, currentIndex]);

  useEffect(() => {
    if (isPlaying) {
      failedAttempts.current = 0;
    }
  }, [isPlaying]);

  useEffect(() => {
    const unsubscribe = onPlaybackError(message => {
      if (!shouldRetryStream(failedAttempts.current)) {
        dispatch(playbackFailed(message));
        return;
      }
      const delay = streamRetryDelayMs(failedAttempts.current);
      failedAttempts.current += 1;

      clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        reresolveAudiusHost()
          .then(() => reloadActiveTrack(!isPaused.current))
          .catch(error => dispatch(playbackFailed(toErrorMessage(error))));
      }, delay);
    });

    return () => {
      unsubscribe();
      clearTimeout(timer.current);
    };
  }, [dispatch]);
};
