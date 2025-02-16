import {MAX_STREAM_RETRIES, STREAM_RETRY_BASE_DELAY_MS} from './constants';
import {shouldRetryStream, streamRetryDelayMs} from './selectors';

describe('shouldRetryStream', () => {
  it('retries a stream that has not failed yet', () => {
    expect(shouldRetryStream(0)).toBe(true);
  });

  it('retries up to the limit', () => {
    expect(shouldRetryStream(MAX_STREAM_RETRIES - 1)).toBe(true);
  });

  it('gives up once the limit is reached', () => {
    expect(shouldRetryStream(MAX_STREAM_RETRIES)).toBe(false);
    expect(shouldRetryStream(MAX_STREAM_RETRIES + 1)).toBe(false);
  });
});

describe('streamRetryDelayMs', () => {
  it('starts from the base delay', () => {
    expect(streamRetryDelayMs(0)).toBe(STREAM_RETRY_BASE_DELAY_MS);
  });

  it('doubles with every failed attempt', () => {
    expect(streamRetryDelayMs(1)).toBe(STREAM_RETRY_BASE_DELAY_MS * 2);
    expect(streamRetryDelayMs(2)).toBe(STREAM_RETRY_BASE_DELAY_MS * 4);
  })

  it('does not go below the base delay for a bogus negative count', () => {
    expect(streamRetryDelayMs(-1)).toBe(STREAM_RETRY_BASE_DELAY_MS);
  });
});
