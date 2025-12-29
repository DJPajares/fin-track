import { configureStore } from '@reduxjs/toolkit';
import dashboardSlice from './feature/dashboard/dashboardSlice';
import mainSlice from './feature/main/mainSlice';
import userSlice from './feature/user/userSlice';
import { transactionsApi } from './services/transactions';
import { dashboardApi } from './services/dashboard';

export const store = () => {
  return configureStore({
    reducer: {
      dashboard: dashboardSlice,
      main: mainSlice,
      user: userSlice,
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
