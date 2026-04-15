import type { ListProps } from '@shared/types/List';

import type {
  TransactionPaymentCategoryProps,
  TransactionPaymentMainProps,
  TransactionPaymentProps,
} from './TransactionPayment';

type DashboardDataProps = {
  date: Date;
  currency: string;
  userId: string;
};

type DashboardDataResult = TransactionPaymentProps;

type DashboardDataMainResult = TransactionPaymentMainProps;

type DashboardDataCategoryResult = TransactionPaymentCategoryProps;

type DashboardSelectionItemsProps = ListProps;

export type {
  DashboardDataCategoryResult,
  DashboardDataMainResult,
  DashboardDataProps,
  DashboardDataResult,
  DashboardSelectionItemsProps,
};
