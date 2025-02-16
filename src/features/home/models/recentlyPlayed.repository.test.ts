import {RECENTLY_PLAYED_LIMIT} from './constants';
import type {Track} from '../../../domain/types';

const mockRead = jest.fn();
const mockWrite = jest.fn();
const mockSubscribe = jest.fn();

jest.mock('../../../persistentStorage/recentlyPlayed.storage', () => ({
  readRecentlyPlayed: () => mockRead(),
  writeRecentlyPlayed: (items: unknown) => mockWrite(items),
  subscribeRecentlyPlayed: (onChange: () => void) => mockSubscribe(onChange),
}));

// the history cache is module state, so every test gets a fresh copy
const loadRepository = (): typeof import('./recentlyPlayed.repository') => {
  let repository!: typeof import('./recentlyPlayed.repository');
  jest.isolateModules(() => {
    repository = require('./recentlyPlayed.repository');
  });
  return repository;
};

const makeTrack = (id: string): Track => ({
  id,
  title: `Track ${id}`,
  artist: 'Someone',
  artworkUrl: `https://example.test/${id}.jpg`,
  durationSeconds: 180,
  releaseDate: '2024-01-01T00:00:00Z',
});

const writtenHistory = (): Track[] => mockWrite.mock.calls[0][0] as Track[];

beforeEach(() => {
  mockRead.mockReset().mockReturnValue([]);
  mockWrite.mockReset();
  mockSubscribe.mockReset().mockReturnValue(() => {});
});

describe('getRecentlyPlayed', () => {
  it('returns what storage holds', () => {
    const history = [makeTrack('a')];
    mockRead.mockReturnValue(history);
    const {getRecentlyPlayed} = loadRepository();

    expect(getRecentlyPlayed()).toEqual(history);
  });

  it('returns an empty history when storage is empty', () => {
    const {getRecentlyPlayed} = loadRepository();

    expect(getRecentlyPlayed()).toEqual([]);
  });

  it('returns the same array and reads storage once while nothing changed', () => {
    mockRead.mockImplementation(() => [makeTrack('a')]);
    const {getRecentlyPlayed} = loadRepository();

    const first = getRecentlyPlayed();
    const second = getRecentlyPlayed();

    expect(second).toBe(first);
    expect(mockRead).toHaveBeenCalledTimes(1);
  });

  it('caches an empty history too', () => {
    mockRead.mockImplementation(() => []);
    const {getRecentlyPlayed} = loadRepository();

    expect(getRecentlyPlayed()).toBe(getRecentlyPlayed());
    expect(mockRead).toHaveBeenCalledTimes(1);
  });
});

describe('subscribeRecentlyPlayed', () => {
  const notifyStorageChange = () => mockSubscribe.mock.calls[0][0]();

  it('re-reads storage after a change and tells the subscriber', () => {
    mockRead.mockReturnValueOnce([makeTrack('a')]).mockReturnValueOnce([makeTrack('b'), makeTrack('a')]);
    const {getRecentlyPlayed, subscribeRecentlyPlayed} = loadRepository();
    const onChange = jest.fn();
    subscribeRecentlyPlayed(onChange);
    const before = getRecentlyPlayed();

    notifyStorageChange();

    expect(onChange).toHaveBeenCalledTimes(1);
    const after = getRecentlyPlayed();
    expect(after).not.toBe(before);
    expect(after.map(track => track.id)).toEqual(['b', 'a']);
  });

  it('has dropped the cache by the time the subscriber is called', () => {
    mockRead.mockReturnValueOnce([makeTrack('a')]).mockReturnValueOnce([makeTrack('b')]);
    const {getRecentlyPlayed, subscribeRecentlyPlayed} = loadRepository();
    getRecentlyPlayed();
    let seenInCallback: Track[] = [];
    subscribeRecentlyPlayed(() => {
      seenInCallback = getRecentlyPlayed();
    });

    notifyStorageChange();

    expect(seenInCallback.map(track => track.id)).toEqual(['b']);
  });

  it('keeps serving the cached array when storage has not changed', () => {
    const {getRecentlyPlayed, subscribeRecentlyPlayed} = loadRepository();
    subscribeRecentlyPlayed(jest.fn());
    const first = getRecentlyPlayed();

    expect(getRecentlyPlayed()).toBe(first);
    expect(mockRead).toHaveBeenCalledTimes(1);
  });

  it('re-reads again after every change, not only the first', () => {
    mockRead.mockImplementation(() => [makeTrack('a')]);
    const {getRecentlyPlayed, subscribeRecentlyPlayed} = loadRepository();
    subscribeRecentlyPlayed(jest.fn());

    getRecentlyPlayed();
    notifyStorageChange();
    getRecentlyPlayed();
    notifyStorageChange();
    getRecentlyPlayed();

    expect(mockRead).toHaveBeenCalledTimes(3);
  });

  it('returns the storage unsubscribe function', () => {
    const unsubscribe = jest.fn();
    mockSubscribe.mockReturnValue(unsubscribe);
    const {subscribeRecentlyPlayed} = loadRepository();

    expect(subscribeRecentlyPlayed(jest.fn())).toBe(unsubscribe);
  });
});

describe('addRecentlyPlayed', () => {
  it('puts the newest track first', () => {
    mockRead.mockReturnValue([makeTrack('b'), makeTrack('a')]);
    const {addRecentlyPlayed} = loadRepository();

    addRecentlyPlayed(makeTrack('c'));

    expect(writtenHistory().map(track => track.id)).toEqual(['c', 'b', 'a']);
  });

  it('moves a replayed track to the front instead of duplicating it', () => {
    mockRead.mockReturnValue([makeTrack('c'), makeTrack('b'), makeTrack('a')]);
    const {addRecentlyPlayed} = loadRepository();

    addRecentlyPlayed(makeTrack('a'));

    expect(writtenHistory().map(track => track.id)).toEqual(['a', 'c', 'b']);
  });

  it('drops the oldest entries once the limit is reached', () => {
    const full = Array.from({length: RECENTLY_PLAYED_LIMIT}, (_, index) =>
      makeTrack(`old-${index}`),
    );
    mockRead.mockReturnValue(full);
    const {addRecentlyPlayed} = loadRepository();

    addRecentlyPlayed(makeTrack('new'));

    const written = writtenHistory();
    expect(written).toHaveLength(RECENTLY_PLAYED_LIMIT);
    expect(written[0].id).toBe('new');
    expect(written.map(track => track.id)).not.toContain(`old-${RECENTLY_PLAYED_LIMIT - 1}`);
  });

  it('stores the full track snapshot so the row renders without the network', () => {
    const track = makeTrack('a');
    const {addRecentlyPlayed} = loadRepository();

    addRecentlyPlayed(track);

    expect(writtenHistory()[0]).toEqual(track);
  });

  it('makes the next get re-read storage', () => {
    mockRead.mockReturnValueOnce([makeTrack('a')]).mockReturnValueOnce([makeTrack('b'), makeTrack('a')]);
    const {addRecentlyPlayed, getRecentlyPlayed} = loadRepository();
    const before = getRecentlyPlayed();

    addRecentlyPlayed(makeTrack('b'));
    const after = getRecentlyPlayed();

    expect(after).not.toBe(before);
    expect(mockRead).toHaveBeenCalledTimes(2);
  });

  it('builds on the latest history when added twice in a row', () => {
    mockRead.mockReturnValueOnce([]).mockReturnValueOnce([makeTrack('a')]);
    const {addRecentlyPlayed} = loadRepository();

    addRecentlyPlayed(makeTrack('a'));
    addRecentlyPlayed(makeTrack('b'));

    expect(mockWrite.mock.calls[1][0].map((track: Track) => track.id)).toEqual(['b', 'a']);
  });

  it('drops the cache before writing, so a synchronous change callback sees fresh data', () => {
    mockRead.mockReturnValueOnce([makeTrack('a')]).mockReturnValueOnce([makeTrack('b'), makeTrack('a')]);
    const {addRecentlyPlayed, getRecentlyPlayed} = loadRepository();
    getRecentlyPlayed();
    let readDuringWrite: Track[] = [];
    mockWrite.mockImplementation(() => {
      readDuringWrite = getRecentlyPlayed();
    });

    addRecentlyPlayed(makeTrack('b'));

    expect(readDuringWrite.map(track => track.id)).toEqual(['b', 'a']);
  });
});
