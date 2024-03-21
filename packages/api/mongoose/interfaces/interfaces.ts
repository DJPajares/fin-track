import { HydratedDocument, InferSchemaType } from 'mongoose';
import { typeSchema } from '../models/typeModel';
import { categorySchema } from '../models/categoryModel';
import { currencySchema } from '../models/currencyModel';
import { logSchema } from '../models/logModel';
import { recurringSchema } from '../models/recurringModel';

type TypeProps = HydratedDocument<InferSchemaType<typeof typeSchema>>;
type CategoryProps = HydratedDocument<InferSchemaType<typeof categorySchema>>;
type CurrencyProps = HydratedDocument<InferSchemaType<typeof currencySchema>>;
type LogProps = HydratedDocument<InferSchemaType<typeof logSchema>>;
type RecurringProps = HydratedDocument<InferSchemaType<typeof recurringSchema>>;

export { TypeProps, CategoryProps, CurrencyProps, LogProps, RecurringProps };
