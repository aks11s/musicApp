import TrackPlayer, {Capability, type Track as PlayerTrack} from 'react-native-track-player';
import type {Track} from '../../domain/types';
import {getTrackStreamUrl} from '../api/tracks';

let setupPromise: Promise<void> | null = null;

const initPlayer = async (): Promise<void> => {
  try {
    await TrackPlayer.setupPlayer();
  } catch (error) {
    if ((error as {code?: string}).code !== 'player_already_initialized') {
      throw error;
    }
  }

  await TrackPlayer.updateOptions({
    capabilities: [Capability.Play, Capability.Pause],
    compactCapabilities: [Capability.Play, Capability.Pause],
  });
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
  // lazy setup: always runs on a user tap, so Android never sees it from the background
  await setupPlayer();
  const queue = await Promise.all(tracks.map(toPlayerTrack));
  await TrackPlayer.setQueue(queue);
  await TrackPlayer.skip(startIndex);
  await TrackPlayer.play();
};
