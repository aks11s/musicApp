import {configureStore} from '@reduxjs/toolkit';
import type {Track} from '../domain/types';
import {RECENTLY_PLAYED_MIN_MS} from '../features/home/models/constants';
import {activeTrackChanged, playerReducer, queueStarted} from '../player/store/playerSlice';

const mockAddRecentlyPlayed = jest.fn();

jest.mock('../features/home/models/recentlyPlayed.repository', () => ({
  addRecentlyPlayed: (track: unknown) => mockAddRecentlyPlayed(track),
}));

const makeTrack = (id: string): Track => ({
  id,
  title: `Track ${id}`,
  artist: 'Someone',
  artworkUrl: `https://example.test/${id}.jpg`,
  durationSeconds: 180,
  releaseDate: '2024-01-01T00:00:00Z',
});

const tracks = [makeTrack('a'), makeTrack('b'), makeTrack('c')];

// the middleware is module state, so every test gets a fresh one
const makeStore = () => {
  let listenerMiddleware!: typeof import('./listeners').listenerMiddleware;
  jest.isolateModules(() => {
    listenerMiddleware = require('./listeners').listenerMiddleware;
  });
  return configureStore({
    reducer: {player: playerReducer},
    middleware: getDefault => getDefault().prepend(listenerMiddleware.middleware),
  });
};

describe('recently played listener', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockAddRecentlyPlayed.mockReset();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('records a track reached by next or auto-advance once it stayed long enough', async () => {
    const store = makeStore();
    store.dispatch(queueStarted({tracks, startIndex: 0}));

    store.dispatch(activeTrackChanged(1));
    await jest.advanceTimersByTimeAsync(RECENTLY_PLAYED_MIN_MS);

    expect(mockAddRecentlyPlayed).toHaveBeenCalledTimes(1);
    expect(mockAddRecentlyPlayed).toHaveBeenCalledWith(tracks[1]);
  });

  it('records nothing before the delay has passed', async () => {
    const store = makeStore();
    store.dispatch(queueStarted({tracks, startIndex: 0}));

    store.dispatch(activeTrackChanged(1));
    await jest.advanceTimersByTimeAsync(RECENTLY_PLAYED_MIN_MS - 1);

    expect(mockAddRecentlyPlayed).not.toHaveBeenCalled();
  });

  it('records only the last track when the user skips through several quickly', async () => {
    const store = makeStore();
    store.dispatch(queueStarted({tracks, startIndex: 0}));

    store.dispatch(activeTrackChanged(1));
    await jest.advanceTimersByTimeAsync(RECENTLY_PLAYED_MIN_MS - 500);
    store.dispatch(activeTrackChanged(2));
    await jest.advanceTimersByTimeAsync(RECENTLY_PLAYED_MIN_MS * 2);

    expect(mockAddRecentlyPlayed).toHaveBeenCalledTimes(1);
    expect(mockAddRecentlyPlayed).toHaveBeenCalledWith(tracks[2]);
  });

  it('restarts the delay for the new track after a switch', async () => {
    const store = makeStore();
    store.dispatch(queueStarted({tracks, startIndex: 0}));

    store.dispatch(activeTrackChanged(1));
    await jest.advanceTimersByTimeAsync(RECENTLY_PLAYED_MIN_MS - 500);
    store.dispatch(activeTrackChanged(2));
    await jest.advanceTimersByTimeAsync(RECENTLY_PLAYED_MIN_MS - 1);

    expect(mockAddRecentlyPlayed).not.toHaveBeenCalled();

    await jest.advanceTimersByTimeAsync(1);

    expect(mockAddRecentlyPlayed).toHaveBeenCalledWith(tracks[2]);
  });

  it('records each track that stays on long enough, one after another', async () => {
    const store = makeStore();
    store.dispatch(queueStarted({tracks, startIndex: 0}));

    store.dispatch(activeTrackChanged(1));
    await jest.advanceTimersByTimeAsync(RECENTLY_PLAYED_MIN_MS);
    store.dispatch(activeTrackChanged(2));
    await jest.advanceTimersByTimeAsync(RECENTLY_PLAYED_MIN_MS);

    expect(mockAddRecentlyPlayed.mock.calls).toEqual([[tracks[1]], [tracks[2]]]);
  });

  it('ignores activeTrackChanged(null)', async () => {
    const store = makeStore();
    store.dispatch(queueStarted({tracks, startIndex: 0}));

    store.dispatch(activeTrackChanged(null));
    await jest.advanceTimersByTimeAsync(RECENTLY_PLAYED_MIN_MS * 2);

    expect(mockAddRecentlyPlayed).not.toHaveBeenCalled();
  });

  it('does not cancel a pending record when the engine reports null', async () => {
    const store = makeStore();
    store.dispatch(queueStarted({tracks, startIndex: 0}));

    store.dispatch(activeTrackChanged(1));
    await jest.advanceTimersByTimeAsync(RECENTLY_PLAYED_MIN_MS - 500);
    store.dispatch(activeTrackChanged(null));
    await jest.advanceTimersByTimeAsync(500);

    expect(mockAddRecentlyPlayed).toHaveBeenCalledWith(tracks[1]);
  });

  it('records nothing for queueStarted alone, before the engine reports a track', async () => {
    const store = makeStore();

    store.dispatch(queueStarted({tracks, startIndex: 1}));
    await jest.advanceTimersByTimeAsync(RECENTLY_PLAYED_MIN_MS * 2);

    expect(mockAddRecentlyPlayed).not.toHaveBeenCalled();
  });

  it('records nothing when the queue has no track at the reported index', async () => {
    const store = makeStore();

    store.dispatch(activeTrackChanged(0));
    await jest.advanceTimersByTimeAsync(RECENTLY_PLAYED_MIN_MS * 2);

    expect(mockAddRecentlyPlayed).not.toHaveBeenCalled();
  });
});
