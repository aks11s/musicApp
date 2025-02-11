import {act, renderHook} from '@testing-library/react-native';
import type {Track} from '../../../../domain/types';
import {usePlayTracks} from '../../../../player/viewmodels/usePlayTracks';
import {useSongsPages} from './useSongsPages';
import {useSongsViewModel} from './useSongsViewModel';

jest.mock('./useSongsPages', () => ({
  useSongsPages: jest.fn(),
}));

jest.mock('../../../../player/viewmodels/usePlayTracks', () => ({
  usePlayTracks: jest.fn(),
}));

const mockPlayTracks = jest.fn();

const track = (id: string, title: string): Track => ({
  id,
  title,
  artist: 'Someone',
  artworkUrl: '',
  durationSeconds: 180,
  releaseDate: '2024-01-01T00:00:00Z',
});

// API order, deliberately not alphabetical
const loaded = [track('b', 'Banana'), track('c', 'Cherry'), track('a', 'Apple')];

beforeEach(() => {
  mockPlayTracks.mockReset();
  (usePlayTracks as jest.Mock).mockReturnValue(mockPlayTracks);
  (useSongsPages as jest.Mock).mockReturnValue({
    loaded,
    isLoading: false,
    isFetching: false,
    isError: false,
    hasMore: false,
    loadMore: jest.fn(),
    allowLoadMore: jest.fn(),
  });
});

describe('useSongsViewModel playSong', () => {
  it('plays the row the user sees, not the one at that index in API order', () => {
    const {result} = renderHook(() => useSongsViewModel());

    act(() => result.current.playSong(0));

    const [queue, startIndex] = mockPlayTracks.mock.calls[0];
    expect(queue[startIndex].title).toBe('Apple');
  });

  it('queues the list in the order it is shown', () => {
    const {result} = renderHook(() => useSongsViewModel());

    act(() => result.current.playSong(1));

    const [queue] = mockPlayTracks.mock.calls[0];
    expect(queue).toEqual(result.current.songs);
  });

  it('follows a changed sort', () => {
    const {result} = renderHook(() => useSongsViewModel());

    act(() => result.current.toggleSortDirection());
    act(() => result.current.playSong(0));

    const [queue, startIndex] = mockPlayTracks.mock.calls[0];
    expect(queue[startIndex].title).toBe('Cherry');
  });
});
