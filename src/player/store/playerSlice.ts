import {createSlice, type PayloadAction} from '@reduxjs/toolkit';
import type {Track} from '../../domain/types';

export type PlayerState = {
  queue: Track[];
  currentIndex: number | null;
};

const initialState: PlayerState = {
  queue: [],
  currentIndex: null,
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    queueStarted: (state, action: PayloadAction<{tracks: Track[]; startIndex: number}>) => {
      state.queue = action.payload.tracks;
      state.currentIndex = action.payload.startIndex;
    },
    cleared: () => initialState,
  },
});

export const {queueStarted, cleared} = playerSlice.actions;
export const playerReducer = playerSlice.reducer;
