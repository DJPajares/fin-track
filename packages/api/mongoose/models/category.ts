import mongoose, { Schema } from 'mongoose';

const categorySchema = new Schema({
  name: { type: String, required: true },
  type: { type: Schema.Types.ObjectId, ref: 'Type' }
});

export const Category = mongoose.model('Category', categorySchema);
