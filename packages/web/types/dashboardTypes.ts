import { TransactionProps } from './transactionPaymentTypes';

type DashboardDataProps = {
  date: Date;
  currency: string;
};

type DashboardDataResults = {
  main: DashboardDataMainResults;
  categories: DashboardDataCategoryResults[];
};

type DashboardDataMainResults = {
  currency: string;
  budget: number;
  totalAmount: number;
  totalPaidAmount: number;
  balance: number;
  extra: number;
  paymentCompletionRate: number;
};

type DashboardDataCategoryResults = {
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
  DashboardDataResults,
  DashboardDataMainResults,
  DashboardDataCategoryResults,
  DashboardSelectionItemsProps
};
