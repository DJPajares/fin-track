import {
  TransactionModel,
  TransactionProps
} from '../../models/v1/transactionModel';
import { PaginationProps } from '../../types/commonTypes';
import createPagination from '../../utilities/createPagination';

const create = async (data: TransactionProps) => {
  return await TransactionModel.create(data);
};

const getAll = async (query: PaginationProps) => {
  const totalDocuments = await TransactionModel.countDocuments();
  const paginationResult = createPagination(query, totalDocuments);

  const { skip, limit, pagination } = paginationResult;

  const data = await TransactionModel.find()
    .populate(['category', 'currency'])
    .skip(skip)
    .limit(limit);

  return {
    data,
    pagination
  };
};

const get = async (_id: TransactionProps['_id']) => {
  return await TransactionModel.find({ _id });
};

const update = async (_id: TransactionProps['_id'], data: TransactionProps) => {
  return await TransactionModel.findOneAndUpdate({ _id }, data, {
    new: true
  }).populate(['category', 'currency']);
};

const remove = async (_id: TransactionProps['_id']) => {
  return await TransactionModel.findByIdAndDelete({ _id });
};

export { create, getAll, get, update, remove };
