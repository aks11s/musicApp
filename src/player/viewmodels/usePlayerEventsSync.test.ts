import {renderHook} from '@testing-library/react-native';
import {onActiveTrackChanged, onStateChanged} from '../../services/player/playerService';
import {activeTrackChanged, statusChanged} from '../store/playerSlice';
import {usePlayerEventsSync} from './usePlayerEventsSync';

const mockDispatch = jest.fn();

jest.mock('../../app/hooks', () => ({
  useAppDispatch: () => mockDispatch,
}));

jest.mock('../../services/player/playerService', () => ({
  onStateChanged: jest.fn(),
  onActiveTrackChanged: jest.fn(),
}));

const mockOnStateChanged = onStateChanged as jest.Mock;
const mockOnActiveTrackChanged = onActiveTrackChanged as jest.Mock;

const unsubscribeState = jest.fn();
const unsubscribeTrack = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  mockOnStateChanged.mockReturnValue(unsubscribeState);
  mockOnActiveTrackChanged.mockReturnValue(unsubscribeTrack);
});

describe('usePlayerEventsSync', () => {
  it('forwards engine events into the slice', () => {
    renderHook(() => usePlayerEventsSync());

    mockOnStateChanged.mock.calls[0][0]('playing');
    mockOnActiveTrackChanged.mock.calls[0][0](3);

    expect(mockDispatch).toHaveBeenCalledWith(statusChanged('playing'));
    expect(mockDispatch).toHaveBeenCalledWith(activeTrackChanged(3));
  });

  it('unsubscribes from both events on unmount', () => {
    const {unmount} = renderHook(() => usePlayerEventsSync());

    unmount();

    expect(unsubscribeState).toHaveBeenCalledTimes(1);
    expect(unsubscribeTrack).toHaveBeenCalledTimes(1);
  });

  it('keeps one live subscription per event across remounts', () => {
    const first = renderHook(() => usePlayerEventsSync());
    first.unmount();
    renderHook(() => usePlayerEventsSync());

    const subscribed = mockOnStateChanged.mock.calls.length;
    const unsubscribed = unsubscribeState.mock.calls.length;
    expect(subscribed - unsubscribed).toBe(1);
  });
});
