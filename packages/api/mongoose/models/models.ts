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

const Type = mongoose.model('Type', typeSchema);
const Category = mongoose.model('Category', categorySchema);
const Currency = mongoose.model('Currency', currencySchema);
const Log = mongoose.model('Log', logSchema);
const Recurring = mongoose.model('Recurring', recurringSchema);

export { Type, Category, Currency, Log, Recurring };
