import type { CardIconProps } from './CardIcon';

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
};

type TransactionPaymentCategoryProps = {
  _id: string;
  name: string;
  icon?: CardIconProps;
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
  _id: any;
  paidAmount: number;
  isUpdated?: boolean;
};

export type {
  TransactionProps,
  TransactionPaymentMainProps,
  TransactionPaymentCategoryProps,
  TransactionPaymentProps,
  TransactionDataUpdateProps
};
