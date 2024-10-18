import type {
  TransactionPaymentCategoryProps,
  TransactionPaymentMainProps,
  TransactionPaymentProps
} from './transactionPaymentTypes';
import type { ListProps } from './List';

type DashboardDataProps = {
  date: Date;
  currency: string;
};

type DashboardDataResult = TransactionPaymentProps;

type DashboardDataMainResult = TransactionPaymentMainProps;

type DashboardDataCategoryResult = TransactionPaymentCategoryProps;

type DashboardSelectionItemsProps = ListProps;

export type {
  DashboardDataProps,
  DashboardDataResult,
  DashboardDataMainResult,
  DashboardDataCategoryResult,
  DashboardSelectionItemsProps
};
