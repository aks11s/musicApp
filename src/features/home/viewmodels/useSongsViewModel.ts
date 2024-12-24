import {useCallback, useMemo, useState} from 'react';
import {useGetTrendingTracksPageQuery} from '../../../services/api/tracks';
import {SONGS_PAGE_SIZE} from '../models/constants';
import {
  hasMoreSongs,
  nextSongSort,
  nextSongsOffset,
  selectSortedSongs,
} from '../models/selectors';
import type {Track} from '../../../domain/types';
import type {SongSort, SongSortField} from '../models/types';

export type SongsViewModel = {
  songs: Track[];
  songCount: number;
  sort: SongSort;
  toggleSortField: (field: SongSortField) => void;
  isLoading: boolean;
  isError: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  loadMore: () => void;
};

export const useSongsViewModel = (): SongsViewModel => {
  const [offset, setOffset] = useState(0);
  const [sort, setSort] = useState<SongSort>({field: 'title', isAscending: true});

  const {data, isLoading, isError, isFetching} = useGetTrendingTracksPageQuery({
    offset,
    limit: SONGS_PAGE_SIZE,
  });

  const loaded = useMemo(() => data ?? [], [data]);
  const songs = useMemo(() => selectSortedSongs(loaded, sort), [loaded, sort]);

  const hasMore = hasMoreSongs(offset);
  // isFetching stays true while a new page lands, but the merged data is already
  // there — that difference is what separates the footer spinner from the first load
  const isLoadingMore = isFetching && !isLoading;

  const loadMore = useCallback(() => {
    if (isFetching || !hasMore) {
      return;
    }
    setOffset(nextSongsOffset);
  }, [isFetching, hasMore]);

  const toggleSortField = useCallback((field: SongSortField) => {
    setSort(current => nextSongSort(current, field));
  }, []);

  return {
    songs,
    songCount: loaded.length,
    sort,
    toggleSortField,
    isLoading,
    isError,
    isLoadingMore,
    hasMore,
    loadMore,
  };
};
