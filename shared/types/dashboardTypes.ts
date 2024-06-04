import { CurrencyProps } from '../../packages/api/src/models/v1/currencyModel';

type DashboardDataProps = {
  date: Date;
  currencyId: string;
};

type DashboardCurrencyProps = {
  _id: string;
  name: string;
};

export type { DashboardDataProps, DashboardCurrencyProps };
