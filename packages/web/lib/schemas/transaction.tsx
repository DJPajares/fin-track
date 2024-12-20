import { z } from 'zod';

const transactionSchema = z.object({
  startDate: z.date({
    required_error: 'Please select a start date.'
  }),
  endDate: z.date(),
  category: z.string().min(1, {
    message: 'Please select a category'
  }),
  name: z.string().min(1, {
    message: 'Please enter a title'
  }),
  currency: z.string().min(1, {
    message: 'Please select a currency'
  }),
  amount: z.coerce.number({
    required_error: 'Please enter an amount'
  }),
  isRecurring: z.boolean(),
  excludedDates: z
    .object({
      value: z.string(),
      label: z.string()
    })
    .array()
    .optional()
});

type TransactionFormProps = z.infer<typeof transactionSchema>;

export { transactionSchema, type TransactionFormProps };
