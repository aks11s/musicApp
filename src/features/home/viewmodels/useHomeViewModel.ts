import {useState} from 'react';
import type {HomeSegment} from '../models/types';

export type HomeViewModel = {
  activeSegment: HomeSegment;
  setActiveSegment: (segment: HomeSegment) => void;
};

export const useHomeViewModel = (): HomeViewModel => {
  const [activeSegment, setActiveSegment] = useState<HomeSegment>('Suggested');

  return {activeSegment, setActiveSegment};
};
