import {useSyncExternalStore} from 'react';
import {
  useGetTrendingTracksQuery,
  useGetUndergroundTracksQuery,
} from '../../../services/api/tracks';
import {useGetTopArtistsQuery} from '../../../services/api/users';
import {TOP_ARTISTS_LIMIT, UNDERGROUND_TRACKS_LIMIT} from '../models/constants';
import {getRecentlyPlayed, subscribeRecentlyPlayed} from '../models/recentlyPlayed.repository';
import {selectMostPopularArtists} from '../models/selectors';
import type {Artist, Track} from '../../../domain/types';
import {usePlayTracks} from '../../../player/viewmodels/usePlayTracks';

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
  playRecentlyPlayed: (index: number) => void;
  playMostPlayed: (index: number) => void;
  playUnderground: (index: number) => void;
};

export const useSuggestedViewModel = (): SuggestedViewModel => {

  const recentlyPlayed = useSyncExternalStore(subscribeRecentlyPlayed, getRecentlyPlayed);
  const {data: mostPlayed, isLoading: isMostPlayedLoading, isError: isMostPlayedError} =
    useGetTrendingTracksQuery();
  const {data: artists, isLoading: isArtistsLoading, isError: isArtistsError} =
    useGetTopArtistsQuery(TOP_ARTISTS_LIMIT);
  const {data: underground, isLoading: isUndergroundLoading, isError: isUndergroundError} =
    useGetUndergroundTracksQuery(UNDERGROUND_TRACKS_LIMIT);
  const playTracks = usePlayTracks();

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
    playRecentlyPlayed: index => playTracks(recentlyPlayed, index),
    playMostPlayed: index => playTracks(mostPlayed ?? [], index),
    playUnderground: index => playTracks(underground ?? [], index),
  };
};
