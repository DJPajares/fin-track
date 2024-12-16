import { configureStore } from '@reduxjs/toolkit';
import rootSlice from './feature/rootSlice';
import dashboardSlice from './feature/dashboard/dashboardSlice';
import mainSlice from './feature/main/mainSlice';
import { transactionsApi } from './services/transactions';

export const store = () => {
  return configureStore({
    reducer: {
      dashboard: dashboardSlice,
      main: mainSlice,
      [transactionsApi.reducerPath]: transactionsApi.reducer
    },
    // middleware: (getDefaultMiddleware) =>
    //   getDefaultMiddleware().concat(transactionsApi.middleware)
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredPaths: ['transactionsApi.queries'] // Ignore serialization checks for queries
        }
      }).concat(transactionsApi.middleware)
  });
};

export type AppStore = ReturnType<typeof store>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
