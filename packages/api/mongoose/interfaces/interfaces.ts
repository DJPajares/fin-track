import { InferSchemaType } from 'mongoose';
import { Type, Category, Currency, Log, Recurring } from '../models/models';

export type TypeProps = InferSchemaType<typeof Type>;
export type CategoryProps = InferSchemaType<typeof Category>;
export type CurrencyProps = InferSchemaType<typeof Currency>;
export type LogProps = InferSchemaType<typeof Log>;
export type RecurringProps = InferSchemaType<typeof Recurring>;
