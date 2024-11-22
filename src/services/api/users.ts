import {z} from 'zod';
import {mapTrackDtoToTrack, mapUserDtoToArtist} from '../../features/home/models/mapper';
import {trackDtoSchema, userDtoSchema} from '../../features/home/models/schema';
import type {Artist, Track} from '../../features/home/models/types';
import {baseApi} from './baseApi';

const singleUserResponseSchema = z.object({
  data: userDtoSchema,
});

const userListResponseSchema = z.object({
  data: z.array(userDtoSchema),
});

const trackListResponseSchema = z.object({
  data: z.array(trackDtoSchema),
});

export const usersApi = baseApi.injectEndpoints({
  endpoints: build => ({
    getUser: build.query<Artist, string>({
      query: userId => `/users/${userId}`,
      transformResponse: (response: unknown): Artist => {
        const {data} = singleUserResponseSchema.parse(response);
        return mapUserDtoToArtist(data);
      },
    }),
    getUserTracks: build.query<Track[], string>({
      query: userId => `/users/${userId}/tracks`,
      transformResponse: (response: unknown): Track[] => {
        const {data} = trackListResponseSchema.parse(response);
        return data.map(mapTrackDtoToTrack);
      },
    }),
    searchUsers: build.query<Artist[], string>({
      query: searchQuery => `/users/search?query=${encodeURIComponent(searchQuery)}`,
      transformResponse: (response: unknown): Artist[] => {
        const {data} = userListResponseSchema.parse(response);
        return data.map(mapUserDtoToArtist);
      },
    }),
  }),
  overrideExisting: __DEV__,
});

export const {useGetUserQuery, useGetUserTracksQuery, useSearchUsersQuery} = usersApi;
