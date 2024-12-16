import {
  readRecentlyPlayed,
  writeRecentlyPlayed,
} from '../../../persistentStorage/recentlyPlayed.storage';
import {RECENTLY_PLAYED_LIMIT} from './constants';
import type {Track} from './types';

export const getRecentlyPlayed = (): Track[] => readRecentlyPlayed<Track>();

export const addRecentlyPlayed = (track: Track): void => {
  const history = getRecentlyPlayed();
  const withoutTrack = history.filter(item => item.id !== track.id);
  const next = [track, ...withoutTrack].slice(0, RECENTLY_PLAYED_LIMIT);

  writeRecentlyPlayed(next);
};
