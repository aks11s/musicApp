export const HOME_SEGMENTS = ['Suggested', 'Songs', 'Artists', 'Albums'] as const;

export const TOP_ARTISTS_LIMIT = 7;

export const UNDERGROUND_TRACKS_LIMIT = 10;

export const SONG_SORT_FIELDS = ['title', 'artist', 'duration', 'year'] as const;

export const SONG_SORT_LABELS = {
  title: 'Title',
  artist: 'Artist',
  duration: 'Duration',
  year: 'Year',
} as const;

export const ARTISTS_LIMIT = 100;

export const ARTIST_SORT_FIELDS = ['name', 'followers', 'songs'] as const;

export const ARTIST_SORT_LABELS = {
  name: 'Name',
  followers: 'Followers',
  songs: 'Songs',
} as const;

export const SONGS_PAGE_SIZE = 50;
export const SONGS_MAX_OFFSET = 200;
export const SKELETON_COUNT = 4;
export const SONGS_SKELETON_COUNT = 8;
export const SONGS_SKELETON_MIN_MS = 900;
export const SONGS_PULL_TRIGGER = 90;

// mirrors the artwork size inside shared/ui TrackRow — shared/ cannot import a
// feature's constants, so the skeleton repeats it to keep the same geometry
export const TRACK_ROW_ARTWORK_SIZE = 52;

export const TRACK_ROW_HEIGHT = 70;

export const RECENTLY_PLAYED_LIMIT = 20;
export const TRACK_CARD_SIZE = 128;
export const RECENTLY_PLAYED_CARD_SIZE = 112;
