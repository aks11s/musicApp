import {configureStore} from '@reduxjs/toolkit';

// no slices yet — a plain identity reducer keeps the store valid until the first one lands
export const store = configureStore({
  reducer: state => state,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
