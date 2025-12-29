import type { TransactionProps } from '../../models/v1/transactionModel';

// Create Request
export type CreateTransactionBody = Partial<
  Omit<TransactionProps, '_id' | 'createdAt' | 'updatedAt'>
>;

// Batch Create Request
export type CreateManyTransactionsBody = CreateTransactionBody[];

// Update Request
export type UpdateTransactionBody = Partial<CreateTransactionBody>;

// Query filters for list endpoints
export type FetchByDateProps = {
  date: Date;
  type?: string;
  currency: string;
  userId: string;
};

export type FetchByDateRangeProps = {
  startDate: Date;
  endDate: Date;
  type?: string;
  currency: string;
  userId: string;
};
