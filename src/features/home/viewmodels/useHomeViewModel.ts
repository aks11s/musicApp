import {useGetTrendingTracksQuery} from '../../../services/api/tracks';
import type {Track} from '../models/types';

export type HomeTrackCard = {
  id: string;
  title: string;
  artist: string;
  gradient: [string, string];
};

export type HomeArtistCard = {
  id: string;
  name: string;
  gradient: [string, string];
};

export type HomeViewModel = {
  recentlyPlayed: HomeTrackCard[];
  artists: HomeArtistCard[];
  mostPlayed: Track[];
  isMostPlayedLoading: boolean;
  isMostPlayedError: boolean;
};

// TODO: replace with real Audius data (recently played comes from local MMKV history, not Audius — no user accounts)
const MOCK_RECENTLY_PLAYED: HomeTrackCard[] = [
  {id: 'track-1', title: 'Starfall', artist: 'Aria Nova', gradient: ['#FF7A59', '#FFB199']},
  {id: 'track-2', title: 'Neon Tide', artist: 'Wanderlights', gradient: ['#6D5DF6', '#B39DFF']},
  {id: 'track-3', title: 'Golden Hour', artist: 'Mona Vale', gradient: ['#00B4D8', '#90E0EF']},
];

const MOCK_ARTISTS: HomeArtistCard[] = [
  {id: 'artist-1', name: 'Aria Nova', gradient: ['#00B4D8', '#90E0EF']},
  {id: 'artist-2', name: 'Wanderlights', gradient: ['#F5871F', '#FFD166']},
  {id: 'artist-3', name: 'Mona Vale', gradient: ['#EF476F', '#FFA5BA']},
  {id: 'artist-4', name: 'Cassio', gradient: ['#06D6A0', '#88F7D4']},
];

export const useHomeViewModel = (): HomeViewModel => {
  const {data: mostPlayed, isLoading, isError} = useGetTrendingTracksQuery();

  return {
    recentlyPlayed: MOCK_RECENTLY_PLAYED,
    artists: MOCK_ARTISTS,
    mostPlayed: mostPlayed ?? [],
    isMostPlayedLoading: isLoading,
    isMostPlayedError: isError,
  };
};
