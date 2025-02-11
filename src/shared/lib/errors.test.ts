import {toErrorMessage} from './errors';

describe('toErrorMessage', () => {
  it('takes the message of an Error', () => {
    expect(toErrorMessage(new TypeError('Network request failed'))).toBe('Network request failed');
  });

  it('keeps a thrown string as is', () => {
    expect(toErrorMessage('boom')).toBe('boom');
  });

  it('serializes a plain object instead of "[object Object]"', () => {
    expect(toErrorMessage({code: 'player_not_initialized'})).toBe(
      '{"code":"player_not_initialized"}',
    );
  });

  it('handles undefined and null', () => {
    expect(toErrorMessage(undefined)).toBe('undefined');
    expect(toErrorMessage(null)).toBe('null');
  });

  it('does not throw on a circular object', () => {
    const circular: Record<string, unknown> = {};
    circular.self = circular;

    expect(toErrorMessage(circular)).toBe('[object Object]');
  });
});
