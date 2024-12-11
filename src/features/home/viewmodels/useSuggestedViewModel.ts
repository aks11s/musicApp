import {useGetTrendingTracksQuery} from '../../../services/api/tracks';
import {useSearchUsersQuery} from '../../../services/api/users';
import {ARTISTS_QUERY, TOP_ARTISTS_LIMIT} from '../models/constants';
import {MOCK_RECENTLY_PLAYED} from '../models/mocks';
import {selectMostPopularArtists} from '../models/selectors';
import type {Artist, HomeTrackCard, Track} from '../models/types';

export type SuggestedViewModel = {
  recentlyPlayed: HomeTrackCard[];
  artists: Artist[];
  isArtistsLoading: boolean;
  isArtistsError: boolean;
  mostPlayed: Track[];
  isMostPlayedLoading: boolean;
  isMostPlayedError: boolean;
};

export const useSuggestedViewModel = (): SuggestedViewModel => {
  const {data: mostPlayed, isLoading: isMostPlayedLoading, isError: isMostPlayedError} =
    useGetTrendingTracksQuery();
  const {data: artists, isLoading: isArtistsLoading, isError: isArtistsError} =
    useSearchUsersQuery(ARTISTS_QUERY);

  return {
    recentlyPlayed: MOCK_RECENTLY_PLAYED,
    artists: artists ? selectMostPopularArtists(artists, TOP_ARTISTS_LIMIT) : [],
    isArtistsLoading,
    isArtistsError,
    mostPlayed: mostPlayed ?? [],
    isMostPlayedLoading,
    isMostPlayedError,
  };
};
