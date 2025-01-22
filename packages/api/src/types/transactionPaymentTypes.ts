import { Types } from 'mongoose';
import type { CategoryProps } from '../models/v1/categoryModel';
import type { TransactionProps } from '../models/v1/transactionModel';
import type { TypeProps } from '../models/v1/typeModel';
import type { CurrencyProps } from '../models/v1/currencyModel';
import type { PaymentProps } from '../models/v1/paymentModel';

type IncomeTransactionsProps = TransactionProps & {
  categoryId: CategoryProps['_id'];
  category: CategoryProps['name'];
  typeId: TypeProps['_id'];
  type: TypeProps['name'];
  currencyId: CurrencyProps['_id'];
  currency: CurrencyProps['name'];
};

type ExpenseTransactionPaymentsProps = TransactionProps & {
  categoryId: CategoryProps['_id'];
  category: CategoryProps['name'];
  categoryIcon: CategoryProps['icon'];
  typeId: TypeProps['_id'];
  type: TypeProps['name'];
  currencyId: CurrencyProps['_id'];
  currency: CurrencyProps['name'];
  paymentId: PaymentProps['_id'];
  paidAmount: PaymentProps['amount'];
  paidCurrencyId: CurrencyProps['_id'];
  paidCurrency: CurrencyProps['name'];
};

type ProcessTransactionPaymentDataProps = {
  incomeTransactions: IncomeTransactionsProps[];
  expenseTransactionPayments: ExpenseTransactionPaymentsProps[];
  rates: Record<string, number>;
  currency: string;
};

type LocalAmountValueProps = {
  currency: {
    _id: Types.ObjectId;
    name: string;
  };
  amount: number;
  paidCurrency: {
    _id: Types.ObjectId;
    name: string;
  };
  paidAmount: number;
};

type Transaction = {
  _id: Types.ObjectId;
  paymentId: Types.ObjectId;
  name: string;
  amount: number;
  paidAmount: number;
  localAmount: LocalAmountValueProps;
};

type CategoryAccumulatorProps = {
  _id: Types.ObjectId;
  name: string;
  icon: CategoryProps['icon'];
  totalAmount: number;
  totalPaidAmount: number;
  paymentCompletionRate: number;
  transactions: Transaction[];
};

type AccumulatorProps = Record<string, CategoryAccumulatorProps>;

export {
  IncomeTransactionsProps,
  ExpenseTransactionPaymentsProps,
  ProcessTransactionPaymentDataProps,
  AccumulatorProps,
};
