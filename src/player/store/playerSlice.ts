import {createSlice, type PayloadAction} from '@reduxjs/toolkit';
import type {Track} from '../../domain/types';
import type {EngineState} from '../../services/player/playerService';

export type PlayerState = {
  queue: Track[];
  currentIndex: number | null;
  status: EngineState;
  error: string | null;
};

const initialState: PlayerState = {
  queue: [],
  currentIndex: null,
  status: 'idle',
  error: null,
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    queueStarted: (state, action: PayloadAction<{tracks: Track[]; startIndex: number}>) => {
      state.queue = action.payload.tracks;
      state.currentIndex = action.payload.startIndex;
      state.error = null;
    },
    statusChanged: (state, action: PayloadAction<EngineState>) => {
      state.status = action.payload;
    },
    playbackFailed: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    cleared: () => initialState,
  },
});

export const {queueStarted, statusChanged, playbackFailed, cleared} = playerSlice.actions;
export const playerReducer = playerSlice.reducer;

export const selectCurrentTrack = (state: {player: PlayerState}): Track | null => {
  const {queue, currentIndex} = state.player;
  return currentIndex === null ? null : queue[currentIndex] ?? null;
};
