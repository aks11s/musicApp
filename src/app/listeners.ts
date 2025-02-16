import {createListenerMiddleware} from '@reduxjs/toolkit';
import {addRecentlyPlayed} from '../features/home/models/recentlyPlayed.repository';
import {queueStarted} from '../player/store/playerSlice';

export const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  actionCreator: queueStarted,
  effect: ({payload}) => {
    const track = payload.tracks[payload.startIndex];
    if (track) {
      addRecentlyPlayed(track);
    }
  },
});
