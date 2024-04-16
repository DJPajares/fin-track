import { HydratedDocument, InferSchemaType, Schema, model } from 'mongoose';
import CONSTANTS from '../../utilities/constants';

const typeSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, CONSTANTS.validations.common.name.required],
      unique: [true, CONSTANTS.validations.common.name.unique]
    }
  },
  { timestamps: true }
);

const TypeModel = model('Type', typeSchema);

type TypeProps = HydratedDocument<InferSchemaType<typeof typeSchema>>;

export { TypeModel, TypeProps };
