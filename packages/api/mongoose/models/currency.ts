import mongoose, { Schema } from 'mongoose';

const currencySchema = new Schema({
  name: { type: String, required: true }
});

export const Currency = mongoose.model('Currency', currencySchema);
