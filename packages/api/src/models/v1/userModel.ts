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
    password: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLoginAt: Date,
    // For future social auth integration
    googleId: String,
    githubId: String,
  },
  {
    timestamps: true,
  },
);

// Index for email lookups
userSchema.index({ email: 1 });

const UserModel = model('User', userSchema);

type UserProps = HydratedDocument<InferSchemaType<typeof userSchema>>;

export { UserModel, UserProps };
