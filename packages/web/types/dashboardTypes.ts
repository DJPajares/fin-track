import type {
  TransactionPaymentCategoryProps,
  TransactionPaymentMainProps,
  TransactionPaymentProps
} from './transactionPaymentTypes';
import type { TypeProps } from './type';

type DashboardDataProps = {
  date: Date;
  currency: string;
};

type DashboardDataResult = TransactionPaymentProps;

type DashboardDataMainResult = TransactionPaymentMainProps;

type DashboardDataCategoryResult = TransactionPaymentCategoryProps;

type DashboardSelectionItemsProps = TypeProps;

export type {
  DashboardDataProps,
  DashboardDataResult,
  DashboardDataMainResult,
  DashboardDataCategoryResult,
  DashboardSelectionItemsProps
};
