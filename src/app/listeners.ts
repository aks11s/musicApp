import {createListenerMiddleware} from '@reduxjs/toolkit';
import {RECENTLY_PLAYED_MIN_MS} from '../features/home/models/constants';
import {addRecentlyPlayed} from '../features/home/models/recentlyPlayed.repository';
import {activeTrackChanged, selectCurrentTrack, type PlayerState} from '../player/store/playerSlice';

export const listenerMiddleware = createListenerMiddleware<{player: PlayerState}>();

listenerMiddleware.startListening({
  actionCreator: activeTrackChanged,
  effect: async (action, listenerApi) => {
    listenerApi.cancelActiveListeners();
    if (action.payload === null) {
      return;
    }
    await listenerApi.delay(RECENTLY_PLAYED_MIN_MS);
    if (listenerApi.getState().player.status !== 'playing') {
      await listenerApi.condition((_, state) => state.player.status === 'playing');
    }

    const track = selectCurrentTrack(listenerApi.getState());
    if (track) {
      addRecentlyPlayed(track);
    }
  },
});
