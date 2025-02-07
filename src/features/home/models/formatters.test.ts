import {formatAlbumSubtitle, formatArtistStats, formatSongCount} from './formatters';
import type {Album, Artist} from '../../../domain/types';

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

const album = (releaseDate: string): Album => ({
  id: '1',
  title: 'Duende',
  artist: 'Lott',
  artworkUrl: '',
  trackCount: 4,
  releaseDate,
});

describe('formatAlbumSubtitle', () => {
  it('shows the artist and the release year', () => {
    expect(formatAlbumSubtitle(album('2022-03-11T00:00:00Z'))).toBe('Lott · 2022');
  });

  it('shows only the artist when the release date is missing', () => {
    expect(formatAlbumSubtitle(album(''))).toBe('Lott');
  });
});

describe('formatSongCount', () => {
  it('pluralises', () => {
    expect(formatSongCount(16)).toBe('16 songs');
  });

  it('uses the singular for one', () => {
    expect(formatSongCount(1)).toBe('1 song');
  });
});
