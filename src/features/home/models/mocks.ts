import type {HomeTrackCard} from './types';

// TODO: drop this file once recently played is backed by local MMKV history
// (Audius has no user accounts, so it can never come from the API).
export const MOCK_RECENTLY_PLAYED: HomeTrackCard[] = [
  {id: 'track-1', title: 'Starfall', artist: 'Aria Nova', gradient: ['#FF7A59', '#FFB199']},
  {id: 'track-2', title: 'Neon Tide', artist: 'Wanderlights', gradient: ['#6D5DF6', '#B39DFF']},
  {id: 'track-3', title: 'Golden Hour', artist: 'Mona Vale', gradient: ['#00B4D8', '#90E0EF']},
];
