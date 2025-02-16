import {act, renderHook} from '@testing-library/react-native';
import {reresolveAudiusHost} from '../../services/api/audiusHost';
import {onPlaybackError, reloadActiveTrack} from '../../services/player/playerService';
import {MAX_STREAM_RETRIES} from '../models/constants';
import {playbackFailed} from '../store/playerSlice';
import {useStreamRetry} from './useStreamRetry';

const mockDispatch = jest.fn();

jest.mock('../../app/hooks', () => ({
  useAppDispatch: () => mockDispatch,
}));

jest.mock('../../services/api/audiusHost', () => ({
  reresolveAudiusHost: jest.fn(),
}));

jest.mock('../../services/player/playerService', () => ({
  onPlaybackError: jest.fn(),
  reloadActiveTrack: jest.fn(),
}));

const mockOnPlaybackError = onPlaybackError as jest.Mock;
const mockReload = reloadActiveTrack as jest.Mock;
const mockReresolve = reresolveAudiusHost as jest.Mock;
const unsubscribe = jest.fn();

const emitError = async (message = 'stream failed') => {
  const listener = mockOnPlaybackError.mock.calls[0][0];
  listener(message);
  await act(async () => {
    jest.runOnlyPendingTimers();
  });
};

beforeEach(() => {
  jest.useFakeTimers();
  jest.clearAllMocks();
  mockOnPlaybackError.mockReturnValue(unsubscribe);
  mockReresolve.mockResolvedValue('https://api.audius.co');
  mockReload.mockResolvedValue(undefined);
});

afterEach(() => {
  jest.useRealTimers();
});

describe('useStreamRetry', () => {
  it('re-resolves the host and reloads the track after a stream error', async () => {
    renderHook(() => useStreamRetry());

    await emitError();

    expect(mockReresolve).toHaveBeenCalledTimes(1);
    expect(mockReload).toHaveBeenCalledTimes(1);
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('waits before retrying instead of reloading right away', () => {
    renderHook(() => useStreamRetry());

    mockOnPlaybackError.mock.calls[0][0]('stream failed');

    expect(mockReload).not.toHaveBeenCalled();
  });

  it('gives up and surfaces the error once the retries are used', async () => {
    renderHook(() => useStreamRetry());

    for (let i = 0; i < MAX_STREAM_RETRIES; i++) {
      await emitError();
    }
    await emitError('still broken');

    expect(mockReload).toHaveBeenCalledTimes(MAX_STREAM_RETRIES);
    expect(mockDispatch).toHaveBeenCalledWith(playbackFailed('still broken'));
  });

  it('surfaces a failed reload as a playback error', async () => {
    mockReload.mockRejectedValue(new Error('Network request failed'));
    renderHook(() => useStreamRetry());

    await emitError();

    expect(mockDispatch).toHaveBeenCalledWith(playbackFailed('Network request failed'));
  });

  it('unsubscribes on unmount', () => {
    const {unmount} = renderHook(() => useStreamRetry());

    unmount();

    expect(unsubscribe).toHaveBeenCalled();
  });
});
