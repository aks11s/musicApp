import {HOME_SEGMENTS, SONG_SORT_FIELDS} from './constants';

export type Track = {
  id: string;
  title: string;
  artist: string;
  artworkUrl: string;
  durationSeconds: number;
};

export type Artist = {
  id: string;
  name: string;
  handle: string;
  avatarUrl: string;
  followerCount: number;
};

export type RemotePlaylist = {
  id: string;
  title: string;
  curatorName: string;
  artworkUrl: string;
  trackCount: number;
};

export type HomeSegment = (typeof HOME_SEGMENTS)[number];

export type SongSortField = (typeof SONG_SORT_FIELDS)[number];

export type SongSort = {
  field: SongSortField;
  isAscending: boolean;
};
