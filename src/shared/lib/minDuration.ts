export const remainingMs = (elapsedMs: number, minMs: number): number =>
  Math.max(minMs - elapsedMs, 0);
