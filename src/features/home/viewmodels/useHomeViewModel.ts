import {useCallback, useState} from 'react';
import type {HomeSegment} from '../models/types';

export type HomeViewModel = {
  activeSegment: HomeSegment;
  visitedSegments: ReadonlySet<HomeSegment>;
  setActiveSegment: (segment: HomeSegment) => void;
};

const INITIAL_SEGMENT: HomeSegment = 'Suggested';

export const useHomeViewModel = (): HomeViewModel => {
  const [activeSegment, setActive] = useState<HomeSegment>(INITIAL_SEGMENT);
  const [visitedSegments, setVisited] = useState<ReadonlySet<HomeSegment>>(
    () => new Set([INITIAL_SEGMENT]),
  );

  const setActiveSegment = useCallback((segment: HomeSegment) => {
    setActive(segment);
    setVisited(current => new Set(current).add(segment));
  }, []);

  return {activeSegment, visitedSegments, setActiveSegment};
};
