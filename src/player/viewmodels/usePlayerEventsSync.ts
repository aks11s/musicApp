import {useEffect} from 'react';
import {useAppDispatch} from '../../app/hooks';
import {onStateChanged} from '../../services/player/playerService';
import {statusChanged} from '../store/playerSlice';

// the engine changes state on its own (buffering, end of track, lock screen),
// so the slice follows its events instead of guessing
export const usePlayerEventsSync = (): void => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    onStateChanged(state => dispatch(statusChanged(state)));
  }, [dispatch]);
};
