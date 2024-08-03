import { combineReducers } from '@reduxjs/toolkit';
import dashboardSlice from './dashboard/dashboardSlice';

const rootSlice = combineReducers({
  dashboard: dashboardSlice
});

export type RootState = ReturnType<typeof rootSlice>;
export default rootSlice;
