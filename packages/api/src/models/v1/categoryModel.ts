import {
  HydratedDocument,
  InferSchemaType,
  Schema,
  Types,
  model,
} from 'mongoose';
import CONSTANTS from '../../utilities/constants';

const categorySchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
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
    active: Boolean,
  },
  { timestamps: true },
);

const CategoryModel = model('Category', categorySchema);

type CategoryProps = HydratedDocument<InferSchemaType<typeof categorySchema>>;

export { CategoryModel, CategoryProps };
