import type { PaymentProps } from '../../models/v1/paymentModel';

// Create Request
export type CreatePaymentBody = Partial<
  Omit<PaymentProps, '_id' | 'createdAt' | 'updatedAt'>
>;

export type UpsertManyPaymentsBody = {
  payments: Omit<PaymentProps, 'userId' | 'createdAt' | 'updatedAt'>[];
  userId: string;
};

// Update Request
export type UpdatePaymentBody = Partial<CreatePaymentBody>;
