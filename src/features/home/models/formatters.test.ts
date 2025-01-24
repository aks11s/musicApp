import {formatArtistStats} from './formatters';
import type {Artist} from '../../../domain/types';

const artist = (albumCount: number, trackCount: number): Artist => ({
  id: '1',
  name: 'Someone',
  handle: 'someone',
  avatarUrl: '',
  followerCount: 100,
  albumCount,
  trackCount,
});

describe('formatArtistStats', () => {
  it('shows albums and songs', () => {
    expect(formatArtistStats(artist(2, 24))).toBe('2 Albums · 24 Songs');
  });

  it('uses the singular for one', () => {
    expect(formatArtistStats(artist(1, 1))).toBe('1 Album · 1 Song');
  });

  it('drops the album part when there are none', () => {
    expect(formatArtistStats(artist(0, 39))).toBe('39 Songs');
  });
});
