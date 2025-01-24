import {useMemo} from 'react';
import {useGetTopArtistsQuery} from '../../../services/api/users';
import {useSort} from '../../../shared/hooks/useSort';
import {ARTISTS_LIMIT} from '../models/constants';
import {formatArtistStats} from '../models/formatters';
import {selectSortedArtists} from '../models/selectors';
import type {ArtistSort, ArtistSortField} from '../models/types';

export type ArtistRowItem = {
  id: string;
  name: string;
  stats: string;
  avatarUrl: string;
};

export type ArtistsViewModel = {
  artists: ArtistRowItem[];
  artistCount: number;
  isCountLoading: boolean;
  sort: ArtistSort;
  setSortField: (field: ArtistSortField) => void;
  toggleSortDirection: () => void;
  isLoading: boolean;
  isError: boolean;
};

export const useArtistsViewModel = (): ArtistsViewModel => {
  const {sort, setSortField, toggleSortDirection} = useSort<ArtistSortField>({
    field: 'followers',
    isAscending: false,
  });

  const {data, isLoading, isError} = useGetTopArtistsQuery(ARTISTS_LIMIT);

  const artists = useMemo(
    () =>
      selectSortedArtists(data ?? [], sort).map(artist => ({
        id: artist.id,
        name: artist.name,
        stats: formatArtistStats(artist),
        avatarUrl: artist.avatarUrl,
      })),
    [data, sort],
  );

  return {
    artists,
    artistCount: data?.length ?? 0,
    isCountLoading: !data && !isError,
    sort,
    setSortField,
    toggleSortDirection,
    isLoading,
    isError,
  };
};
