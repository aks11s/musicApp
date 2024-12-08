import {useState} from 'react';
import {useGetTrendingTracksQuery} from '../../../services/api/tracks';
import {useSearchUsersQuery} from '../../../services/api/users';
import {ARTISTS_QUERY, TOP_ARTISTS_LIMIT} from '../models/constants';
import {MOCK_RECENTLY_PLAYED} from '../models/mocks';
import {selectMostPopularArtists} from '../models/selectors';
import type {Artist, HomeSegment, HomeTrackCard, Track} from '../models/types';

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
