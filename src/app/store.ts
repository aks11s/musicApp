import {configureStore} from '@reduxjs/toolkit';
import {playerReducer} from '../player/store/playerSlice';
import {baseApi} from '../services/api/baseApi';
import {listenerMiddleware} from './listeners';

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    player: playerReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().prepend(listenerMiddleware.middleware).concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
