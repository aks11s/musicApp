import TrackPlayer from 'react-native-track-player';

jest.mock('react-native-track-player', () => ({
  __esModule: true,
  default: {
    setupPlayer: jest.fn(),
    updateOptions: jest.fn(),
  },
  Capability: {Play: 'play', Pause: 'pause'},
}));

jest.mock('../api/tracks', () => ({
  getTrackStreamUrl: jest.fn(),
}));

const setupMock = TrackPlayer.setupPlayer as jest.Mock;

// setupPromise is module state, so every test gets a fresh copy of the service
const loadService = (): typeof import('./playerService') => {
  let service!: typeof import('./playerService');
  jest.isolateModules(() => {
    service = require('./playerService');
  });
  return service;
};

describe('setupPlayer', () => {
  beforeEach(() => {
    setupMock.mockReset();
    (TrackPlayer.updateOptions as jest.Mock).mockReset();
  });

  it('sets the native player up only once for concurrent calls', async () => {
    setupMock.mockResolvedValue(undefined);
    const {setupPlayer} = loadService();

    await Promise.all([setupPlayer(), setupPlayer(), setupPlayer()]);

    expect(setupMock).toHaveBeenCalledTimes(1);
  });

  it('treats an already initialized player as success', async () => {
    setupMock.mockRejectedValue({code: 'player_already_initialized'});
    const {setupPlayer} = loadService();

    await expect(setupPlayer()).resolves.toBeUndefined();
    expect(TrackPlayer.updateOptions).toHaveBeenCalled();
  });

  it('passes any other setup error through', async () => {
    setupMock.mockRejectedValue({code: 'android_cannot_setup_player_in_background'});
    const {setupPlayer} = loadService();

    await expect(setupPlayer()).rejects.toEqual({
      code: 'android_cannot_setup_player_in_background',
    });
  });

  it('tries again on the next call after a failed setup', async () => {
    setupMock.mockRejectedValueOnce({code: 'android_cannot_setup_player_in_background'});
    setupMock.mockResolvedValueOnce(undefined);
    const {setupPlayer} = loadService();

    await expect(setupPlayer()).rejects.toBeDefined();
    await expect(setupPlayer()).resolves.toBeUndefined();
    expect(setupMock).toHaveBeenCalledTimes(2);
  });
});
