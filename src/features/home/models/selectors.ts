import {SONGS_MAX_OFFSET, SONGS_PAGE_SIZE} from './constants';
import type {Artist, Track} from '../../../domain/types';
import type {SongSort, SongSortField} from './types';

export const selectMostPopularArtists = (artists: Artist[], limit: number): Artist[] =>
  [...artists].sort((a, b) => b.followerCount - a.followerCount).slice(0, limit);

const compareByField = (a: Track, b: Track, field: SongSort['field']): number =>
  field === 'title'
    ? a.title.localeCompare(b.title, undefined, {sensitivity: 'base', numeric: true})
    : a.durationSeconds - b.durationSeconds;

export const selectSortedSongs = (tracks: Track[], sort: SongSort): Track[] =>
  [...tracks].sort((a, b) => {
    const result = compareByField(a, b, sort.field);
    return sort.isAscending ? result : -result;
  });

// tapping the active field flips direction, a new field starts ascending
export const nextSongSort = (current: SongSort, field: SongSortField): SongSort =>
  current.field === field
    ? {field, isAscending: !current.isAscending}
    : {field, isAscending: true};


export const hasMoreSongs = (offset: number): boolean => offset < SONGS_MAX_OFFSET;

export const nextSongsOffset = (offset: number): number => offset + SONGS_PAGE_SIZE;

export const putPageAt = <T>(pages: T[], index: number, page: T): T[] => {
  if (pages[index] === page) {
    return pages;
  }
  const next = [...pages];
  next[index] = page;
  return next;
};


