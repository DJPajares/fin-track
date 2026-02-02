import {
  HydratedDocument,
  InferSchemaType,
  Schema,
  Types,
  model,
  // Document,
} from 'mongoose';
import CONSTANTS from '../../utilities/constants';

// import type { CategoryRequest } from '../../../../../shared/types/Category';

// type ICategoryDocument = Omit<CategoryRequest, 'type'> & {
//   type: Types.ObjectId;
//   userId?: Types.ObjectId;
// } & Document;

// const categorySchema = new Schema<ICategoryDocument>(
const categorySchema = new Schema(
  {
    id: {
      type: String,
      required: [true, CONSTANTS.validations.common.id.required],
    },
    name: {
      type: String,
      required: [true, CONSTANTS.validations.common.name.required],
    },
    type: { type: Types.ObjectId, ref: 'Type' },
    icon: String,
    isActive: {
      type: Boolean,
      default: true,
    },
    scope: {
      type: String,
      enum: ['global', 'custom'],
      default: 'global',
      required: [true, CONSTANTS.validations.common.id.required],
      index: true,
    },
    userId: {
      type: Types.ObjectId,
      ref: 'User',
      required: [
        function (this: { scope: string }) {
          return this.scope === 'custom';
        },
        CONSTANTS.validations.common.id.required,
      ],
      index: function (this: { scope: string }) {
        return this.scope === 'custom';
      },
    },
  },
  { timestamps: true },
);

// Ensure global category IDs are unique
categorySchema.index(
  { scope: 1, id: 1 },
  {
    unique: true,
    partialFilterExpression: { scope: 'global' },
  },
);

// Ensure global category names are unique
categorySchema.index(
  { scope: 1, name: 1 },
  {
    unique: true,
    partialFilterExpression: { scope: 'global' },
  },
);

// Ensure each user cannot create duplicate custom category IDs
categorySchema.index(
  { userId: 1, id: 1 },
  {
    unique: true,
    partialFilterExpression: { scope: 'custom' },
  },
);

// Ensure each user cannot create duplicate custom category names
categorySchema.index(
  { userId: 1, name: 1 },
  {
    unique: true,
    partialFilterExpression: { scope: 'custom' },
  },
);

// const CategoryModel = model<ICategoryDocument>('Category', categorySchema);
const CategoryModel = model('Category', categorySchema);

type CategoryProps = HydratedDocument<InferSchemaType<typeof categorySchema>>;

export { CategoryModel, CategoryProps };
