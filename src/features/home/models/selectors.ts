import type {Artist, SongSort, Track} from './types';

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


