import { CurrencyModel, CurrencyProps } from '../../models/v1/currencyModel';
import createPagination from '../../utilities/createPagination';

import type { QueryParamsProps, SortObjProps } from '../../types/commonTypes';

const create = async (data: CurrencyProps) => {
  return await CurrencyModel.create(data);
};

const createMany = async (data: CurrencyProps[]) => {
  return await CurrencyModel.insertMany(data);
};

const getAll = async (query: QueryParamsProps) => {
  // [SAMPLE ENDPOINT]: /currencies?page=2&limit=4&sort=-name

  const { filter, sort } = query;

  // Pagination
  const totalDocuments = await CurrencyModel.countDocuments();
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

  const data = await CurrencyModel.find(filterObj)
    .sort(sortObj)
    .skip(skip)
    .limit(limit);

  return {
    data,
    pagination,
  };
};

const get = async (_id: CurrencyProps['_id']) => {
  return await CurrencyModel.find({ _id });
};

const getByName = async (name: string) => {
  return await CurrencyModel.findOne({ name });
};

const update = async (_id: CurrencyProps['_id'], data: CurrencyProps) => {
  return await CurrencyModel.findOneAndUpdate({ _id }, data, { new: true });
};

const remove = async (_id: CurrencyProps['_id']) => {
  return await CurrencyModel.findByIdAndDelete({ _id });
};

export { create, createMany, getAll, get, getByName, update, remove };
