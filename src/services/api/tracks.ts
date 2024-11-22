import {z} from 'zod';
import {mapTrackDtoToTrack} from '../../features/home/models/track.mapper';
import {trackDtoSchema} from '../../features/home/models/track.schema';
import type {Track} from '../../features/home/models/track.types';
import {baseApi} from './baseApi';

const trendingTracksResponseSchema = z.object({
  data: z.array(trackDtoSchema),
});

export const tracksApi = baseApi.injectEndpoints({
  endpoints: build => ({
    getTrendingTracks: build.query<Track[], void>({
      query: () => '/tracks/trending',
      transformResponse: (response: unknown): Track[] => {
        const {data} = trendingTracksResponseSchema.parse(response);
        return data.map(mapTrackDtoToTrack);
      },
    }),
  }),
});

export const {useGetTrendingTracksQuery} = tracksApi;
