import {useCallback, useEffect, useMemo, useState} from 'react';
import type {Track} from '../../../domain/types';
import {useGetTrendingTracksPageQuery} from '../../../services/api/tracks';
import {uniqueById} from '../../../shared/lib/collections';
import {SONGS_PAGE_SIZE} from '../models/constants';
import {
  hasMoreSongs,
  nextSongSort,
  nextSongsOffset,
  putPageAt,
  selectSortedSongs,
} from '../models/selectors';
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
  const [pages, setPages] = useState<Track[][]>([]);
  const [sort, setSort] = useState<SongSort>({field: 'title', isAscending: true});

  const {data, isLoading, isError, isFetching} = useGetTrendingTracksPageQuery({
    offset,
    limit: SONGS_PAGE_SIZE,
  });

  const pageIndex = offset / SONGS_PAGE_SIZE;

  useEffect(() => {
    if (!data) {
      return;
    }
    setPages(current => putPageAt(current, pageIndex, data));
  }, [data, pageIndex]);

  const loaded = useMemo(() => uniqueById(pages.flat()), [pages]);
  const songs = useMemo(() => selectSortedSongs(loaded, sort), [loaded, sort]);

  const hasMore = hasMoreSongs(offset);
  const isLoadingMore = isFetching && loaded.length > 0;

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
    isLoading: isLoading && loaded.length === 0,
    isError,
    isLoadingMore,
    hasMore,
    loadMore,
  };
};
