import { HydratedDocument, InferSchemaType, Schema, model } from 'mongoose';
import CONSTANTS from '../../utilities/constants';

const userSchema = new Schema(
  {
    // External auth id (Better Auth compatible id)
    id: {
      type: String,
      required: [true, CONSTANTS.validations.common.id.required],
      unique: [true, CONSTANTS.validations.common.id.unique],
    },
    email: { type: String },
    name: { type: String },
    image: { type: String },
  },
  { timestamps: true },
);

const UserModel = model('User', userSchema);

type UserProps = HydratedDocument<InferSchemaType<typeof userSchema>>;

export { UserModel, type UserProps };
