import { Types } from 'mongoose';
import { CategoryModel, CategoryProps } from '../../models/v1/categoryModel';
import { TypeModel } from '../../models/v1/typeModel';
import type { SpecificTypeProps } from '../../types/categoryTypes';
import type { PaginationProps } from '../../types/commonTypes';
import createPagination from '../../utilities/createPagination';

const create = async (data: CategoryProps) => {
  return await CategoryModel.create(data);
};

const get = async (query) => {
  const { filter, sort, page, limit } = query;

  const queryObj = filter ? JSON.parse(filter) : {};

  // const sortObj = sort ? JSON.parse(sort) : {};
  let sortObj: any = {};
  if (sort) {
    sort.split(',').forEach((sortField: any) => {
      const order = sortField.startsWith('-') ? -1 : 1;
      const field = sortField.replace(/^[-+]/, '');

      sortObj[field] = order;
    });
  }
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

// const get = async (_id: CategoryProps['_id']) => {
//   return await CategoryModel.findOne({ _id }).populate('type');
// };

const getByType = async (query: PaginationProps) => {
  const totalDocuments = await CategoryModel.countDocuments();
  const paginationResult = createPagination(query, totalDocuments);
  const { skip, limit, pagination } = paginationResult;

  const data = await CategoryModel.aggregate([
    {
      $lookup: {
        from: TypeModel.collection.name,
        localField: 'category.type',
        foreignField: '_id',
        as: 'type'
      }
    },
    {
      $unwind: '$type'
    },
    {
      $group: {
        _id: '$type.name',
        categories: {
          $push: {
            _id: '$_id',
            name: '$name'
          }
        }
      }
    },
    {
      $project: {
        _id: 0,
        type: '$_id',
        categories: 1
      }
    },
    {
      $skip: skip
    },
    {
      $limit: limit
    }
  ]);

  // const result = {};

  // data.forEach((item) => {
  //   result[item.type] = item.categories;
  // });

  // return {
  //   data: result,
  //   pagination
  // };

  return {
    data,
    pagination
  };
};

const getSpecificType = async (query: SpecificTypeProps) => {
  const typeId = new Types.ObjectId(query.typeId);

  const totalDocuments = await CategoryModel.countDocuments({
    type: typeId
  });

  const paginationResult = createPagination(query, totalDocuments);
  const { skip, limit, pagination } = paginationResult;

  const data = await CategoryModel.find({ type: typeId })
    .skip(skip)
    .limit(limit);

  return {
    data,
    pagination
  };
};

const update = async (_id: CategoryProps['_id'], data: CategoryProps) => {
  return await CategoryModel.findOneAndUpdate({ _id }, data, {
    new: true
  }).populate('type');
};

const remove = async (_id: CategoryProps['_id']) => {
  return await CategoryModel.findByIdAndDelete({ _id });
};

export { create, getAll, get, getByType, getSpecificType, update, remove };
