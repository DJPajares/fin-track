import { TypeModel } from '../../models/v1/typeModel';
import type { TypeProps } from '../../models/v1/typeModel';
import type {
  PaginationProps,
  QueryParamsProps
} from '../../types/commonTypes';
import createPagination from '../../utilities/createPagination';

const create = async (data: TypeProps) => {
  return await TypeModel.create(data);
};

const getAll = async (query: QueryParamsProps) => {
  // [SAMPLE ENDPOINT]: /types?page=2&limit=4&sort=-name

  const { filter, sort } = query;

  // Pagination
  const totalDocuments = await TypeModel.countDocuments();
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

  const data = await TypeModel.find(filterObj)
    .sort(sortObj)
    .collation({ locale: 'en' }) // case insensitive sorting
    .skip(skip)
    .limit(limit);

  return {
    data,
    pagination
  };
};

const get = async (_id: TypeProps['_id']) => {
  return await TypeModel.findOne({ _id });
};

const update = async (_id: TypeProps['_id'], data: TypeProps) => {
  return await TypeModel.findOneAndUpdate({ _id }, data, { new: true });
};

const remove = async (_id: TypeProps['_id']) => {
  return await TypeModel.findByIdAndDelete({ _id });
};

export { create, getAll, get, update, remove };
