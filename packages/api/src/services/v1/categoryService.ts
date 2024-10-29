import { Types } from 'mongoose';
import { CategoryModel } from '../../models/v1/categoryModel';

import createPagination from '../../utilities/createPagination';

import type { CategoryProps } from '../../models/v1/categoryModel';
import type { QueryParamsProps } from '../../types/commonTypes';

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
  let sortObj: any = {};
  if (sort) {
    sort.split(',').forEach((sortField: any) => {
      const order = sortField.startsWith('-') ? -1 : 1;
      const field = sortField.replace(/^[-+]/, '');

      sortObj[field] = order;
    });
  }

  const data = await CategoryModel.find(filterObj)
    .populate('type')
    .sort(sortObj)
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

const getByType = async (query: QueryParamsProps) => {
  const totalDocuments = await CategoryModel.countDocuments();
  const paginationResult = createPagination(query, totalDocuments);
  const { skip, limit, pagination } = paginationResult;

  // ORIGINAL:
  // const result = await CategoryModel.aggregate([
  //   {
  //     $lookup: {
  //       from: 'types', // Adjust 'types' if your collection name is different
  //       localField: 'type',
  //       foreignField: '_id',
  //       as: 'type'
  //     }
  //   },
  //   {
  //     $unwind: '$type'
  //   },
  //   {
  //     $group: {
  //       _id: '$type._id',
  //       categories: {
  //         $push: {
  //           _id: '$_id',
  //           name: '$name',
  //           icon: '$icon',
  //           active: '$active'
  //         }
  //       }
  //     }
  //   },
  //   {
  //     $group: {
  //       _id: null,
  //       types: {
  //         $push: {
  //           k: '$_id',
  //           v: '$categories'
  //         }
  //       }
  //     }
  //   },
  //   // { $replaceRoot: { newRoot: '$types' } },
  //   // {
  //   //   $replaceRoot: {
  //   //     newRoot: {
  //   //       $arrayToObject: '$types'
  //   //     }
  //   //   }
  //   // },
  //   // {
  //   //   $project: {
  //   //     _id: 0
  //   //   }
  //   // },
  //   {
  //     $skip: skip
  //   },
  //   {
  //     $limit: limit
  //   }
  // ]);

  // // OPTION 1:
  // const result = await CategoryModel.aggregate([
  //   {
  //     $lookup: {
  //       from: 'types',
  //       localField: 'type',
  //       foreignField: '_id',
  //       as: 'type'
  //     }
  //   },
  //   { $unwind: '$type' },
  //   {
  //     $group: {
  //       _id: '$type._id',
  //       categories: {
  //         $push: {
  //           _id: '$_id',
  //           name: '$name',
  //           icon: '$icon',
  //           active: '$active'
  //         }
  //       }
  //     }
  //   },
  //   {
  //     $group: {
  //       _id: null,
  //       types: {
  //         $push: { k: '$_id', v: '$categories' }
  //       }
  //     }
  //   },
  //   {
  //     $set: {
  //       types: { $arrayToObject: '$types' }
  //     }
  //   },
  //   { $project: { _id: 0 } },
  //   { $skip: skip },
  //   { $limit: limit }
  // ]);

  // OPTION 2:
  const result = await CategoryModel.aggregate([
    {
      $lookup: {
        from: 'types',
        localField: 'type',
        foreignField: '_id',
        as: 'type'
      }
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
            active: '$active'
          }
        }
      }
    },
    {
      $group: {
        _id: null,
        types: {
          $push: {
            _id: '$_id',
            name: '$name',
            categories: '$categories'
          }
        }
      }
    },
    { $project: { _id: 0, types: 1 } },
    { $skip: skip },
    { $limit: limit }
  ]);

  // The result is transformed from an array to an object:
  const data = result[0] || {};

  return {
    data,
    pagination
  };
};

const getSpecificType = async (id: Types.ObjectId, query: QueryParamsProps) => {
  const { sort } = query;

  // Pagination
  const totalDocuments = await CategoryModel.countDocuments({
    type: id
  });
  const paginationResult = createPagination(query, totalDocuments);
  const { skip, limit, pagination } = paginationResult;

  // Sort
  let sortObj: any = {};
  if (sort) {
    sort.split(',').forEach((sortField: any) => {
      const order = sortField.startsWith('-') ? -1 : 1;
      const field = sortField.replace(/^[-+]/, '');

      sortObj[field] = order;
    });
  }

  const data = await CategoryModel.find({ type: id })
    .populate('type')
    .sort(sortObj)
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
