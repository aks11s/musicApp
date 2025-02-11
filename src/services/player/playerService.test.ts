import type {Track} from '../../domain/types';

const mockPlayer = {
  setupPlayer: jest.fn(),
  updateOptions: jest.fn(),
  setQueue: jest.fn(),
  skip: jest.fn(),
  play: jest.fn(),
  reset: jest.fn(),
};
const mockGetTrackStreamUrl = jest.fn();

jest.mock('react-native-track-player', () => ({
  __esModule: true,
  default: mockPlayer,
  Capability: {Play: 'play', Pause: 'pause'},
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

  it('still rethrows the original error when reset fails too', async () => {
    mockPlayer.setupPlayer.mockRejectedValue(new Error('setup failed'));
    mockPlayer.reset.mockRejectedValue(new Error('player not initialized'));
    const {playQueue} = loadService();

    await expect(playQueue([makeTrack('a')], 0)).rejects.toThrow('setup failed');
  });
});
