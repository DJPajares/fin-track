import type { IconProps } from '../components/shared/CardIcon';
import { ListProps } from './List';

type TransactionPaymentMainProps = {
  currency: string;
  budget: number;
  totalAmount: number;
  totalPaidAmount: number;
  balance: number;
  extra: number;
  paymentCompletionRate: number;
};

type TransactionProps = {
  _id: string;
  paymentId: string;
  name: string;
  amount: number;
  paidCurrency: string;
  paidAmount: number;
  isUpdated?: boolean;
  localAmount: {
    currency: ListProps;
    amount: number;
    paidAmount: number;
  };
};

type TransactionPaymentCategoryProps = {
  _id: string;
  name: string;
  icon?: IconProps;
  totalAmount: number;
  totalPaidAmount: number;
  paymentCompletionRate: number;
  transactions: TransactionProps[];
};

type TransactionPaymentProps = {
  main: TransactionPaymentMainProps;
  categories: TransactionPaymentCategoryProps[];
};

type TransactionDataUpdateProps = {
  _id: string;
  paidAmount: number;
  isUpdated?: boolean;
};

export type {
  TransactionProps,
  TransactionPaymentMainProps,
  TransactionPaymentCategoryProps,
  TransactionPaymentProps,
  TransactionDataUpdateProps,
};
