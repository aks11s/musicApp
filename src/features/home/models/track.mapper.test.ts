import {trackDtoSchema} from './track.schema';
import {mapTrackDtoToTrack} from './track.mapper';

// recorded shape of a single item from GET /v1/tracks/trending
const trendingTrackFixture = {
  id: '7eP5n',
  title: 'Midnight City Lights',
  duration: 214,
  play_count: 128340,
  genre: 'Electronic',
  artwork: {
    '150x150': 'https://discoveryprovider.audius.co/artwork/150x150.jpg',
    '480x480': 'https://discoveryprovider.audius.co/artwork/480x480.jpg',
    '1000x1000': 'https://discoveryprovider.audius.co/artwork/1000x1000.jpg',
  },
  user: {
    id: 'nP2mK',
    handle: 'novawave',
    name: 'Nova Wave',
    follower_count: 5210,
  },
};

describe('trackDtoSchema', () => {
  it('parses a recorded trending track response', () => {
    expect(() => trackDtoSchema.parse(trendingTrackFixture)).not.toThrow();
  });

  it('accepts a track with no artwork', () => {
    const fixtureWithoutArtwork = {...trendingTrackFixture, artwork: null};
    expect(() => trackDtoSchema.parse(fixtureWithoutArtwork)).not.toThrow();
  });
});

describe('mapTrackDtoToTrack', () => {
  it('maps a DTO to the domain Track shape', () => {
    const dto = trackDtoSchema.parse(trendingTrackFixture);

    expect(mapTrackDtoToTrack(dto)).toEqual({
      id: '7eP5n',
      title: 'Midnight City Lights',
      artist: 'Nova Wave',
      artworkUrl: 'https://discoveryprovider.audius.co/artwork/480x480.jpg',
      durationSeconds: 214,
    });
  });

  it('falls back to an empty artwork url when artwork is missing', () => {
    const dto = trackDtoSchema.parse({...trendingTrackFixture, artwork: null});

    expect(mapTrackDtoToTrack(dto).artworkUrl).toBe('');
  });
});
