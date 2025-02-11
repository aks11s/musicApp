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

// app-wide, not per hook: taps from different screens race each other too
let latestRequest = 0;

export const playQueue = async (tracks: Track[], startIndex: number): Promise<void> => {
  const request = ++latestRequest;
  const isStale = () => request !== latestRequest;

  try {
    // lazy setup: always runs on a user tap, so Android never sees it from the background
    await setupPlayer();
    const queue = await Promise.all(tracks.map(toPlayerTrack));
    if (isStale()) {
      return;
    }
    await TrackPlayer.setQueue(queue);
    if (isStale()) {
      return;
    }
    await TrackPlayer.skip(startIndex);
    if (isStale()) {
      return;
    }
    await TrackPlayer.play();
  } catch (error) {
    if (isStale()) {
      return;
    }
    // a failed tap must not leave the previous queue playing under the new one
    await TrackPlayer.reset().catch(() => undefined);
    throw error;
  }
};

export const play = (): Promise<void> => TrackPlayer.play();

export const pause = (): Promise<void> => TrackPlayer.pause();
