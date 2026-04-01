import { configureStore } from '@reduxjs/toolkit';

import authSlice from './feature/auth/authSlice';
import dashboardSlice from './feature/dashboard/dashboardSlice';
import mainSlice from './feature/main/mainSlice';
import { dashboardApi } from './services/dashboard';
import { transactionsApi } from './services/transactions';

export const store = () => {
  return configureStore({
    reducer: {
      auth: authSlice,
      dashboard: dashboardSlice,
      main: mainSlice,
      [transactionsApi.reducerPath]: transactionsApi.reducer,
      [dashboardApi.reducerPath]: dashboardApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredPaths: ['transactionsApi.queries', 'dashboardApi.queries'], // Ignore serialization checks for queries
        },
      }).concat(transactionsApi.middleware, dashboardApi.middleware), // Add both API middlewares
  });
};

export type AppStore = ReturnType<typeof store>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
