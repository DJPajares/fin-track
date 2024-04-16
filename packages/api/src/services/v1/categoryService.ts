import { CategoryModel, CategoryProps } from '../../models/v1/categoryModel';
import { PaginationProps } from '../../types/commonTypes';
import createPagination from '../../utilities/createPagination';

const create = async (data: CategoryProps) => {
  return await CategoryModel.create(data);
};

const getAll = async (query: PaginationProps) => {
  const totalDocuments = await CategoryModel.countDocuments();
  const paginationResult = createPagination(query, totalDocuments);
  const { skip, limit, pagination } = paginationResult;

  const data = await CategoryModel.find()
    .populate('type')
    .skip(skip)
    .limit(limit);

  return {
    data,
    pagination
  };
};

const get = async (_id: CategoryProps['_id']) => {
  return await CategoryModel.findOne({ _id }).populate('type');
};

const update = async (_id: CategoryProps['_id'], data: CategoryProps) => {
  return await CategoryModel.findOneAndUpdate({ _id }, data, {
    new: true
  }).populate('type');
};

const remove = async (_id: CategoryProps['_id']) => {
  return await CategoryModel.findByIdAndDelete({ _id });
};

export { create, getAll, get, update, remove };
