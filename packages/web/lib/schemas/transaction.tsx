import { z } from 'zod';

const transactionSchema = z.object({
  id: z.string().optional(),
  category: z.string().min(1, {
    message: 'Please select a category',
  }),
  name: z.string().min(1, {
    message: 'Please enter a title',
  }),
  currency: z.string().min(1, {
    message: 'Please select a currency',
  }),
  amount: z
    .number({
      message: 'Please enter an amount',
    })
    .min(0, {
      message: 'Amount must be a positive number',
    }),
  description: z
    .string()
    .max(240, { message: 'Description must be under 240 characters.' })
    .optional(),
  isRecurring: z.boolean(),
  startDate: z.date({
    message: 'Please select a start date.',
  }),
  endDate: z.date(),
  excludedDates: z
    .object({
      value: z.string(),
      label: z.string(),
    })
    .array()
    .optional(),
});

type TransactionFormProps = z.infer<typeof transactionSchema>;

export { transactionSchema, type TransactionFormProps };
