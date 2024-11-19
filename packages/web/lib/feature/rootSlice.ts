import { combineReducers } from '@reduxjs/toolkit';
import dashboardSlice from './dashboard/dashboardSlice';
import mainSlice from './main/mainSlice';

const rootSlice = combineReducers({
  dashboard: dashboardSlice,
  main: mainSlice
});

export default rootSlice;
