import {act, renderHook} from '@testing-library/react-native';
import type {Track} from '../../domain/types';
import {reresolveAudiusHost} from '../../services/api/audiusHost';
import {onPlaybackError, reloadActiveTrack} from '../../services/player/playerService';
import {MAX_STREAM_RETRIES} from '../models/constants';
import {playbackFailed} from '../store/playerSlice';
import {useStreamRetry} from './useStreamRetry';

const mockDispatch = jest.fn();
const mockPlayerState: {queue: Track[]; currentIndex: number | null; status: string} = {
  queue: [],
  currentIndex: null,
  status: 'idle',
};

jest.mock('../../app/hooks', () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: (selector: (state: unknown) => unknown) => selector({player: mockPlayerState}),
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

const raiseError = (message = 'stream failed') => {
  mockOnPlaybackError.mock.calls[0][0](message);
};

const fireTimers = async () => {
  await act(async () => {
    jest.runOnlyPendingTimers();
  });
};

const exhaustRetries = async () => {
  for (let i = 0; i < MAX_STREAM_RETRIES; i++) {
    await emitError();
  }
};

beforeEach(() => {
  jest.useFakeTimers();
  jest.clearAllMocks();
  mockPlayerState.queue = [];
  mockPlayerState.currentIndex = 0;
  mockPlayerState.status = 'idle';
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

  it('gives the next track a fresh set of retries when currentIndex changes', async () => {
    const {rerender} = renderHook(() => useStreamRetry());
    await exhaustRetries();

    mockPlayerState.currentIndex = 1;
    rerender({});
    await emitError();

    expect(mockReload).toHaveBeenCalledTimes(MAX_STREAM_RETRIES + 1);
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('gives a new queue a fresh set of retries even when the index stays the same', async () => {
    const {rerender} = renderHook(() => useStreamRetry());
    await exhaustRetries();

    mockPlayerState.queue = [];
    rerender({});
    await emitError();

    expect(mockReload).toHaveBeenCalledTimes(MAX_STREAM_RETRIES + 1);
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('keeps counting when a rerender leaves queue and currentIndex untouched', async () => {
    const {rerender} = renderHook(() => useStreamRetry());
    await exhaustRetries();

    rerender({});
    await emitError('still broken');

    expect(mockReload).toHaveBeenCalledTimes(MAX_STREAM_RETRIES);
    expect(mockDispatch).toHaveBeenCalledWith(playbackFailed('still broken'));
  });

  it('still runs out of retries on the new track after a reset', async () => {
    const {rerender} = renderHook(() => useStreamRetry());
    await exhaustRetries();

    mockPlayerState.currentIndex = 1;
    rerender({});
    await exhaustRetries();
    await emitError('still broken');

    expect(mockReload).toHaveBeenCalledTimes(MAX_STREAM_RETRIES * 2);
    expect(mockDispatch).toHaveBeenCalledWith(playbackFailed('still broken'));
  });

  it('gives the next error a fresh retry once playback is playing again', async () => {
    const {rerender} = renderHook(() => useStreamRetry());
    await exhaustRetries();

    mockPlayerState.status = 'playing';
    rerender({});
    await emitError();

    expect(mockReload).toHaveBeenCalledTimes(MAX_STREAM_RETRIES + 1);
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('survives repeated stalls on one track as long as playback recovers in between', async () => {
    mockPlayerState.status = 'playing';
    const {rerender} = renderHook(() => useStreamRetry());

    for (let stall = 0; stall < MAX_STREAM_RETRIES + 2; stall++) {
      mockPlayerState.status = 'buffering';
      rerender({});
      await emitError();
      mockPlayerState.status = 'playing';
      rerender({});
    }

    expect(mockReload).toHaveBeenCalledTimes(MAX_STREAM_RETRIES + 2);
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('still runs out of retries after a recovery', async () => {
    const {rerender} = renderHook(() => useStreamRetry());
    mockPlayerState.status = 'playing';
    rerender({});
    await exhaustRetries();

    await emitError('still broken');

    expect(mockReload).toHaveBeenCalledTimes(MAX_STREAM_RETRIES);
    expect(mockDispatch).toHaveBeenCalledWith(playbackFailed('still broken'));
  });

  it.each(['buffering', 'paused'])('does not reset the retries when status goes to %s', async status => {
    mockPlayerState.status = 'playing';
    const {rerender} = renderHook(() => useStreamRetry());
    await exhaustRetries();

    mockPlayerState.status = status;
    rerender({});
    await emitError('still broken');

    expect(mockReload).toHaveBeenCalledTimes(MAX_STREAM_RETRIES);
    expect(mockDispatch).toHaveBeenCalledWith(playbackFailed('still broken'));
  });

  it('does not reset on every render while status stays playing', async () => {
    mockPlayerState.status = 'playing';
    const {rerender} = renderHook(() => useStreamRetry());
    await exhaustRetries();

    rerender({});
    rerender({});
    await emitError('still broken');

    expect(mockReload).toHaveBeenCalledTimes(MAX_STREAM_RETRIES);
    expect(mockDispatch).toHaveBeenCalledWith(playbackFailed('still broken'));
  });

  it('reloads with resume when the status is not paused at timer time', async () => {
    mockPlayerState.status = 'buffering';
    renderHook(() => useStreamRetry());

    await emitError();

    expect(mockReload).toHaveBeenCalledWith(true);
  });

  it('reloads without resume when the user paused during the retry window', async () => {
    mockPlayerState.status = 'playing';
    const {rerender} = renderHook(() => useStreamRetry());

    raiseError();
    mockPlayerState.status = 'paused';
    rerender({});
    await fireTimers();

    expect(mockReload).toHaveBeenCalledTimes(1);
    expect(mockReload).toHaveBeenCalledWith(false);
  });

  it('reloads with resume when the user resumed during the retry window', async () => {
    mockPlayerState.status = 'paused';
    const {rerender} = renderHook(() => useStreamRetry());

    raiseError();
    mockPlayerState.status = 'buffering';
    rerender({});
    await fireTimers();

    expect(mockReload).toHaveBeenCalledWith(true);
  });

  it('reloads only once when a second error arrives before the timer fires', async () => {
    renderHook(() => useStreamRetry());

    raiseError();
    raiseError();
    await fireTimers();

    expect(mockReresolve).toHaveBeenCalledTimes(1);
    expect(mockReload).toHaveBeenCalledTimes(1);
  });

  it('drops a pending retry when currentIndex changes', async () => {
    const {rerender} = renderHook(() => useStreamRetry());

    raiseError();
    mockPlayerState.currentIndex = 1;
    rerender({});
    await fireTimers();

    expect(mockReresolve).not.toHaveBeenCalled();
    expect(mockReload).not.toHaveBeenCalled();
  });

  it('drops a pending retry when the queue changes', async () => {
    const {rerender} = renderHook(() => useStreamRetry());

    raiseError();
    mockPlayerState.queue = [];
    rerender({});
    await fireTimers();

    expect(mockReresolve).not.toHaveBeenCalled();
    expect(mockReload).not.toHaveBeenCalled();
  });

  it('keeps a pending retry across a rerender that changes nothing', async () => {
    const {rerender} = renderHook(() => useStreamRetry());

    raiseError();
    rerender({});
    await fireTimers();

    expect(mockReload).toHaveBeenCalledTimes(1);
  });

  it('retries an error that comes after the pending one was dropped', async () => {
    const {rerender} = renderHook(() => useStreamRetry());

    raiseError();
    mockPlayerState.currentIndex = 1;
    rerender({});
    await emitError();

    expect(mockReload).toHaveBeenCalledTimes(1);
  });

  it('drops a pending retry on unmount', async () => {
    const {unmount} = renderHook(() => useStreamRetry());

    raiseError();
    unmount();
    await fireTimers();

    expect(mockReload).not.toHaveBeenCalled();
  });
});
