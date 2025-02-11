import {createSlice, type PayloadAction} from '@reduxjs/toolkit';
import type {Track} from '../../domain/types';

export type PlayerState = {
  queue: Track[];
  currentIndex: number | null;
  error: string | null;
};

const initialState: PlayerState = {
  queue: [],
  currentIndex: null,
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
    playbackFailed: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    cleared: () => initialState,
  },
});

export const {queueStarted, playbackFailed, cleared} = playerSlice.actions;
export const playerReducer = playerSlice.reducer;
