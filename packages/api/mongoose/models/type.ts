import mongoose, { Schema } from 'mongoose';

const typeSchema = new Schema({
  name: { type: String, required: true }
});

export const Type = mongoose.model('Type', typeSchema);
