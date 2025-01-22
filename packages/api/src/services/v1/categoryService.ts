import { Types } from 'mongoose';
import {
  CategoryModel,
  type CategoryProps,
} from '../../models/v1/categoryModel';

import createPagination from '../../utilities/createPagination';

import type { QueryParamsProps, SortObjProps } from '../../types/commonTypes';

const create = async (data: CategoryProps) => {
  return await CategoryModel.create(data);
};

const getAll = async (query: QueryParamsProps) => {
  // [SAMPLE ENDPOINT]: /categories?page=2&limit=4&sort=-name

  const { filter, sort } = query;

  // Pagination
  const totalDocuments = await CategoryModel.countDocuments();
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

  const data = await CategoryModel.find(filterObj)
    .populate('type')
    .sort(sortObj)
    .collation({ locale: 'en' }) // case insensitive sorting
    .skip(skip)
    .limit(limit);

  return {
    data,
    pagination,
  };
};

const get = async (_id: CategoryProps['_id']) => {
  return await CategoryModel.findOne({ _id }).populate('type');
};

const getByType = async (query: QueryParamsProps) => {
  const totalDocuments = await CategoryModel.countDocuments();
  const paginationResult = createPagination(query, totalDocuments);
  const { skip, limit, pagination } = paginationResult;

  const result = await CategoryModel.aggregate([
    {
      $lookup: {
        from: 'types',
        localField: 'type',
        foreignField: '_id',
        as: 'type',
      },
    },
    { $unwind: '$type' },
    {
      $group: {
        _id: '$type._id',
        name: { $first: '$type.name' }, // Include name field
        categories: {
          $push: {
            _id: '$_id',
            name: '$name',
            icon: '$icon',
            active: '$active',
          },
        },
      },
    },
    {
      $group: {
        _id: null,
        types: {
          $push: {
            _id: '$_id',
            name: '$name',
            categories: '$categories',
          },
        },
      },
    },
    { $project: { _id: 0, types: 1 } },
    { $skip: skip },
    { $limit: limit },
  ]);

  // The result is transformed from an array to an object:
  const data = result[0] || {};

  return {
    data,
    pagination,
  };
};

const getSpecificType = async (id: Types.ObjectId, query: QueryParamsProps) => {
  const { sort } = query;

  // Pagination
  const totalDocuments = await CategoryModel.countDocuments({
    type: id,
  });
  const paginationResult = createPagination(query, totalDocuments);
  const { skip, limit, pagination } = paginationResult;

  // Sort
  const sortObj: SortObjProps = {};
  if (sort) {
    sort.split(',').forEach((sortField: string) => {
      const order = sortField.startsWith('-') ? -1 : 1;
      const field = sortField.replace(/^[-+]/, '');

      sortObj[field] = order;
    });
  }

  const data = await CategoryModel.find({ type: id })
    .populate('type')
    .sort(sortObj)
    .collation({ locale: 'en' }) // case insensitive sorting
    .skip(skip)
    .limit(limit);

  return {
    data,
    pagination,
  };
};

const update = async (_id: CategoryProps['_id'], data: CategoryProps) => {
  return await CategoryModel.findOneAndUpdate({ _id }, data, {
    new: true,
  }).populate('type');
};

const remove = async (_id: CategoryProps['_id']) => {
  return await CategoryModel.findByIdAndDelete({ _id });
};

export { create, getAll, get, getByType, getSpecificType, update, remove };
