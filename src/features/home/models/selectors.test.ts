import {SONGS_MAX_OFFSET, SONGS_PAGE_SIZE} from './constants';
import {
  canLoadMoreSongs,
  hasMoreSongs,
  nextSongSort,
  nextSongsOffset,
  putPageAt,
  selectSortedSongs,
} from './selectors';
import type {Track} from '../../../domain/types';

const track = (id: string, title: string, durationSeconds: number): Track => ({
  id,
  title,
  artist: 'Someone',
  artworkUrl: '',
  durationSeconds,
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

  it('does not mutate the input', () => {
    const original = [...tracks];

    selectSortedSongs(tracks, {field: 'title', isAscending: true});

    expect(tracks).toEqual(original);
  });
});

describe('nextSongSort', () => {
  it('flips direction when the active field is tapped again', () => {
    const current = {field: 'title', isAscending: true} as const;

    expect(nextSongSort(current, 'title')).toEqual({field: 'title', isAscending: false});
  });

  it('flips back on a third tap', () => {
    const current = {field: 'title', isAscending: false} as const;

    expect(nextSongSort(current, 'title')).toEqual({field: 'title', isAscending: true});
  });

  it('starts a newly picked field ascending', () => {
    const current = {field: 'title', isAscending: false} as const;

    expect(nextSongSort(current, 'duration')).toEqual({field: 'duration', isAscending: true});
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
