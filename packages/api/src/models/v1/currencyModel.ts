import { HydratedDocument, InferSchemaType, Schema, model } from 'mongoose';
import constants from '../../utilities/constants';

const currencySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, constants.validations.common.name.required],
      unique: [true, constants.validations.common.name.unique]
    },
    description: String
  },
  { timestamps: true }
);

const CurrencyModel = model('Currency', currencySchema);

type CurrencyProps = HydratedDocument<InferSchemaType<typeof currencySchema>>;

export { CurrencyModel, CurrencyProps };
