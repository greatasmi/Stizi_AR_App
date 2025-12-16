import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';
import stampReducer from '../slices/stampSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    stamp: stampReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
