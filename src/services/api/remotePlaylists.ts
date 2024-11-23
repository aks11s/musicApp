import {z} from 'zod';
import {
  mapPlaylistDtoToRemotePlaylist,
  mapTrackDtoToTrack,
} from '../../features/home/models/mapper';
import {
  playlistDtoSchema,
  trackDtoSchema,
} from '../../features/home/models/schema';
import type {RemotePlaylist, Track} from '../../features/home/models/types';
import {baseApi} from './baseApi';

const playlistListResponseSchema = z.object({
  data: z.array(playlistDtoSchema),
});

const trackListResponseSchema = z.object({
  data: z.array(trackDtoSchema),
});

export const remotePlaylistsApi = baseApi.injectEndpoints({
  endpoints: build => ({
    getTrendingPlaylists: build.query<RemotePlaylist[], void>({
      query: () => '/playlists/trending',
      transformResponse: (response: unknown): RemotePlaylist[] => {
        const {data} = playlistListResponseSchema.parse(response);
        return data.map(mapPlaylistDtoToRemotePlaylist);
      },
    }),
    getPlaylist: build.query<RemotePlaylist, string>({
      query: playlistId => `/playlists/${playlistId}`,
      // audius wraps a single playlist in a one-element array, not a bare object
      transformResponse: (response: unknown): RemotePlaylist => {
        const {data} = playlistListResponseSchema.parse(response);
        return mapPlaylistDtoToRemotePlaylist(data[0]);
      },
    }),
    getPlaylistTracks: build.query<Track[], string>({
      query: playlistId => `/playlists/${playlistId}/tracks`,
      transformResponse: (response: unknown): Track[] => {
        const {data} = trackListResponseSchema.parse(response);
        return data.map(mapTrackDtoToTrack);
      },
    }),
    searchPlaylists: build.query<RemotePlaylist[], string>({
      query: searchQuery =>
        `/playlists/search?query=${encodeURIComponent(searchQuery)}`,
      transformResponse: (response: unknown): RemotePlaylist[] => {
        const {data} = playlistListResponseSchema.parse(response);
        return data.map(mapPlaylistDtoToRemotePlaylist);
      },
    }),
  }),
  overrideExisting: __DEV__,
});

export const {
  useGetTrendingPlaylistsQuery,
  useGetPlaylistQuery,
  useGetPlaylistTracksQuery,
  useSearchPlaylistsQuery,
} = remotePlaylistsApi;
