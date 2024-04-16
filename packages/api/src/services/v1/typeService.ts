import { TypeModel } from '../../models/v1/typeModel';
import type { TypeProps } from '../../models/v1/typeModel';
import { PaginationProps } from '../../types/commonTypes';
import createPagination from '../../utilities/createPagination';

const create = async (data: TypeProps) => {
  return await TypeModel.create(data);
};

const getAll = async (query: PaginationProps) => {
  const totalDocuments = await TypeModel.countDocuments();
  const paginationResult = createPagination(query, totalDocuments);
  const { skip, limit, pagination } = paginationResult;

  const data = await TypeModel.find().skip(skip).limit(limit);

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
