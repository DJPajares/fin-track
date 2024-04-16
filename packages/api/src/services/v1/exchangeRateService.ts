import { totalmem } from 'os';
import {
  ExchangeRateModel,
  ExchangeRateProps
} from '../../models/v1/exchangeRateModel';
import { PaginationProps } from '../../types/commonTypes';
import createPagination from '../../utilities/createPagination';

const create = async (data: ExchangeRateProps) => {
  return await ExchangeRateModel.create(data);
};

const getAll = async (query: PaginationProps) => {
  const totalDocuments = await ExchangeRateModel.countDocuments();
  const paginationResult = createPagination(query, totalDocuments);
  const { skip, limit, pagination } = paginationResult;

  const data = await ExchangeRateModel.find().skip(skip).limit(limit);

  return {
    data,
    pagination
  };
};

const get = async (_id: ExchangeRateProps['_id']) => {
  return await ExchangeRateModel.find({ _id });
};

const update = async (
  _id: ExchangeRateProps['_id'],
  data: ExchangeRateProps
) => {
  return await ExchangeRateModel.findByIdAndUpdate({ _id }, data, {
    new: true
  });
};

const remove = async (_id: ExchangeRateProps['_id']) => {
  return await ExchangeRateModel.findByIdAndDelete({ _id });
};

export { create, getAll, get, update, remove };
