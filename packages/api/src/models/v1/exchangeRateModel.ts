import { HydratedDocument, InferSchemaType, Schema, model } from 'mongoose';

const exchangeRateSchema = new Schema({
  baseCurrency: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  rates: {
    type: Map,
    of: Number,
    required: true
  }
});

const ExchangeRateModel = model('Exchange Rate', exchangeRateSchema);

type ExchangeRateProps = HydratedDocument<
  InferSchemaType<typeof exchangeRateSchema>
>;

export { ExchangeRateModel, ExchangeRateProps };
