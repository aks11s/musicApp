import {useMemo} from 'react';
import {useGetTrendingAlbumsQuery} from '../../../services/api/remotePlaylists';
import {useSort} from '../../../shared/hooks/useSort';
import {ALBUMS_LIMIT} from '../models/constants';
import {formatAlbumSubtitle, formatSongCount} from '../models/formatters';
import {selectSortedAlbums} from '../models/selectors';
import type {AlbumSort, AlbumSortField} from '../models/types';

export type AlbumCardItem = {
  id: string;
  title: string;
  subtitle: string;
  songCount: string;
  artworkUrl: string;
};

export type AlbumsViewModel = {
  albums: AlbumCardItem[];
  albumCount: number;
  isCountLoading: boolean;
  sort: AlbumSort;
  setSortField: (field: AlbumSortField) => void;
  toggleSortDirection: () => void;
  isLoading: boolean;
  isError: boolean;
};

export const useAlbumsViewModel = (): AlbumsViewModel => {
  const {sort, setSortField, toggleSortDirection} = useSort<AlbumSortField>({
    field: 'year',
    isAscending: false,
  });

  const {data, isLoading, isError} = useGetTrendingAlbumsQuery(ALBUMS_LIMIT);

  const albums = useMemo(
    () =>
      selectSortedAlbums(data ?? [], sort).map(album => ({
        id: album.id,
        title: album.title,
        subtitle: formatAlbumSubtitle(album),
        songCount: formatSongCount(album.trackCount),
        artworkUrl: album.artworkUrl,
      })),
    [data, sort],
  );

  return {
    albums,
    albumCount: data?.length ?? 0,
    isCountLoading: !data && !isError,
    sort,
    setSortField,
    toggleSortDirection,
    isLoading,
    isError,
  };
};
