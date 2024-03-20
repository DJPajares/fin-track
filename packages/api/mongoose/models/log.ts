import mongoose, { Schema } from 'mongoose';

const logSchema = new Schema({
  name: { type: String, required: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category' },
  amount: mongoose.Types.Decimal128,
  currency: { type: Schema.Types.ObjectId, ref: 'Currency' },
  date: Date
});

export const Log = mongoose.model('Log', logSchema);
