import {useCallback, useMemo, useState} from 'react';
import {useGetTopArtistsQuery} from '../../../services/api/users';
import {withFlippedSort, withSortField} from '../../../shared/lib/sort';
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
  const [sort, setSort] = useState<ArtistSort>({field: 'followers', isAscending: false});

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

  const setSortField = useCallback((field: ArtistSortField) => {
    setSort(current => withSortField(current, field));
  }, []);

  const toggleSortDirection = useCallback(() => {
    setSort(withFlippedSort);
  }, []);

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
