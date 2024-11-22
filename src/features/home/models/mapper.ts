import type {TrackDto, UserDto} from './schema';
import type {Artist, Track} from './types';

export const mapTrackDtoToTrack = (dto: TrackDto): Track => ({
  id: dto.id,
  title: dto.title,
  artist: dto.user.name,
  artworkUrl: dto.artwork?.['480x480'] ?? dto.artwork?.['150x150'] ?? '',
  durationSeconds: dto.duration,
});

export const mapUserDtoToArtist = (dto: UserDto): Artist => ({
  id: dto.id,
  name: dto.name,
  handle: dto.handle,
  avatarUrl: dto.profile_picture?.['480x480'] ?? dto.profile_picture?.['150x150'] ?? '',
});
