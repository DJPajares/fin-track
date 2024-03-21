import { HydratedDocument, InferSchemaType } from 'mongoose';
import { typeSchema } from '../models/typeModel';
import { categorySchema } from '../models/categoryModel';
import { currencySchema } from '../models/currencyModel';
import { logSchema } from '../models/logModel';
import { recurringSchema } from '../models/recurringModel';

// type TypeProps = HydratedDocument<InferSchemaType<typeof typeSchema>>;
type TypeProps = InferSchemaType<typeof typeSchema>;
type CategoryProps = InferSchemaType<typeof categorySchema>;
type CurrencyProps = InferSchemaType<typeof currencySchema>;
type LogProps = InferSchemaType<typeof logSchema>;
type RecurringProps = InferSchemaType<typeof recurringSchema>;

export { TypeProps, CategoryProps, CurrencyProps, LogProps, RecurringProps };
