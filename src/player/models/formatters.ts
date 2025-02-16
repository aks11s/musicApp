export const toProgressRatio = (positionSeconds: number, durationSeconds: number): number => {
  if (!(durationSeconds > 0) || !(positionSeconds > 0)) {
    return 0;
  }
  return Math.min(positionSeconds / durationSeconds, 1);
};
