import {useState} from 'react';
import {
  useGetTrendingTracksQuery,
  useGetUndergroundTracksQuery,
} from '../../../services/api/tracks';
import {useGetTopArtistsQuery} from '../../../services/api/users';
import {TOP_ARTISTS_LIMIT, UNDERGROUND_TRACKS_LIMIT} from '../models/constants';
import {getRecentlyPlayed} from '../models/recentlyPlayed.repository';
import {selectMostPopularArtists} from '../models/selectors';
import type {Artist, Track} from '../models/types';

export type SuggestedViewModel = {
  recentlyPlayed: Track[];
  hasRecentlyPlayed: boolean;
  artists: Artist[];
  isArtistsLoading: boolean;
  isArtistsError: boolean;
  mostPlayed: Track[];
  isMostPlayedLoading: boolean;
  isMostPlayedError: boolean;
  underground: Track[];
  isUndergroundLoading: boolean;
  isUndergroundError: boolean;
};

export const useSuggestedViewModel = (): SuggestedViewModel => {

  const [recentlyPlayed] = useState(getRecentlyPlayed);
  const {data: mostPlayed, isLoading: isMostPlayedLoading, isError: isMostPlayedError} =
    useGetTrendingTracksQuery();
  const {data: artists, isLoading: isArtistsLoading, isError: isArtistsError} =
    useGetTopArtistsQuery(TOP_ARTISTS_LIMIT);
  const {data: underground, isLoading: isUndergroundLoading, isError: isUndergroundError} =
    useGetUndergroundTracksQuery(UNDERGROUND_TRACKS_LIMIT);

  return {
    recentlyPlayed,
    hasRecentlyPlayed: recentlyPlayed.length > 0,
    artists: artists ? selectMostPopularArtists(artists, TOP_ARTISTS_LIMIT) : [],
    isArtistsLoading,
    isArtistsError,
    mostPlayed: mostPlayed ?? [],
    isMostPlayedLoading,
    isMostPlayedError,
    underground: underground ?? [],
    isUndergroundLoading,
    isUndergroundError,
  };
};
