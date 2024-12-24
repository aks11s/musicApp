import {formatDuration} from './formatDuration';

describe('formatDuration', () => {
  it('formats minutes and seconds as m:ss', () => {
    expect(formatDuration(230)).toBe('3:50');
  });

  it('pads seconds below ten', () => {
    expect(formatDuration(185)).toBe('3:05');
  });

  it('formats a track shorter than a minute', () => {
    expect(formatDuration(42)).toBe('0:42');
  });

  // real Audius data: DJ sets run well over an hour
  it('adds an hour part for long tracks', () => {
    expect(formatDuration(5428)).toBe('1:30:28');
  });

  it('pads minutes inside the hour part', () => {
    expect(formatDuration(3605)).toBe('1:00:05');
  });

  it('floors fractional seconds', () => {
    expect(formatDuration(230.9)).toBe('3:50');
  });

  it('falls back to zero for invalid input', () => {
    expect(formatDuration(-5)).toBe('0:00');
    expect(formatDuration(Number.NaN)).toBe('0:00');
  });
});
