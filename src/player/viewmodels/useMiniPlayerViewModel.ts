import {useState} from 'react';

export type MiniPlayerTrack = {
  id: string;
  title: string;
  artist: string;
  gradient: [string, string];
};

export type MiniPlayerViewModel = {
  track: MiniPlayerTrack | null;
  isPlaying: boolean;
  progress: number;
  stop: () => void;
};

// TODO: replace with real playerSlice state once react-native-track-player is wired up
const MOCK_TRACK: MiniPlayerTrack = {
  id: 'track-1',
  title: 'Starfall',
  artist: 'Aria Nova',
  gradient: ['#FF7A59', '#FFB199'],
};

export function useMiniPlayerViewModel(): MiniPlayerViewModel {
  const [track, setTrack] = useState<MiniPlayerTrack | null>(MOCK_TRACK);

  return {
    track,
    isPlaying: true,
    progress: 0.35,
    stop: () => setTrack(null),
  };
}
