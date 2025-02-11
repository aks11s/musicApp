import {useCallback} from 'react';
import {useAppDispatch} from '../../app/hooks';
import type {Track} from '../../domain/types';
import {playQueue} from '../../services/player/playerService';
import {playbackFailed, queueStarted} from '../store/playerSlice';

export const usePlayTracks = () => {
  const dispatch = useAppDispatch();

  return useCallback(
    async (tracks: Track[], startIndex: number) => {
      dispatch(queueStarted({tracks, startIndex}));
      try {
        await playQueue(tracks, startIndex);
      } catch (error) {
        dispatch(playbackFailed(error instanceof Error ? error.message : String(error)));
      }
    },
    [dispatch],
  );
};
