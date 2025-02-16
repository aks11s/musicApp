import {
  readRecentlyPlayed,
  subscribeRecentlyPlayed as subscribeToStorage,
  writeRecentlyPlayed,
} from '../../../persistentStorage/recentlyPlayed.storage';
import {RECENTLY_PLAYED_LIMIT} from './constants';
import type {Track} from '../../../domain/types';

// useSyncExternalStore needs the same array back until something changes
let cached: Track[] | null = null;

export const getRecentlyPlayed = (): Track[] => {
  if (!cached) {
    cached = readRecentlyPlayed<Track>();
  }
  return cached;
};

export const subscribeRecentlyPlayed = (onChange: () => void): (() => void) =>
  subscribeToStorage(() => {
    cached = null;
    onChange();
  });

export const addRecentlyPlayed = (track: Track): void => {
  const history = getRecentlyPlayed();
  const withoutTrack = history.filter(item => item.id !== track.id);
  const next = [track, ...withoutTrack].slice(0, RECENTLY_PLAYED_LIMIT);

  cached = null;
  writeRecentlyPlayed(next);
};
