import { Types } from 'mongoose';

export type TransactionPaymentProps = {
  date: Date;
  categoryId?: Types.ObjectId;
  userId: string;
};

export type DateCurrencyProps = {
  date: Date;
  currency: string;
  userId: string;
};

export type DateRangeCurrencyProps = {
  startDate: Date;
  endDate: Date;
  currency: string;
  userId: string;
};
