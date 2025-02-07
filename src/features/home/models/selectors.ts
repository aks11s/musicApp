import {SONGS_MAX_OFFSET, SONGS_PAGE_SIZE} from './constants';
import type {Album, Artist, Track} from '../../../domain/types';
import {
  byIsoDate,
  byNumber,
  byText,
  type Compare,
  sortBy,
} from '../../../shared/lib/sort';
import type {
  AlbumSort,
  AlbumSortField,
  ArtistSort,
  ArtistSortField,
  SongSort,
  SongSortField,
  SongsLoadState,
} from './types';

export const selectMostPopularArtists = (artists: Artist[], limit: number): Artist[] =>
  [...artists].sort((a, b) => b.followerCount - a.followerCount).slice(0, limit);

const songComparators: Record<SongSortField, Compare<Track>> = {
  title: byText(track => track.title),
  artist: byText(track => track.artist),
  duration: byNumber(track => track.durationSeconds),
  year: byIsoDate(track => track.releaseDate),
};

export const selectSortedSongs = (tracks: Track[], sort: SongSort): Track[] =>
  sortBy(tracks, sort, songComparators);

const artistComparators: Record<ArtistSortField, Compare<Artist>> = {
  name: byText(artist => artist.name),
  followers: byNumber(artist => artist.followerCount),
  songs: byNumber(artist => artist.trackCount),
};

export const selectSortedArtists = (artists: Artist[], sort: ArtistSort): Artist[] =>
  sortBy(artists, sort, artistComparators);

const albumComparators: Record<AlbumSortField, Compare<Album>> = {
  title: byText(album => album.title),
  artist: byText(album => album.artist),
  year: byIsoDate(album => album.releaseDate),
  songs: byNumber(album => album.trackCount),
};

export const selectSortedAlbums = (albums: Album[], sort: AlbumSort): Album[] =>
  sortBy(albums, sort, albumComparators);

export const hasMoreSongs = (offset: number): boolean => offset < SONGS_MAX_OFFSET;

export const nextSongsOffset = (offset: number): number => offset + SONGS_PAGE_SIZE;

export const canLoadMoreSongs = ({ hasScrolled, isFetching, offset, requestedOffset }: SongsLoadState): boolean => {
  return hasScrolled && !isFetching && hasMoreSongs(offset) && requestedOffset === offset;
};

export const putPageAt = <T>(pages: T[], index: number, page: T): T[] => {
  if (pages[index] === page) {
    return pages;
  }
  const next = [...pages];
  next[index] = page;
  return next;
};


