import { Types } from 'mongoose';
import { PaymentModel, PaymentProps } from '../../models/v1/paymentModel';
import type { PaginationProps } from '../../types/commonTypes';
import createPagination from '../../utilities/createPagination';

const create = async (data: PaymentProps) => {
  return await PaymentModel.create(data);
};

const getAll = async (query: PaginationProps) => {
  const totalDocuments = await PaymentModel.countDocuments();
  const paginationResult = createPagination(query, totalDocuments);
  const { skip, limit, pagination } = paginationResult;

  const data = await PaymentModel.find()
    .populate(['transaction', 'currency'])
    .skip(skip)
    .limit(limit);

  return {
    data,
    pagination
  };
};

const get = async (_id: PaymentProps['_id']) => {
  return await PaymentModel.find({ _id }).populate(['transaction', 'currency']);
};

const update = async (_id: PaymentProps['_id'], data: PaymentProps) => {
  return await PaymentModel.findOneAndUpdate({ _id }, data, {
    new: true,
    upsert: true
  }).populate('transaction');
};

const upsertMany = async (data: PaymentProps[]) => {
  const upsertPromises = data.map((payment) => {
    const _id = payment._id || new Types.ObjectId();

    return PaymentModel.findOneAndUpdate(
      { _id },
      {
        transaction: payment.transaction,
        currency: payment.currency,
        amount: payment.amount,
        date: payment.date
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true
      }
    ).exec();
  });

  const results = await Promise.all(upsertPromises);

  return results;
};

const remove = async (_id: PaymentProps['_id']) => {
  return await PaymentModel.findByIdAndDelete({ _id });
};

export { create, getAll, get, update, upsertMany, remove };
