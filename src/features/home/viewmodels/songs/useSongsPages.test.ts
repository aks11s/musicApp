import {act, renderHook} from '@testing-library/react-native';
import type {Track} from '../../../../domain/types';
import {useGetTrendingTracksPageQuery} from '../../../../services/api/tracks';
import {SONGS_MAX_OFFSET, SONGS_PAGE_SIZE} from '../../models/constants';
import {useSongsPages} from './useSongsPages';

jest.mock('../../../../services/api/tracks', () => ({
  useGetTrendingTracksPageQuery: jest.fn(),
}));

const mockQuery = useGetTrendingTracksPageQuery as jest.Mock;

const track = (id: string): Track => ({
  id,
  title: `Track ${id}`,
  artist: 'Someone',
  artworkUrl: '',
  durationSeconds: 180,
  releaseDate: '2024-01-01T00:00:00Z',
});

const page = (offset: number): Track[] =>
  Array.from({length: SONGS_PAGE_SIZE}, (_, i) => track(String(offset + i)));

const pagesByOffset = new Map<number, Track[]>();
const pageAt = (offset: number): Track[] => {
  if (!pagesByOffset.has(offset)) {
    pagesByOffset.set(offset, page(offset));
  }
  return pagesByOffset.get(offset)!;
};

const loadedResponse = (offset: number) => ({
  data: pageAt(offset),
  isLoading: false,
  isFetching: false,
  isError: false,
});

const fetchingResponse = {
  data: undefined,
  isLoading: false,
  isFetching: true,
  isError: false,
};

const requestedOffsets = (): number[] =>
  mockQuery.mock.calls.map(([args]) => args.offset);

beforeEach(() => {
  pagesByOffset.clear();
  mockQuery.mockReset();
  mockQuery.mockImplementation(({offset}) => loadedResponse(offset));
});

describe('useSongsPages', () => {
  it('loads the first page on mount', () => {
    const {result} = renderHook(() => useSongsPages());

    expect(result.current.loaded).toHaveLength(SONGS_PAGE_SIZE);
    expect(requestedOffsets()).toEqual(expect.arrayContaining([0]));
  });

  // onEndReached used to fire on mount and pull page two before any scroll
  it('ignores loadMore until the list has been scrolled', () => {
    const {result} = renderHook(() => useSongsPages());

    act(() => result.current.loadMore());

    expect(new Set(requestedOffsets())).toEqual(new Set([0]));
  });

  it('appends the next page after a scroll', () => {
    const {result} = renderHook(() => useSongsPages());

    act(() => result.current.allowLoadMore());
    act(() => result.current.loadMore());

    expect(requestedOffsets()).toContain(SONGS_PAGE_SIZE);
    expect(result.current.loaded).toHaveLength(SONGS_PAGE_SIZE * 2);
  });

  it('ignores loadMore while a page is in flight', () => {
    mockQuery.mockImplementation(() => fetchingResponse);
    const {result} = renderHook(() => useSongsPages());

    act(() => result.current.allowLoadMore());
    act(() => result.current.loadMore());

    expect(new Set(requestedOffsets())).toEqual(new Set([0]));
  });

  it('stops at the API offset ceiling', () => {
    const {result} = renderHook(() => useSongsPages());
    act(() => result.current.allowLoadMore());

    for (let offset = 0; offset < SONGS_MAX_OFFSET; offset += SONGS_PAGE_SIZE) {
      act(() => result.current.loadMore());
    }
    expect(result.current.hasMore).toBe(false);

    act(() => result.current.loadMore());

    expect(Math.max(...requestedOffsets())).toBe(SONGS_MAX_OFFSET);
    expect(result.current.loaded).toHaveLength(SONGS_MAX_OFFSET + SONGS_PAGE_SIZE);
  });

  it('drops tracks that repeat across pages', () => {
    const repeated = page(0);
    pagesByOffset.set(SONGS_PAGE_SIZE, repeated.slice(0, 10));
    const {result} = renderHook(() => useSongsPages());

    act(() => result.current.allowLoadMore());
    act(() => result.current.loadMore());

    expect(result.current.loaded).toHaveLength(SONGS_PAGE_SIZE);
  });
});
