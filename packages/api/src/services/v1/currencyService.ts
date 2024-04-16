import { CurrencyModel, CurrencyProps } from '../../models/v1/currencyModel';
import { PaginationProps } from '../../types/commonTypes';
import createPagination from '../../utilities/createPagination';

const create = async (data: CurrencyProps) => {
  return await CurrencyModel.create(data);
};

const getAll = async (query: PaginationProps) => {
  const totalDocuments = await CurrencyModel.countDocuments();
  const paginationResult = createPagination(query, totalDocuments);

  const { skip, limit, pagination } = paginationResult;
  const data = await CurrencyModel.find().skip(skip).limit(limit);

  return {
    data,
    pagination
  };
};

const get = async (_id: CurrencyProps['_id']) => {
  return await CurrencyModel.find({ _id });
};

const update = async (_id: CurrencyProps['_id'], data: CurrencyProps) => {
  return await CurrencyModel.findOneAndUpdate({ _id }, data, { new: true });
};

const remove = async (_id: CurrencyProps['_id']) => {
  return await CurrencyModel.findByIdAndDelete({ _id });
};

export { create, getAll, get, update, remove };
