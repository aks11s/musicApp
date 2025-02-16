import {toProgressRatio} from './formatters';

describe('toProgressRatio', () => {
  it('is the share of the track already played', () => {
    expect(toProgressRatio(30, 120)).toBe(0.25);
  });

  it('is 0 before the duration is known', () => {
    expect(toProgressRatio(0, 0)).toBe(0);
    expect(toProgressRatio(5, 0)).toBe(0);
  });

  it('never goes past the end', () => {
    expect(toProgressRatio(121, 120)).toBe(1);
  });

  it('treats NaN and negative values as no progress', () => {
    expect(toProgressRatio(NaN, 120)).toBe(0);
    expect(toProgressRatio(10, NaN)).toBe(0);
    expect(toProgressRatio(-1, 120)).toBe(0);
  });
});
