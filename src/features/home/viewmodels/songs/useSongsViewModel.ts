import {useMemo} from 'react';
import type {Track} from '../../../../domain/types';
import {useMinLoadingTime} from '../../../../shared/hooks/useMinLoadingTime';
import {useSort} from '../../../../shared/hooks/useSort';
import {SONGS_SKELETON_MIN_MS} from '../../models/constants';
import {selectSortedSongs} from '../../models/selectors';
import type {SongSort, SongSortField} from '../../models/types';
import {useSongsPages} from './useSongsPages';

export type SongsViewModel = {
  songs: Track[];
  songCount: number;
  isCountLoading: boolean;
  sort: SongSort;
  setSortField: (field: SongSortField) => void;
  toggleSortDirection: () => void;
  isLoading: boolean;
  isError: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  loadMore: () => void;
  allowLoadMore: () => void;
};

export const useSongsViewModel = (): SongsViewModel => {
  const {loaded, isLoading, isFetching, isError, hasMore, loadMore, allowLoadMore} =
    useSongsPages();
  const {sort, setSortField, toggleSortDirection} = useSort<SongSortField>({
    field: 'title',
    isAscending: true,
  });
  const isSkeletonShown = useMinLoadingTime(isFetching, SONGS_SKELETON_MIN_MS);

  const songs = useMemo(() => selectSortedSongs(loaded, sort), [loaded, sort]);

  return {
    songs,
    songCount: loaded.length,
    isCountLoading: loaded.length === 0 && !isError,
    sort,
    setSortField,
    toggleSortDirection,
    isLoading: isLoading && loaded.length === 0,
    isError,
    isLoadingMore: isSkeletonShown && loaded.length > 0,
    hasMore,
    loadMore,
    allowLoadMore,
  };
};
