import type {TrackDto} from './track.schema';
import type {Track} from './track.types';

export const mapTrackDtoToTrack = (dto: TrackDto): Track => ({
  id: dto.id,
  title: dto.title,
  artist: dto.user.name,
  artworkUrl: dto.artwork?.['480x480'] ?? dto.artwork?.['150x150'] ?? '',
  durationSeconds: dto.duration,
});
