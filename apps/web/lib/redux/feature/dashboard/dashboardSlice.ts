import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { dateStringFormat } from '@shared/constants/dateStringFormat';
import type { ListProps } from '@shared/types/List';
import moment from 'moment';

type DashboardDateProps = {
  date: string;
};

type DashboardCurrencyProps = {
  currency: ListProps;
};

export type DashboardSliceProps = DashboardDateProps & DashboardCurrencyProps;

const initialState: DashboardSliceProps = {
  date: moment(new Date()).format(dateStringFormat),
  currency: {
    value: '',
    label: '',
  },
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setDashboardDate: (state, action: PayloadAction<DashboardDateProps>) => {
      state.date = action.payload.date;
    },
    setDashboardCurrency: (
      state,
      action: PayloadAction<DashboardCurrencyProps>,
    ) => {
      state.currency = action.payload.currency;
    },
  },
});

export const { setDashboardDate, setDashboardCurrency } =
  dashboardSlice.actions;

export default dashboardSlice.reducer;
