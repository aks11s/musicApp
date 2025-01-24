import {useEffect, useRef, useState} from 'react';
import {remainingMs} from '../lib/minDuration';

// a loader that disappears after 300ms reads as a flash, so hold it for at least minMs
export const useMinLoadingTime = (isLoading: boolean, minMs: number): boolean => {
  const [isHolding, setHolding] = useState(false);
  const startedAt = useRef(0);

  useEffect(() => {
    if (!isLoading) {
      return;
    }
    startedAt.current = Date.now();
    setHolding(true);
  }, [isLoading]);

  useEffect(() => {
    if (isLoading || !isHolding) {
      return;
    }
    const timer = setTimeout(
      () => setHolding(false),
      remainingMs(Date.now() - startedAt.current, minMs),
    );
    return () => clearTimeout(timer);
  }, [isLoading, isHolding, minMs]);

  return isLoading || isHolding;
};
