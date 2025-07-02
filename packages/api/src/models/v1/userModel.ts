import { HydratedDocument, InferSchemaType, Schema, model } from 'mongoose';

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      trim: true,
    },
    provider: {
      type: String,
      required: true,
      enum: ['github', 'google'],
    },
    providerId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// Compound index to ensure unique provider + providerId combination
userSchema.index({ provider: 1, providerId: 1 }, { unique: true });

const UserModel = model('User', userSchema);

type UserProps = HydratedDocument<InferSchemaType<typeof userSchema>>;

export { UserModel, UserProps };
