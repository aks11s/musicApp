import {SONGS_MAX_OFFSET, SONGS_PAGE_SIZE, SONGS_SKELETON_MIN_MS} from './constants';
import {
  canLoadMoreSongs,
  hasMoreSongs,
  withFlippedSongSort,
  withSongSortField,
  nextSongsOffset,
  putPageAt,
  remainingSkeletonMs,
  selectSortedSongs,
} from './selectors';
import type {Track} from '../../../domain/types';

const track = (
  id: string,
  title: string,
  durationSeconds: number,
  overrides: Partial<Track> = {},
): Track => ({
  id,
  title,
  artist: 'Someone',
  artworkUrl: '',
  durationSeconds,
  releaseDate: '2024-01-01T00:00:00Z',
  ...overrides,
});

const tracks = [
  track('1', 'velvet sky', 230),
  track('2', 'Golden Hour', 118),
  track('3', 'Starfall', 400),
];

describe('selectSortedSongs', () => {
  it('sorts by title ascending', () => {
    const sorted = selectSortedSongs(tracks, {field: 'title', isAscending: true});

    expect(sorted.map(t => t.title)).toEqual(['Golden Hour', 'Starfall', 'velvet sky']);
  });

  it('sorts by title descending', () => {
    const sorted = selectSortedSongs(tracks, {field: 'title', isAscending: false});

    expect(sorted.map(t => t.title)).toEqual(['velvet sky', 'Starfall', 'Golden Hour']);
  });

  it('ignores case when comparing titles', () => {
    const mixedCase = [track('1', 'banana', 10), track('2', 'Apple', 20)];

    const sorted = selectSortedSongs(mixedCase, {field: 'title', isAscending: true});

    expect(sorted.map(t => t.title)).toEqual(['Apple', 'banana']);
  });

  it('sorts numbered titles in human order', () => {
    const numbered = [track('1', 'Mix 10', 10), track('2', 'Mix 2', 20)];

    const sorted = selectSortedSongs(numbered, {field: 'title', isAscending: true});

    expect(sorted.map(t => t.title)).toEqual(['Mix 2', 'Mix 10']);
  });

  it('sorts by duration ascending', () => {
    const sorted = selectSortedSongs(tracks, {field: 'duration', isAscending: true});

    expect(sorted.map(t => t.durationSeconds)).toEqual([118, 230, 400]);
  });

  it('sorts by duration descending', () => {
    const sorted = selectSortedSongs(tracks, {field: 'duration', isAscending: false});

    expect(sorted.map(t => t.durationSeconds)).toEqual([400, 230, 118]);
  });

  it('sorts by artist ascending', () => {
    const byArtist = [
      track('1', 'a', 10, {artist: 'Zola'}),
      track('2', 'b', 10, {artist: 'aria Nova'}),
      track('3', 'c', 10, {artist: 'Mono'}),
    ];

    const sorted = selectSortedSongs(byArtist, {field: 'artist', isAscending: true});

    expect(sorted.map(t => t.artist)).toEqual(['aria Nova', 'Mono', 'Zola']);
  });

  it('sorts by year oldest first when ascending', () => {
    const byYear = [
      track('1', 'a', 10, {releaseDate: '2026-01-05T00:00:00Z'}),
      track('2', 'b', 10, {releaseDate: '2021-11-30T00:00:00Z'}),
      track('3', 'c', 10, {releaseDate: '2024-06-02T00:00:00Z'}),
    ];

    const sorted = selectSortedSongs(byYear, {field: 'year', isAscending: true});

    expect(sorted.map(t => t.releaseDate.slice(0, 4))).toEqual(['2021', '2024', '2026']);
  });

  it('sorts by year newest first when descending', () => {
    const byYear = [
      track('1', 'a', 10, {releaseDate: '2021-11-30T00:00:00Z'}),
      track('2', 'b', 10, {releaseDate: '2026-01-05T00:00:00Z'}),
    ];

    const sorted = selectSortedSongs(byYear, {field: 'year', isAscending: false});

    expect(sorted.map(t => t.releaseDate.slice(0, 4))).toEqual(['2026', '2021']);
  });

  // the mapper leaves an empty string when the API omits the date
  it('does not crash on tracks without a release date', () => {
    const mixed = [track('1', 'a', 10, {releaseDate: ''}), track('2', 'b', 10)];

    expect(() =>
      selectSortedSongs(mixed, {field: 'year', isAscending: true}),
    ).not.toThrow();
  });

  it('does not mutate the input', () => {
    const original = [...tracks];

    selectSortedSongs(tracks, {field: 'title', isAscending: true});

    expect(tracks).toEqual(original);
  });
});

describe('withSongSortField', () => {
  it('starts a newly picked field ascending', () => {
    const current = {field: 'title', isAscending: false} as const;

    expect(withSongSortField(current, 'artist')).toEqual({field: 'artist', isAscending: true});
  });

  // picking the field that is already active is not a direction change
  it('keeps the current sort when the same field is picked', () => {
    const current = {field: 'title', isAscending: false} as const;

    expect(withSongSortField(current, 'title')).toBe(current);
  });
});

describe('withFlippedSongSort', () => {
  it('flips ascending to descending', () => {
    expect(withFlippedSongSort({field: 'year', isAscending: true})).toEqual({
      field: 'year',
      isAscending: false,
    });
  });

  it('flips back', () => {
    expect(withFlippedSongSort({field: 'year', isAscending: false})).toEqual({
      field: 'year',
      isAscending: true,
    });
  });
});

describe('hasMoreSongs', () => {
  it('allows loading while under the Audius offset ceiling', () => {
    expect(hasMoreSongs(0)).toBe(true);
    expect(hasMoreSongs(SONGS_MAX_OFFSET - SONGS_PAGE_SIZE)).toBe(true);
  });

  it('stops at the ceiling, since Audius 400s beyond it', () => {
    expect(hasMoreSongs(SONGS_MAX_OFFSET)).toBe(false);
  });
});

describe('nextSongsOffset', () => {
  it('advances by one page', () => {
    expect(nextSongsOffset(0)).toBe(SONGS_PAGE_SIZE);
    expect(nextSongsOffset(150)).toBe(200);
  });
});

describe('putPageAt', () => {
  it('fills an empty slot', () => {
    expect(putPageAt<string[]>([], 0, ['a'])).toEqual([['a']]);
  });

  it('leaves gaps for pages not loaded yet', () => {
    const result = putPageAt<string[] | undefined>([], 2, ['c']);

    expect(result).toHaveLength(3);
    expect(result[2]).toEqual(['c']);
  });

  it('replaces a slot holding a different page', () => {
    expect(putPageAt([['a']], 0, ['b'])).toEqual([['b']]);
  });

  // the point of the helper: no new array means no re-render
  it('returns the same array when the slot already holds that page', () => {
    const page = ['a'];
    const pages = [page];

    expect(putPageAt(pages, 0, page)).toBe(pages);
  });

  it('does not mutate the input', () => {
    const pages = [['a']];
    const original = [...pages];

    putPageAt(pages, 1, ['b']);

    expect(pages).toEqual(original);
  });
});

describe('canLoadMoreSongs', () => {
  const ready = {hasScrolled: true, isFetching: false, offset: 0, requestedOffset: 0};

  it('allows loading once the user has scrolled', () => {
    expect(canLoadMoreSongs(ready)).toBe(true);
  });

  // FlatList reports "end reached" on mount, before any scrolling
  it('blocks the very first load until the user scrolls', () => {
    expect(canLoadMoreSongs({...ready, hasScrolled: false})).toBe(false);
  });

  it('blocks while a page is still in flight', () => {
    expect(canLoadMoreSongs({...ready, isFetching: true})).toBe(false);
  });

  // onEndReached fires repeatedly; without this a second call skips a page
  it('blocks when a further offset was already requested', () => {
    expect(canLoadMoreSongs({...ready, offset: 0, requestedOffset: 50})).toBe(false);
  });

  it('allows the next page once the requested offset caught up', () => {
    expect(canLoadMoreSongs({...ready, offset: 50, requestedOffset: 50})).toBe(true);
  });

  it('blocks at the Audius offset ceiling', () => {
    const atCeiling = {...ready, offset: SONGS_MAX_OFFSET, requestedOffset: SONGS_MAX_OFFSET};

    expect(canLoadMoreSongs(atCeiling)).toBe(false);
  });
});

describe('remainingSkeletonMs', () => {
  it('waits out the whole minimum when nothing has elapsed', () => {
    expect(remainingSkeletonMs(0)).toBe(SONGS_SKELETON_MIN_MS);
  });

  it('waits out only what is left', () => {
    expect(remainingSkeletonMs(300)).toBe(SONGS_SKELETON_MIN_MS - 300);
  });

  // a slow page has already outlasted the minimum, so it releases at once
  it('returns zero once the minimum has passed', () => {
    expect(remainingSkeletonMs(SONGS_SKELETON_MIN_MS)).toBe(0);
    expect(remainingSkeletonMs(SONGS_SKELETON_MIN_MS + 500)).toBe(0);
  });
});
