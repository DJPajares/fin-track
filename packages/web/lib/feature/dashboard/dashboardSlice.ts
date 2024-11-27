import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import moment from 'moment';
import { dateStringFormat } from '@shared/constants/dateStringFormat';

type DashboardDateProps = {
  date: string;
};

type DashboardCurrencyProps = {
  currency: {
    _id: string;
    name: string;
  };
};

type DashboardSliceProps = DashboardDateProps & DashboardCurrencyProps;

const initialState: DashboardSliceProps = {
  date: moment(new Date()).format(dateStringFormat),
  currency: {
    _id: '',
    name: 'SGD'
  }
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
      action: PayloadAction<DashboardCurrencyProps>
    ) => {
      state.currency = action.payload.currency;
    }
  }
});

export const { setDashboardDate, setDashboardCurrency } =
  dashboardSlice.actions;

export default dashboardSlice.reducer;
