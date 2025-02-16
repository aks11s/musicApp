import {MAX_STREAM_RETRIES, STREAM_RETRY_BASE_DELAY_MS} from './constants';

export const shouldRetryStream = (failedAttempts: number): boolean =>
  failedAttempts < MAX_STREAM_RETRIES;

export const streamRetryDelayMs = (failedAttempts: number): number =>
  STREAM_RETRY_BASE_DELAY_MS * 2 ** Math.max(failedAttempts, 0);
