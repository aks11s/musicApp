import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import type {Track} from '../../../../domain/types';
import {useGetTrendingTracksPageQuery} from '../../../../services/api/tracks';
import {uniqueById} from '../../../../shared/lib/collections';
import {SONGS_PAGE_SIZE} from '../../models/constants';
import {
  canLoadMoreSongs,
  hasMoreSongs,
  nextSongsOffset,
  putPageAt,
} from '../../models/selectors';

export type SongsPages = {
  loaded: Track[];
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  hasMore: boolean;
  loadMore: () => void;
  allowLoadMore: () => void;
};

export const useSongsPages = (): SongsPages => {
  const [offset, setOffset] = useState(0);
  const [pages, setPages] = useState<Track[][]>([]);

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
    loaded,
    isLoading,
    isFetching,
    isError,
    hasMore: hasMoreSongs(offset),
    loadMore,
    allowLoadMore,
  };
};
