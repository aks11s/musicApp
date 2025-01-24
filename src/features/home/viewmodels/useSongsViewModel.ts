import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import type {Track} from '../../../domain/types';
import {useGetTrendingTracksPageQuery} from '../../../services/api/tracks';
import {useMinLoadingTime} from '../../../shared/hooks/useMinLoadingTime';
import {useSort} from '../../../shared/hooks/useSort';
import {uniqueById} from '../../../shared/lib/collections';
import {SONGS_PAGE_SIZE, SONGS_SKELETON_MIN_MS} from '../models/constants';
import {
  canLoadMoreSongs,
  hasMoreSongs,
  nextSongsOffset,
  putPageAt,
  selectSortedSongs,
} from '../models/selectors';
import type {SongSort, SongSortField} from '../models/types';

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
  const [offset, setOffset] = useState(0);
  const [pages, setPages] = useState<Track[][]>([]);
  const {sort, setSortField, toggleSortDirection} = useSort<SongSortField>({
    field: 'title',
    isAscending: true,
  });

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

  const isSkeletonShown = useMinLoadingTime(isFetching, SONGS_SKELETON_MIN_MS);
  const isLoadingMore = isSkeletonShown && loaded.length > 0;
  const hasMore = hasMoreSongs(offset);

  const hasScrolled = useRef(false);
  const requestedOffset = useRef(0);

  const allowLoadMore = useCallback(() => {
    hasScrolled.current = true;
  }, []);

  const loadMore = useCallback(() => {
    const allowed = canLoadMoreSongs({
      hasScrolled: hasScrolled.current,
      isFetching: isFetching,
      offset: offset,
      requestedOffset: requestedOffset.current,
    });
    if (!allowed) {
      return;
    }
    const next = nextSongsOffset(offset);
    requestedOffset.current = next;
    setOffset(next);
  }, [isFetching, offset]);

  return {
    songs,
    songCount: loaded.length,
    isCountLoading: loaded.length === 0 && !isError,
    sort,
    setSortField,
    toggleSortDirection,
    isLoading: isLoading && loaded.length === 0,
    isError,
    isLoadingMore,
    hasMore,
    loadMore,
    allowLoadMore,
  };
};
