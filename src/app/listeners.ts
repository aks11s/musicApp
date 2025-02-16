import {createListenerMiddleware} from '@reduxjs/toolkit';
import {RECENTLY_PLAYED_MIN_MS} from '../features/home/models/constants';
import {addRecentlyPlayed} from '../features/home/models/recentlyPlayed.repository';
import {activeTrackChanged, selectCurrentTrack, type PlayerState} from '../player/store/playerSlice';

export const listenerMiddleware = createListenerMiddleware<{player: PlayerState}>();

listenerMiddleware.startListening({
  actionCreator: activeTrackChanged,
  effect: async (action, listenerApi) => {
    if (action.payload === null) {
      return;
    }
    listenerApi.cancelActiveListeners();
    await listenerApi.delay(RECENTLY_PLAYED_MIN_MS);

    const track = selectCurrentTrack(listenerApi.getState());
    if (track) {
      addRecentlyPlayed(track);
    }
  },
});
