import { HydratedDocument, InferSchemaType, Schema, model } from 'mongoose';

const transactionSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    currency: { type: Schema.Types.ObjectId, ref: 'Currency' },
    amount: { type: Schema.Types.Decimal128, default: 0 },
    description: String,
    isRecurring: Boolean,
    startDate: Date,
    endDate: Date,
    excludedDates: [Date],
  },
  {
    timestamps: true,
  },
);

const TransactionModel = model('Transaction', transactionSchema);

type TransactionProps = HydratedDocument<
  InferSchemaType<typeof transactionSchema>
>;

export { TransactionModel, TransactionProps };
