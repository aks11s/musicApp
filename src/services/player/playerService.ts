import TrackPlayer, {type Track as PlayerTrack} from 'react-native-track-player';
import type {Track} from '../../domain/types';
import {getTrackStreamUrl} from '../api/tracks';

let setupPromise: Promise<void> | null = null;

const initPlayer = async (): Promise<void> => {
  try {
    await TrackPlayer.setupPlayer();
  } catch (error) {
    // the native player outlives a JS reload, so a second setup is expected in dev
    if ((error as {code?: string}).code !== 'player_already_initialized') {
      throw error;
    }
  }
};

export const setupPlayer = (): Promise<void> => {
  if (!setupPromise) {
    setupPromise = initPlayer().catch(error => {
      setupPromise = null;
      throw error;
    });
  }
  return setupPromise;
};

const toPlayerTrack = async (track: Track): Promise<PlayerTrack> => ({
  id: track.id,
  url: await getTrackStreamUrl(track.id),
  title: track.title,
  artist: track.artist,
  artwork: track.artworkUrl || undefined,
  duration: track.durationSeconds,
});

export const playQueue = async (tracks: Track[], startIndex: number): Promise<void> => {
  const queue = await Promise.all(tracks.map(toPlayerTrack));
  await TrackPlayer.setQueue(queue);
  await TrackPlayer.skip(startIndex);
  await TrackPlayer.play();
};
