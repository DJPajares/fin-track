import mongoose, { Schema } from 'mongoose';

const typeSchema = new Schema({
  name: { type: String, required: true }
});

const categorySchema = new Schema({
  name: { type: String, required: true },
  type: { type: Schema.Types.ObjectId, ref: 'Type' }
});

const currencySchema = new Schema({
  name: { type: String, required: true }
});

const logSchema = new Schema({
  name: { type: String, required: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category' },
  amount: mongoose.Types.Decimal128,
  currency: { type: Schema.Types.ObjectId, ref: 'Currency' },
  date: Date
});

const recurringSchema = new Schema({
  name: { type: String, required: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category' },
  amount: mongoose.Types.Decimal128,
  currency: { type: Schema.Types.ObjectId, ref: 'Currency' },
  startDate: Date,
  endDate: Date,
  excludedDates: [Date]
});

export const Type = mongoose.model('Type', typeSchema);
export const Category = mongoose.model('Category', categorySchema);
export const Currency = mongoose.model('Currency', currencySchema);
export const Log = mongoose.model('Log', logSchema);
export const Recurring = mongoose.model('Recurring', recurringSchema);
