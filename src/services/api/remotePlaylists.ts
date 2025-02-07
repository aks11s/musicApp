import {z} from 'zod';
import {
  mapAlbumDtoToAlbum,
  mapPlaylistDtoToRemotePlaylist,
  mapTrackDtoToTrack,
} from '../../domain/mapper';
import {
  albumDtoSchema,
  playlistDtoSchema,
  trackDtoSchema,
} from '../../domain/schema';
import type {Album, RemotePlaylist, Track} from '../../domain/types';
import {baseApi} from './baseApi';

const playlistListResponseSchema = z.object({
  data: z.array(playlistDtoSchema),
});

const albumListResponseSchema = z.object({
  data: z.array(albumDtoSchema),
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
    getTrendingAlbums: build.query<Album[], number>({
      query: limit => `/playlists/trending?type=album&limit=${limit}`,
      transformResponse: (response: unknown): Album[] => {
        const {data} = albumListResponseSchema.parse(response);
        return data.map(mapAlbumDtoToAlbum);
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
  useGetTrendingAlbumsQuery,
  useGetPlaylistQuery,
  useGetPlaylistTracksQuery,
  useSearchPlaylistsQuery,
} = remotePlaylistsApi;
