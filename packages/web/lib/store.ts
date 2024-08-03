import { configureStore } from '@reduxjs/toolkit';
import rootSlice from './feature/rootSlice';

const store = configureStore({
  reducer: rootSlice
});

export type AppDispatch = typeof store.dispatch;
export default store;
