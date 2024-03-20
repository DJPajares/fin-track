import { InferSchemaType } from 'mongoose';
import { Type } from '../models/type';
import { Category } from '../models/category';
import { Currency } from '../models/currency';
import { Log } from '../models/log';
import { Recurring } from '../models/recurring';

type TypeProps = InferSchemaType<typeof Type>;
type CategoryProps = InferSchemaType<typeof Category>;
type CurrencyProps = InferSchemaType<typeof Currency>;
type LogProps = InferSchemaType<typeof Log>;
type RecurringProps = InferSchemaType<typeof Recurring>;

export { TypeProps, CategoryProps, CurrencyProps, LogProps, RecurringProps };
