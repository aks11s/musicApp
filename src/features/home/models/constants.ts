export const HOME_SEGMENTS = ['Suggested', 'Songs', 'Artists', 'Albums'] as const;

export const TOP_ARTISTS_LIMIT = 7;

// NOTE: Audius has no "top artists" endpoint — searchUsers is a text search, not a global
// ranking. This is a candidate pool, ranked by followerCount in selectors.ts.
export const ARTISTS_QUERY = 'music';
