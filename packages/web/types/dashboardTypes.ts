import { CurrencyProps } from '../../api/src/models/v1/currencyModel';

type DashboardDataProps = {
  date: Date;
  currency: string;
};

type DashboardSelectionItemsProps = {
  _id: string;
  name: string;
};

export type { DashboardDataProps, DashboardSelectionItemsProps };
