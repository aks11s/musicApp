import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import type {Track} from '../../../domain/types';
import {useGetTrendingTracksPageQuery} from '../../../services/api/tracks';
import {uniqueById} from '../../../shared/lib/collections';
import {SONGS_PAGE_SIZE} from '../models/constants';
import {
  canLoadMoreSongs,
  hasMoreSongs,
  withFlippedSongSort,
  withSongSortField,
  nextSongsOffset,
  putPageAt,
  remainingSkeletonMs,
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
  const [sort, setSort] = useState<SongSort>({field: 'title', isAscending: true});
  const [isSettling, setSettling] = useState(false);
  const settleStartedAt = useRef(0);

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

  useEffect(() => {
    if (!isFetching) {
      return;
    }
    settleStartedAt.current = Date.now();
    setSettling(true);
  }, [isFetching]);

  useEffect(() => {
    if (isFetching || !isSettling) {
      return;
    }
    const remaining = remainingSkeletonMs(Date.now() - settleStartedAt.current);
    const timer = setTimeout(() => setSettling(false), remaining);
    return () => clearTimeout(timer);
  }, [isFetching, isSettling]);

  const isLoadingMore = (isFetching || isSettling) && loaded.length > 0;
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

  const setSortField = useCallback((field: SongSortField) => {
    setSort(current => withSongSortField(current, field));
  }, []);

  const toggleSortDirection = useCallback(() => {
    setSort(withFlippedSongSort);
  }, []);

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
