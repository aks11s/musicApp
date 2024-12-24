export type Track = {
  id: string;
  title: string;
  artist: string;
  artworkUrl: string;
  durationSeconds: number;
};

export type Artist = {
  id: string;
  name: string;
  handle: string;
  avatarUrl: string;
  followerCount: number;
};

export type RemotePlaylist = {
  id: string;
  title: string;
  curatorName: string;
  artworkUrl: string;
  trackCount: number;
};
