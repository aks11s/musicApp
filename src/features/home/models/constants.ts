export const HOME_SEGMENTS = ['Suggested', 'Songs', 'Artists', 'Albums'] as const;

export const TOP_ARTISTS_LIMIT = 7;

export const UNDERGROUND_TRACKS_LIMIT = 10;

export const SONG_SORT_FIELDS = ['title', 'duration'] as const;

// Audius rejects offset > 200 with a 400, whatever the limit — 250 tracks is the
// whole list Songs can ever show
export const SONGS_PAGE_SIZE = 50;
export const SONGS_MAX_OFFSET = 200;

export const SKELETON_COUNT = 4;

export const RECENTLY_PLAYED_LIMIT = 20;
export const TRACK_CARD_SIZE = 128;
export const RECENTLY_PLAYED_CARD_SIZE = 112;
