import {act, renderHook} from '@testing-library/react-native';
import type {Track} from '../../../domain/types';
import {useSuggestedViewModel} from './useSuggestedViewModel';

const mockPlayTracks = jest.fn();
let mockHistory: Track[] = [];
let mockListeners: Array<() => void> = [];
const mockUnsubscribe = jest.fn();

jest.mock('../../../services/api/tracks', () => ({
  useGetTrendingTracksQuery: () => ({data: undefined, isLoading: false, isError: false}),
  useGetUndergroundTracksQuery: () => ({data: undefined, isLoading: false, isError: false}),
}));
jest.mock('../../../services/api/users', () => ({
  useGetTopArtistsQuery: () => ({data: undefined, isLoading: false, isError: false}),
}));
jest.mock('../../../player/viewmodels/usePlayTracks', () => ({
  usePlayTracks: () => mockPlayTracks,
}));
jest.mock('../models/recentlyPlayed.repository', () => ({
  getRecentlyPlayed: () => mockHistory,
  subscribeRecentlyPlayed: (onChange: () => void) => {
    mockListeners.push(onChange);
    return () => {
      mockListeners = mockListeners.filter(listener => listener !== onChange);
      mockUnsubscribe();
    };
  },
}));

const track = (id: string): Track => ({
  id,
  title: `Track ${id}`,
  artist: 'Someone',
  artworkUrl: '',
  durationSeconds: 180,
  releaseDate: '2024-01-01T00:00:00Z',
});

// new array every time, like the repository does after a storage change
const changeHistory = (next: Track[]) => {
  act(() => {
    mockHistory = next;
    mockListeners.forEach(listener => listener());
  });
};

beforeEach(() => {
  mockHistory = [];
  mockListeners = [];
  mockPlayTracks.mockReset();
  mockUnsubscribe.mockReset();
});

describe('useSuggestedViewModel recently played', () => {
  it('starts with the stored history', () => {
    mockHistory = [track('a')];

    const {result} = renderHook(() => useSuggestedViewModel());

    expect(result.current.recentlyPlayed).toEqual([track('a')]);
    expect(result.current.hasRecentlyPlayed).toBe(true);
  });

  it('has no recently played section for an empty history', () => {
    const {result} = renderHook(() => useSuggestedViewModel());

    expect(result.current.recentlyPlayed).toEqual([]);
    expect(result.current.hasRecentlyPlayed).toBe(false);
  });

  it('shows a new play without remounting', () => {
    const {result} = renderHook(() => useSuggestedViewModel());

    changeHistory([track('b'), track('a')]);

    expect(result.current.recentlyPlayed.map(item => item.id)).toEqual(['b', 'a']);
    expect(result.current.hasRecentlyPlayed).toBe(true);
  });

  it('plays from the updated history after a change', () => {
    const {result} = renderHook(() => useSuggestedViewModel());
    changeHistory([track('b'), track('a')]);

    result.current.playRecentlyPlayed(1);

    expect(mockPlayTracks).toHaveBeenCalledWith([track('b'), track('a')], 1);
  });

  it('subscribes once and unsubscribes on unmount', () => {
    const {rerender, unmount} = renderHook(() => useSuggestedViewModel());
    rerender({});

    expect(mockListeners).toHaveLength(1);

    unmount();

    expect(mockUnsubscribe).toHaveBeenCalledTimes(1);
    expect(mockListeners).toHaveLength(0);
  });
});
