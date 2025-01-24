import {ARTIST_SORT_FIELDS, HOME_SEGMENTS, SONG_SORT_FIELDS} from './constants';

export type HomeSegment = (typeof HOME_SEGMENTS)[number];

export type SongSortField = (typeof SONG_SORT_FIELDS)[number];

export type SongSort = {
  field: SongSortField;
  isAscending: boolean;
};

export type ArtistSortField = (typeof ARTIST_SORT_FIELDS)[number];

export type ArtistSort = {
  field: ArtistSortField;
  isAscending: boolean;
};

export type SongsLoadState = {
  hasScrolled: boolean;
  isFetching: boolean;
  offset: number;
  requestedOffset: number;
};
