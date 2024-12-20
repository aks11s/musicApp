import {playlistDtoSchema, trackDtoSchema, userDtoSchema} from './schema';
import {mapPlaylistDtoToRemotePlaylist, mapTrackDtoToTrack, mapUserDtoToArtist} from './mapper';

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

// recorded shape of a single item from GET /v1/users/search
const userFixture = {
  id: 'nP2mK',
  handle: 'novawave',
  name: 'Nova Wave',
  follower_count: 5210,
  is_verified: true,
  profile_picture: {
    '150x150': 'https://discoveryprovider.audius.co/profile/150x150.jpg',
    '480x480': 'https://discoveryprovider.audius.co/profile/480x480.jpg',
    '1000x1000': 'https://discoveryprovider.audius.co/profile/1000x1000.jpg',
  },
};

// recorded shape of a single item from GET /v1/playlists/trending
const playlistFixture = {
  id: 'k3mNp',
  playlist_name: 'Late Night Drives',
  track_count: 18,
  artwork: {
    '150x150': 'https://discoveryprovider.audius.co/playlist/150x150.jpg',
    '480x480': 'https://discoveryprovider.audius.co/playlist/480x480.jpg',
    '1000x1000': 'https://discoveryprovider.audius.co/playlist/1000x1000.jpg',
  },
  user: {
    id: 'nP2mK',
    handle: 'novawave',
    name: 'Nova Wave',
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

describe('userDtoSchema', () => {
  it('parses a recorded user response', () => {
    expect(() => userDtoSchema.parse(userFixture)).not.toThrow();
  });

  it('accepts a user with no profile picture', () => {
    const fixtureWithoutPicture = {...userFixture, profile_picture: null};
    expect(() => userDtoSchema.parse(fixtureWithoutPicture)).not.toThrow();
  });
});

describe('mapUserDtoToArtist', () => {
  it('maps a DTO to the domain Artist shape', () => {
    const dto = userDtoSchema.parse(userFixture);

    expect(mapUserDtoToArtist(dto)).toEqual({
      id: 'nP2mK',
      name: 'Nova Wave',
      handle: 'novawave',
      avatarUrl: 'https://discoveryprovider.audius.co/profile/480x480.jpg',
      followerCount: 5210,
    });
  });

  it('falls back to an empty avatar url when profile picture is missing', () => {
    const dto = userDtoSchema.parse({...userFixture, profile_picture: null});

    expect(mapUserDtoToArtist(dto).avatarUrl).toBe('');
  });
});

describe('playlistDtoSchema', () => {
  it('parses a recorded playlist response', () => {
    expect(() => playlistDtoSchema.parse(playlistFixture)).not.toThrow();
  });

  it('accepts a playlist with no artwork', () => {
    const fixtureWithoutArtwork = {...playlistFixture, artwork: null};
    expect(() => playlistDtoSchema.parse(fixtureWithoutArtwork)).not.toThrow();
  });
});

describe('mapPlaylistDtoToRemotePlaylist', () => {
  it('maps a DTO to the domain RemotePlaylist shape', () => {
    const dto = playlistDtoSchema.parse(playlistFixture);

    expect(mapPlaylistDtoToRemotePlaylist(dto)).toEqual({
      id: 'k3mNp',
      title: 'Late Night Drives',
      curatorName: 'Nova Wave',
      artworkUrl: 'https://discoveryprovider.audius.co/playlist/480x480.jpg',
      trackCount: 18,
    });
  });

  it('falls back to an empty artwork url when artwork is missing', () => {
    const dto = playlistDtoSchema.parse({...playlistFixture, artwork: null});

    expect(mapPlaylistDtoToRemotePlaylist(dto).artworkUrl).toBe('');
  });
});
