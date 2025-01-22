import {SONGS_MAX_OFFSET, SONGS_PAGE_SIZE, SONGS_SKELETON_MIN_MS} from './constants';
import type {Artist, Track} from '../../../domain/types';
import type {SongSort, SongSortField, SongsLoadState} from './types';

export const selectMostPopularArtists = (artists: Artist[], limit: number): Artist[] =>
  [...artists].sort((a, b) => b.followerCount - a.followerCount).slice(0, limit);

// localeCompare which is 17 x slower over a few hundred tracks
const titleCollator = new Intl.Collator(undefined, {sensitivity: 'base', numeric: true});

// ISO dates compare correctly as plain text, so no Date is parsed per comparison
const compareByField = (a: Track, b: Track, field: SongSortField): number => {
  switch (field) {
    case 'title':
      return titleCollator.compare(a.title, b.title);
    case 'artist':
      return titleCollator.compare(a.artist, b.artist);
    case 'duration':
      return a.durationSeconds - b.durationSeconds;
    case 'year':
      return a.releaseDate.localeCompare(b.releaseDate);
  }
};

export const selectSortedSongs = (tracks: Track[], sort: SongSort): Track[] =>
  [...tracks].sort((a, b) => {
    const result = compareByField(a, b, sort.field);
    return sort.isAscending ? result : -result;
  });

export const withSongSortField = (current: SongSort, field: SongSortField): SongSort =>
  current.field === field ? current : {field, isAscending: true};

export const withFlippedSongSort = (current: SongSort): SongSort => ({
  ...current,
  isAscending: !current.isAscending,
});


export const hasMoreSongs = (offset: number): boolean => offset < SONGS_MAX_OFFSET;

export const nextSongsOffset = (offset: number): number => offset + SONGS_PAGE_SIZE;

export const canLoadMoreSongs = ({ hasScrolled, isFetching, offset, requestedOffset }: SongsLoadState): boolean => {
  return hasScrolled && !isFetching && hasMoreSongs(offset) && requestedOffset === offset;
};

export const remainingSkeletonMs = (elapsedMs: number): number =>
  Math.max(SONGS_SKELETON_MIN_MS - elapsedMs, 0);

export const putPageAt = <T>(pages: T[], index: number, page: T): T[] => {
  if (pages[index] === page) {
    return pages;
  }
  const next = [...pages];
  next[index] = page;
  return next;
};


