import mongoose, { Schema } from 'mongoose';

const currencySchema = new Schema({
  name: { type: String, required: true }
});

const CurrencyModel = mongoose.model('Currency', currencySchema);

export { currencySchema, CurrencyModel };
