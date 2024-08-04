import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type DashboardDateProps = {
  date: Date;
};

type DashboardCurrencyProps = {
  currency: {
    _id: string;
    name: string;
  };
};

const initialState: DashboardDateProps & DashboardCurrencyProps = {
  date: new Date(),
  currency: {
    _id: '',
    name: ''
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