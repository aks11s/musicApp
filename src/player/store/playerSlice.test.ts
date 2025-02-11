import type {Track} from '../../domain/types';
import {cleared, playerReducer, queueStarted} from './playerSlice';

const makeTrack = (id: string): Track => ({
  id,
  title: `Track ${id}`,
  artist: 'Artist',
  artworkUrl: '',
  durationSeconds: 180,
  releaseDate: '2024-01-01',
});

const tracks = [makeTrack('a'), makeTrack('b'), makeTrack('c')];

describe('playerSlice', () => {
  it('starts with an empty queue and no current track', () => {
    const state = playerReducer(undefined, {type: 'init'});

    expect(state).toEqual({queue: [], currentIndex: null});
  });

  it('replaces the queue and points at the start index', () => {
    const state = playerReducer(undefined, queueStarted({tracks, startIndex: 1}));

    expect(state.queue).toEqual(tracks);
    expect(state.currentIndex).toBe(1);
  });

  it('drops the previous queue when a new one starts', () => {
    const first = playerReducer(undefined, queueStarted({tracks, startIndex: 2}));
    const second = playerReducer(first, queueStarted({tracks: [makeTrack('x')], startIndex: 0}));

    expect(second.queue.map(track => track.id)).toEqual(['x']);
    expect(second.currentIndex).toBe(0);
  });

  it('clears the queue and the current index', () => {
    const playing = playerReducer(undefined, queueStarted({tracks, startIndex: 1}));
    const state = playerReducer(playing, cleared());

    expect(state).toEqual({queue: [], currentIndex: null});
  });
});
