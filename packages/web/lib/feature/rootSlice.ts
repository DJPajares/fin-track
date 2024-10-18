import { combineReducers } from '@reduxjs/toolkit';
import dashboardSlice from './dashboard/dashboardSlice';
import mainDataSlice from './main/mainDataSlice';

const rootSlice = combineReducers({
  dashboard: dashboardSlice,
  main: mainDataSlice
});

export default rootSlice;
