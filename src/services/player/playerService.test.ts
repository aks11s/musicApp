import type {Track} from '../../domain/types';

const mockPlayer = {
  setupPlayer: jest.fn(),
  updateOptions: jest.fn(),
  setQueue: jest.fn(),
  skip: jest.fn(),
  play: jest.fn(),
  reset: jest.fn(),
  getActiveTrackIndex: jest.fn(),
  getTrack: jest.fn(),
  getProgress: jest.fn(),
  load: jest.fn(),
  seekTo: jest.fn(),
};
const mockGetTrackStreamUrl = jest.fn();

jest.mock('react-native-track-player', () => ({
  __esModule: true,
  default: mockPlayer,
  Capability: {Play: 'play', Pause: 'pause', SkipToNext: 'skip-to-next', SkipToPrevious: 'skip-to-previous'},
}));

jest.mock('../api/tracks', () => ({
  getTrackStreamUrl: (id: string) => mockGetTrackStreamUrl(id),
}));

// setupPromise and the request counter are module state, so every test gets a fresh copy
const loadService = (): typeof import('./playerService') => {
  let service!: typeof import('./playerService');
  jest.isolateModules(() => {
    service = require('./playerService');
  });
  return service;
};

const makeTrack = (id: string): Track => ({
  id,
  title: `Track ${id}`,
  artist: 'Artist',
  artworkUrl: '',
  durationSeconds: 180,
  releaseDate: '2024-01-01',
});

const deferred = <T>() => {
  let resolve!: (value: T) => void;
  let reject!: (error: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return {promise, resolve, reject};
};

beforeEach(() => {
  Object.values(mockPlayer).forEach(fn => fn.mockReset().mockResolvedValue(undefined));
  mockGetTrackStreamUrl.mockReset().mockImplementation(async (id: string) => `https://node/${id}`);
});

describe('setupPlayer', () => {
  it('sets the native player up only once for concurrent calls', async () => {
    const {setupPlayer} = loadService();

    await Promise.all([setupPlayer(), setupPlayer(), setupPlayer()]);

    expect(mockPlayer.setupPlayer).toHaveBeenCalledTimes(1);
  });

  it('treats an already initialized player as success', async () => {
    mockPlayer.setupPlayer.mockRejectedValue({code: 'player_already_initialized'});
    const {setupPlayer} = loadService();

    await expect(setupPlayer()).resolves.toBeUndefined();
    expect(mockPlayer.updateOptions).toHaveBeenCalled();
  });

  it('passes any other setup error through', async () => {
    mockPlayer.setupPlayer.mockRejectedValue({code: 'android_cannot_setup_player_in_background'});
    const {setupPlayer} = loadService();

    await expect(setupPlayer()).rejects.toEqual({
      code: 'android_cannot_setup_player_in_background',
    });
  });

  it('tries again on the next call after a failed setup', async () => {
    mockPlayer.setupPlayer.mockRejectedValueOnce({code: 'android_cannot_setup_player_in_background'});
    const {setupPlayer} = loadService();

    await expect(setupPlayer()).rejects.toBeDefined();
    await expect(setupPlayer()).resolves.toBeUndefined();
    expect(mockPlayer.setupPlayer).toHaveBeenCalledTimes(2);
  });
});

describe('playQueue', () => {
  it('loads the queue, skips to the start index and plays', async () => {
    const {playQueue} = loadService();

    await playQueue([makeTrack('a'), makeTrack('b')], 1);

    expect(mockPlayer.setQueue).toHaveBeenCalledWith([
      expect.objectContaining({id: 'a', url: 'https://node/a'}),
      expect.objectContaining({id: 'b', url: 'https://node/b'}),
    ]);
    expect(mockPlayer.skip).toHaveBeenCalledWith(1);
    expect(mockPlayer.play).toHaveBeenCalled();
  });

  it('lets the latest tap win when an older one resolves last', async () => {
    const slowUrl = deferred<string>();
    mockGetTrackStreamUrl.mockImplementation((id: string) =>
      id === 'old' ? slowUrl.promise : Promise.resolve(`https://node/${id}`),
    );
    const {playQueue} = loadService();

    const older = playQueue([makeTrack('old')], 0);
    await playQueue([makeTrack('new')], 0);
    slowUrl.resolve('https://node/old');
    await older;

    expect(mockPlayer.setQueue).toHaveBeenCalledTimes(1);
    expect(mockPlayer.setQueue).toHaveBeenCalledWith([expect.objectContaining({id: 'new'})]);
  });

  it('swallows the failure of a tap that was already superseded', async () => {
    const slowUrl = deferred<string>();
    mockGetTrackStreamUrl.mockImplementation((id: string) =>
      id === 'old' ? slowUrl.promise : Promise.resolve(`https://node/${id}`),
    );
    const {playQueue} = loadService();

    const older = playQueue([makeTrack('old')], 0);
    await playQueue([makeTrack('new')], 0);
    slowUrl.reject(new Error('Network request failed'));

    await expect(older).resolves.toBeUndefined();
    expect(mockPlayer.reset).not.toHaveBeenCalled();
  });

  it('stops the previous queue and rethrows when the latest tap fails', async () => {
    mockGetTrackStreamUrl.mockRejectedValue(new Error('Network request failed'));
    const {playQueue} = loadService();

    await expect(playQueue([makeTrack('a')], 0)).rejects.toThrow('Network request failed');
    expect(mockPlayer.reset).toHaveBeenCalled();
    expect(mockPlayer.setQueue).not.toHaveBeenCalled();
  });

  it('does not start playing a tap that was still loading when stop was called', async () => {
    const slowUrl = deferred<string>();
    mockGetTrackStreamUrl.mockReturnValue(slowUrl.promise);
    const {playQueue, stop} = loadService();

    const pending = playQueue([makeTrack('a')], 0);
    await stop();
    slowUrl.resolve('https://node/a');
    await pending;

    expect(mockPlayer.setQueue).not.toHaveBeenCalled();
    expect(mockPlayer.play).not.toHaveBeenCalled();
  });

  it('still rethrows the original error when reset fails too', async () => {
    mockPlayer.setupPlayer.mockRejectedValue(new Error('setup failed'));
    mockPlayer.reset.mockRejectedValue(new Error('player not initialized'));
    const {playQueue} = loadService();

    await expect(playQueue([makeTrack('a')], 0)).rejects.toThrow('setup failed');
  });
});

describe('reloadActiveTrack', () => {
  const activeTrack = {id: 'a', url: 'https://node/a?old', title: 'Track a'};

  beforeEach(() => {
    mockPlayer.getActiveTrackIndex.mockResolvedValue(3);
    mockPlayer.getTrack.mockResolvedValue(activeTrack);
    mockPlayer.getProgress.mockResolvedValue({position: 42, duration: 180, buffered: 60});
    mockGetTrackStreamUrl.mockResolvedValue('https://node/a?fresh');
  });

  it('swaps in a fresh stream url and resumes where it stopped', async () => {
    const {reloadActiveTrack} = loadService();

    await reloadActiveTrack(true);

    expect(mockPlayer.getTrack).toHaveBeenCalledWith(3);
    expect(mockPlayer.load).toHaveBeenCalledWith({...activeTrack, url: 'https://node/a?fresh'});
    expect(mockPlayer.seekTo).toHaveBeenCalledWith(42);
    expect(mockPlayer.play).toHaveBeenCalled();
  });

  it('loads and seeks but stays paused when resume is false', async () => {
    const {reloadActiveTrack} = loadService();

    await reloadActiveTrack(false);

    expect(mockPlayer.load).toHaveBeenCalledWith({...activeTrack, url: 'https://node/a?fresh'});
    expect(mockPlayer.seekTo).toHaveBeenCalledWith(42);
    expect(mockPlayer.play).not.toHaveBeenCalled();
  });

  it('seeks only after the new url is loaded', async () => {
    const {reloadActiveTrack} = loadService();

    await reloadActiveTrack(true);

    const order = [mockPlayer.load, mockPlayer.seekTo, mockPlayer.play].map(
      fn => fn.mock.invocationCallOrder[0],
    );
    expect(order).toEqual([...order].sort((a, b) => a - b));
  });

  it('does nothing when no track is active', async () => {
    mockPlayer.getActiveTrackIndex.mockResolvedValue(undefined);
    const {reloadActiveTrack} = loadService();

    await reloadActiveTrack(true);

    expect(mockPlayer.load).not.toHaveBeenCalled();
    expect(mockPlayer.play).not.toHaveBeenCalled();
  });

  it('backs off when the user started something else meanwhile', async () => {
    const slowUrl = deferred<string>();
    mockGetTrackStreamUrl.mockReturnValueOnce(slowUrl.promise);
    const {reloadActiveTrack, stop} = loadService();

    const reload = reloadActiveTrack(true);
    await new Promise(resolve => setImmediate(resolve));
    expect(mockGetTrackStreamUrl).toHaveBeenCalled();
    await stop();
    slowUrl.resolve('https://node/a?fresh');
    await reload;

    expect(mockPlayer.load).not.toHaveBeenCalled();
    expect(mockPlayer.play).not.toHaveBeenCalled();
  });
});
