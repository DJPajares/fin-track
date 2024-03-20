import mongoose, { Schema } from 'mongoose';

const recurringSchema = new Schema({
  name: { type: String, required: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category' },
  amount: mongoose.Types.Decimal128,
  currency: { type: Schema.Types.ObjectId, ref: 'Currency' },
  startDate: Date,
  endDate: Date,
  excludedDates: [Date]
});

export const Recurring = mongoose.model('Recurring', recurringSchema);
