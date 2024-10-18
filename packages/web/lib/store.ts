import { configureStore } from '@reduxjs/toolkit';
import rootSlice from './feature/rootSlice';

export const store = () => {
  return configureStore({
    reducer: rootSlice
  });
};

export type AppStore = ReturnType<typeof store>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
