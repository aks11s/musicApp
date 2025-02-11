import {useEffect} from 'react';
import {useAppDispatch} from '../../app/hooks';
import {onActiveTrackChanged, onStateChanged} from '../../services/player/playerService';
import {activeTrackChanged, statusChanged} from '../store/playerSlice';

export const usePlayerEventsSync = (): void => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    onStateChanged(state => dispatch(statusChanged(state)));
    onActiveTrackChanged(index => dispatch(activeTrackChanged(index)));
  }, [dispatch]);
};
