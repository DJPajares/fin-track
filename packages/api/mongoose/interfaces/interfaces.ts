import { InferSchemaType } from 'mongoose';
import { Type, Category, Currency, Log, Recurring } from '../models/models';

type TypeProps = InferSchemaType<typeof Type>;
type CategoryProps = InferSchemaType<typeof Category>;
type CurrencyProps = InferSchemaType<typeof Currency>;
type LogProps = InferSchemaType<typeof Log>;
type RecurringProps = InferSchemaType<typeof Recurring>;

export { TypeProps, CategoryProps, CurrencyProps, LogProps, RecurringProps };
