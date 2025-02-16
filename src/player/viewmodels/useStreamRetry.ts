import {useEffect, useRef} from 'react';
import {useAppDispatch} from '../../app/hooks';
import {reresolveAudiusHost} from '../../services/api/audiusHost';
import {onPlaybackError, reloadActiveTrack} from '../../services/player/playerService';
import {toErrorMessage} from '../../shared/lib/errors';
import {shouldRetryStream, streamRetryDelayMs} from '../models/selectors';
import {playbackFailed} from '../store/playerSlice';

export const useStreamRetry = (): void => {
  const dispatch = useAppDispatch();
  const failedAttempts = useRef(0);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;

    const unsubscribe = onPlaybackError(message => {
      if (!shouldRetryStream(failedAttempts.current)) {
        dispatch(playbackFailed(message));
        return;
      }
      const delay = streamRetryDelayMs(failedAttempts.current);
      failedAttempts.current += 1;

      timer = setTimeout(() => {
        reresolveAudiusHost()
          .then(reloadActiveTrack)
          .catch(error => dispatch(playbackFailed(toErrorMessage(error))));
      }, delay);
    });

    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
  }, [dispatch]);
};
