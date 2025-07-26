import { combineReducers } from '@reduxjs/toolkit';
import dashboardSlice from './dashboard/dashboardSlice';
import mainSlice from './main/mainSlice';
import authSlice from './auth/authSlice';

const rootSlice = combineReducers({
  dashboard: dashboardSlice,
  main: mainSlice,
  auth: authSlice,
});

export default rootSlice;
