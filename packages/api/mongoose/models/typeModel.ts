import mongoose, { Schema } from 'mongoose';

const typeSchema = new Schema({
  name: { type: String, required: true }
});

const TypeModel = mongoose.model('Type', typeSchema);

export { typeSchema, TypeModel };
