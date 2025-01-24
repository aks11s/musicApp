import type {Sort} from '../../../shared/lib/sort';
import {ARTIST_SORT_FIELDS, HOME_SEGMENTS, SONG_SORT_FIELDS} from './constants';

export type HomeSegment = (typeof HOME_SEGMENTS)[number];

export type SongSortField = (typeof SONG_SORT_FIELDS)[number];

export type SongSort = Sort<SongSortField>;

export type ArtistSortField = (typeof ARTIST_SORT_FIELDS)[number];

export type ArtistSort = Sort<ArtistSortField>;

export type SongsLoadState = {
  hasScrolled: boolean;
  isFetching: boolean;
  offset: number;
  requestedOffset: number;
};
