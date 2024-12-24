import {SONGS_MAX_OFFSET, SONGS_PAGE_SIZE} from './constants';
import {
  selectNewTracks,
  hasMoreSongs,
  nextSongSort,
  nextSongsOffset,
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

describe('selectNewTracks', () => {
  const a = track('a', 'A', 10);
  const b = track('b', 'B', 20);
  const c = track('c', 'C', 30);

  it('returns tracks that are not there yet', () => {
    expect(selectNewTracks([a], [b, c]).map(t => t.id)).toEqual(['b', 'c']);
  });

  // RTK can replay merge for the same page
  it('drops incoming tracks already present', () => {
    expect(selectNewTracks([a, b], [b, c]).map(t => t.id)).toEqual(['c']);
  });

  it('returns nothing when the same page lands twice', () => {
    expect(selectNewTracks([a, b], [a, b])).toEqual([]);
  });

  it('keeps incoming order', () => {
    expect(selectNewTracks([a], [c, b]).map(t => t.id)).toEqual(['c', 'b']);
  });
});
