import {HOME_SEGMENTS, SONG_SORT_FIELDS} from './constants';

export type HomeSegment = (typeof HOME_SEGMENTS)[number];

export type SongSortField = (typeof SONG_SORT_FIELDS)[number];

export type SongSort = {
  field: SongSortField;
  isAscending: boolean;
};
