import type {Artist} from './types';

export const selectMostPopularArtists = (artists: Artist[], limit: number): Artist[] =>
  [...artists].sort((a, b) => b.followerCount - a.followerCount).slice(0, limit);


 