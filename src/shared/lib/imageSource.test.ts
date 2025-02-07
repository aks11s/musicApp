import {toImageSource} from './imageSource';

describe('toImageSource', () => {
  it('wraps a url in a uri source', () => {
    expect(toImageSource('https://example.test/a.jpg')).toEqual({
      uri: 'https://example.test/a.jpg',
    });
  });

  it('returns no source for an empty url', () => {
    expect(toImageSource('')).toBeUndefined();
  });
});
