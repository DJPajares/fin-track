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
  name: string;
  amount: number;
  paidAmount: number;
};

type TransactionPaymentCategoryProps = {
  _id: string;
  name: string;
  totalAmount: number;
  totalPaidAmount: number;
  paymentCompletionRate: number;
  transactions: TransactionProps[];
};

type TransactionPaymentProps = {
  main: TransactionPaymentMainProps;
  categories: TransactionPaymentCategoryProps[];
};

export type {
  TransactionPaymentMainProps,
  TransactionPaymentCategoryProps,
  TransactionPaymentProps
};
