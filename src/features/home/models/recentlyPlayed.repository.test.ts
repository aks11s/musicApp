import {addRecentlyPlayed, getRecentlyPlayed} from './recentlyPlayed.repository';
import {readRecentlyPlayed, writeRecentlyPlayed} from '../../../persistentStorage/recentlyPlayed.storage';
import {RECENTLY_PLAYED_LIMIT} from './constants';
import type {Track} from './types';

jest.mock('../../../persistentStorage/recentlyPlayed.storage');

const mockRead = readRecentlyPlayed as jest.MockedFunction<typeof readRecentlyPlayed>;
const mockWrite = writeRecentlyPlayed as jest.MockedFunction<typeof writeRecentlyPlayed>;

const makeTrack = (id: string): Track => ({
  id,
  title: `Track ${id}`,
  artist: 'Someone',
  artworkUrl: `https://example.test/${id}.jpg`,
  durationSeconds: 180,
});

const writtenHistory = (): Track[] => mockWrite.mock.calls[0][0] as Track[];

beforeEach(() => {
  jest.resetAllMocks();
  mockRead.mockReturnValue([]);
});

describe('getRecentlyPlayed', () => {
  it('returns what storage holds', () => {
    const history = [makeTrack('a')];
    mockRead.mockReturnValue(history);

    expect(getRecentlyPlayed()).toEqual(history);
  });

  it('returns an empty history when storage is empty', () => {
    expect(getRecentlyPlayed()).toEqual([]);
  });
});

describe('addRecentlyPlayed', () => {
  it('puts the newest track first', () => {
    mockRead.mockReturnValue([makeTrack('b'), makeTrack('a')]);

    addRecentlyPlayed(makeTrack('c'));

    expect(writtenHistory().map(track => track.id)).toEqual(['c', 'b', 'a']);
  });

  it('moves a replayed track to the front instead of duplicating it', () => {
    mockRead.mockReturnValue([makeTrack('c'), makeTrack('b'), makeTrack('a')]);

    addRecentlyPlayed(makeTrack('a'));

    expect(writtenHistory().map(track => track.id)).toEqual(['a', 'c', 'b']);
  });

  it('drops the oldest entries once the limit is reached', () => {
    const full = Array.from({length: RECENTLY_PLAYED_LIMIT}, (_, index) =>
      makeTrack(`old-${index}`),
    );
    mockRead.mockReturnValue(full);

    addRecentlyPlayed(makeTrack('new'));

    const written = writtenHistory();
    expect(written).toHaveLength(RECENTLY_PLAYED_LIMIT);
    expect(written[0].id).toBe('new');
    expect(written.map(track => track.id)).not.toContain(`old-${RECENTLY_PLAYED_LIMIT - 1}`);
  });

  it('stores the full track snapshot so the row renders without the network', () => {
    const track = makeTrack('a');

    addRecentlyPlayed(track);

    expect(writtenHistory()[0]).toEqual(track);
  });
});
