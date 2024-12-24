import {z} from 'zod';

const artworkSchema = z
  .object({
    '150x150': z.string(),
    '480x480': z.string(),
    '1000x1000': z.string(),
  })
  .partial()
  .nullable();

export const trackDtoSchema = z.object({
  id: z.string(),
  title: z.string(),
  duration: z.number(),
  artwork: artworkSchema,
  user: z.object({
    name: z.string(),
  }),
});

export type TrackDto = z.infer<typeof trackDtoSchema>;

const profilePictureSchema = z
  .object({
    '150x150': z.string(),
    '480x480': z.string(),
    '1000x1000': z.string(),
  })
  .partial()
  .nullable();

export const userDtoSchema = z.object({
  id: z.string(),
  handle: z.string(),
  name: z.string(),
  follower_count: z.number(),
  profile_picture: profilePictureSchema,
});

export type UserDto = z.infer<typeof userDtoSchema>;

export const playlistDtoSchema = z.object({
  id: z.string(),
  playlist_name: z.string(),
  artwork: artworkSchema,
  user: z.object({
    name: z.string(),
  }),
  track_count: z.number(),
});

export type PlaylistDto = z.infer<typeof playlistDtoSchema>;
