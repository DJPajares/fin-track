import {
  ExchangeRateModel,
  ExchangeRateProps
} from '../../models/v1/exchangeRateModel';
import type { QueryParamsProps } from '../../types/commonTypes';
import createPagination from '../../utilities/createPagination';

const create = async (data: ExchangeRateProps) => {
  return await ExchangeRateModel.create(data);
};

const getAll = async (query: QueryParamsProps) => {
  // [SAMPLE ENDPOINT]: /exchangeRates?page=2&limit=4&sort=-name

  const { filter, sort } = query;

  // Pagination
  const totalDocuments = await ExchangeRateModel.countDocuments();
  const paginationResult = createPagination(query, totalDocuments);
  const { skip, limit, pagination } = paginationResult;

  // Filter
  const filterObj = filter ? JSON.parse(filter) : {};

  // Sort
  let sortObj: any = {};
  if (sort) {
    sort.split(',').forEach((sortField: any) => {
      const order = sortField.startsWith('-') ? -1 : 1;
      const field = sortField.replace(/^[-+]/, '');

      sortObj[field] = order;
    });
  }

  const data = await ExchangeRateModel.find(filterObj)
    .sort(sortObj)
    .collation({ locale: 'en' }) // case insensitive sorting
    .skip(skip)
    .limit(limit);

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
