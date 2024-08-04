import { TransactionProps } from './transactionPaymentTypes';

type DashboardDataProps = {
  date: Date;
  currency: string;
};

type DashboardDataResult = {
  main: DashboardDataMainResult;
  categories: DashboardDataCategoryResult[];
};

type DashboardDataMainResult = {
  currency: string;
  budget: number;
  totalAmount: number;
  totalPaidAmount: number;
  balance: number;
  extra: number;
  paymentCompletionRate: number;
};

type DashboardDataCategoryResult = {
  _id: string;
  name: string;
  icon: string;
  totalAmount: number;
  totalPaidAmount: number;
  paymentCompletionRate: number;
  transactions: TransactionProps[];
};

type DashboardSelectionItemsProps = {
  _id: string;
  name: string;
};

export type {
  DashboardDataProps,
  DashboardDataResult,
  DashboardDataMainResult,
  DashboardDataCategoryResult,
  DashboardSelectionItemsProps
};
