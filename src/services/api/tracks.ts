import {z} from 'zod';
import {mapTrackDtoToTrack} from '../../features/home/models/mapper';
import {trackDtoSchema} from '../../features/home/models/schema';
import type {Track} from '../../features/home/models/types';
import {getAudiusHost} from './audiusHost';
import {baseApi} from './baseApi';

// not an RTK Query endpoint — the response is the audio itself, not JSON
export const getTrackStreamUrl = async (trackId: string): Promise<string> => {
  const host = await getAudiusHost();
  return `${host}/v1/tracks/${trackId}/stream`;
};

const trackListResponseSchema = z.object({
  data: z.array(trackDtoSchema),
});

const singleTrackResponseSchema = z.object({
  data: trackDtoSchema,
});

export const tracksApi = baseApi.injectEndpoints({
  endpoints: build => ({
    getTrendingTracks: build.query<Track[], void>({
      query: () => '/tracks/trending',
      transformResponse: (response: unknown): Track[] => {
        const {data} = trackListResponseSchema.parse(response);
        return data.map(mapTrackDtoToTrack);
      },
    }),
    getUndergroundTracks: build.query<Track[], number>({
      query: limit => `/tracks/trending/underground?limit=${limit}`,
      transformResponse: (response: unknown): Track[] => {
        const {data} = trackListResponseSchema.parse(response);
        return data.map(mapTrackDtoToTrack);
      },
    }),
    getTrack: build.query<Track, string>({
      query: trackId => `/tracks/${trackId}`,
      transformResponse: (response: unknown): Track => {
        const {data} = singleTrackResponseSchema.parse(response);
        return mapTrackDtoToTrack(data);
      },
    }),
    searchTracks: build.query<Track[], string>({
      query: searchQuery => `/tracks/search?query=${encodeURIComponent(searchQuery)}`,
      transformResponse: (response: unknown): Track[] => {
        const {data} = trackListResponseSchema.parse(response);
        return data.map(mapTrackDtoToTrack);
      },
    }),
  }),
  overrideExisting: __DEV__,
});

export const {
  useGetTrendingTracksQuery,
  useGetUndergroundTracksQuery,
  useGetTrackQuery,
  useSearchTracksQuery,
} = tracksApi;
