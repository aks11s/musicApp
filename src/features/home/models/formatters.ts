import type {Album, Artist} from '../../../domain/types';

const plural = (count: number, word: string): string =>
  `${count} ${word}${count === 1 ? '' : 's'}`;

// most top artists have no albums, and "0 Albums" is noise
export const formatArtistStats = ({albumCount, trackCount}: Artist): string => {
  const songs = plural(trackCount, 'Song');
  return albumCount > 0 ? `${plural(albumCount, 'Album')} · ${songs}` : songs;
};

export const formatAlbumSubtitle = ({artist, releaseDate}: Album): string =>
  releaseDate ? `${artist} · ${releaseDate.slice(0, 4)}` : artist;

export const formatSongCount = (count: number): string => plural(count, 'song');
