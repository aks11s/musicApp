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
