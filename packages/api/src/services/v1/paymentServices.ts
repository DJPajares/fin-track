import { Types } from 'mongoose';
import { PaymentModel, PaymentProps } from '../../models/v1/paymentModel';
import createPagination from '../../utilities/createPagination';

import type { QueryParamsProps, SortObjProps } from '../../types/commonTypes';
import type {
  CreatePaymentBody,
  UpdatePaymentBody,
  UpsertManyPaymentsBody,
} from '../../types/v1/paymentRequestTypes';

const create = async (data: CreatePaymentBody) => {
  return await PaymentModel.create(data);
};

const getAll = async (query: QueryParamsProps) => {
  // [SAMPLE ENDPOINT]: /payments?page=2&limit=4&sort=-name

  const { filter, sort } = query;

  // Pagination
  const totalDocuments = await PaymentModel.countDocuments();
  const paginationResult = createPagination(query, totalDocuments);
  const { skip, limit, pagination } = paginationResult;

  // Filter
  const filterObj = filter ? JSON.parse(filter) : {};

  // Sort
  const sortObj: SortObjProps = {};
  if (sort) {
    sort.split(',').forEach((sortField: string) => {
      const order = sortField.startsWith('-') ? -1 : 1;
      const field = sortField.replace(/^[-+]/, '');

      sortObj[field] = order;
    });
  }

  const data = await PaymentModel.find(filterObj)
    .populate(['transaction', 'currency'])
    .sort(sortObj)
    .collation({ locale: 'en' }) // case insensitive sorting
    .skip(skip)
    .limit(limit);

  return {
    data,
    pagination,
  };
};

const get = async (_id: PaymentProps['_id']) => {
  return await PaymentModel.find({ _id }).populate(['transaction', 'currency']);
};

const update = async (_id: PaymentProps['_id'], data: UpdatePaymentBody) => {
  return await PaymentModel.findOneAndUpdate({ _id }, data, {
    new: true,
    upsert: true,
  }).populate('transaction');
};

const upsertMany = async (body: UpsertManyPaymentsBody) => {
  const { payments, userId } = body;

  if (!userId) {
    const error = new Error('userId is required to upsert payments');
    (error as Error & { statusCode?: number }).statusCode = 400;
    throw error;
  }

  const upsertPromises = payments.map((payment) => {
    const _id = payment._id || new Types.ObjectId();

    return PaymentModel.findOneAndUpdate(
      { _id, userId },
      {
        userId,
        transaction: payment.transaction,
        currency: payment.currency,
        amount: payment.amount,
        date: payment.date,
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      },
    ).exec();
  });

  const results = await Promise.all(upsertPromises);

  return results;
};

const remove = async (_id: PaymentProps['_id']) => {
  return await PaymentModel.findByIdAndDelete({ _id });
};

export { create, getAll, get, update, upsertMany, remove };
