import {useState} from 'react';
import {useGetTrendingTracksQuery} from '../../../services/api/tracks';
import {useSearchUsersQuery} from '../../../services/api/users';
import {selectMostPopularArtists} from '../models/selectors';
import type {Artist, HomeSegment, Track} from '../models/types';

const TOP_ARTISTS_LIMIT = 7;

export type HomeTrackCard = {
  id: string;
  title: string;
  artist: string;
  gradient: [string, string];
};

export type HomeViewModel = {
  activeSegment: HomeSegment;
  setActiveSegment: (segment: HomeSegment) => void;
  recentlyPlayed: HomeTrackCard[];
  artists: Artist[];
  isArtistsLoading: boolean;
  isArtistsError: boolean;
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

// TODO: Audius has no "top artists" endpoint — searchUsers is a text search, not a global
// ranking. This is a candidate pool, ranked by followerCount in models/selectors.ts.
const ARTISTS_QUERY = 'music';

export const useHomeViewModel = (): HomeViewModel => {
  const [activeSegment, setActiveSegment] = useState<HomeSegment>('Suggested');
  const {data: mostPlayed, isLoading: isMostPlayedLoading, isError: isMostPlayedError} =
    useGetTrendingTracksQuery();
  const {data: artists, isLoading: isArtistsLoading, isError: isArtistsError} =
    useSearchUsersQuery(ARTISTS_QUERY);

  return {
    activeSegment,
    setActiveSegment,
    recentlyPlayed: MOCK_RECENTLY_PLAYED,
    artists: artists ? selectMostPopularArtists(artists, TOP_ARTISTS_LIMIT) : [],
    isArtistsLoading,
    isArtistsError,
    mostPlayed: mostPlayed ?? [],
    isMostPlayedLoading,
    isMostPlayedError,
  };
};
