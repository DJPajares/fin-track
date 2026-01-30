import { Types } from 'mongoose';
import {
  CategoryModel,
  type CategoryProps,
} from '../../models/v1/categoryModel';

import createPagination from '../../utilities/createPagination';

import type { QueryParamsProps, SortObjProps } from '../../types/commonTypes';
import type { CustomCategoryRequest } from '../../../../../shared/types/Category';

const create = async (data: CategoryProps) => {
  return await CategoryModel.create(data);
};

const createMany = async (data: CategoryProps[]) => {
  return await CategoryModel.insertMany(data);
};

const createCustom = async ({
  type,
  id,
  name,
  icon,
  isActive,
  userId,
}: CustomCategoryRequest) => {
  const scope = 'custom';

  const category = await CategoryModel.create({
    type,
    id,
    name,
    icon,
    isActive,
    scope,
    userId,
  });

  // Populate the type field before returning
  await category.populate('type');

  return category;
};

const getAll = async (query: QueryParamsProps, userId?: string) => {
  // [SAMPLE ENDPOINT]: /categories?page=2&limit=4&sort=-name&userId=69609f8259e099edd12bc995
  // Fetches: all global categories + custom categories for userId
  // If same id exists, custom scope takes priority

  const { filter, sort } = query;

  // Fetch global categories and custom categories for the user
  const globalCategories = await CategoryModel.find({
    scope: 'global',
  }).populate('type');

  const customCategories = userId
    ? await CategoryModel.find({ scope: 'custom', userId }).populate('type')
    : [];

  // Merge categories, prioritizing custom over global by id
  const categoryMap = new Map();

  // Add global categories first
  globalCategories.forEach((cat) => {
    categoryMap.set(cat.id, cat);
  });

  // Override with custom categories (same id will overwrite global)
  customCategories.forEach((cat) => {
    categoryMap.set(cat.id, cat);
  });

  let mergedCategories = Array.from(categoryMap.values());

  // Filter
  const filterObj = filter ? JSON.parse(filter) : {};
  if (Object.keys(filterObj).length > 0) {
    mergedCategories = mergedCategories.filter((cat) => {
      return Object.entries(filterObj).every(([key, value]) => {
        return (cat as Record<string, unknown>)[key] === value;
      });
    });
  }

  // Sort
  const sortObj: SortObjProps = {};
  if (sort) {
    sort.split(',').forEach((sortField: string) => {
      const order = sortField.startsWith('-') ? -1 : 1;
      const field = sortField.replace(/^[-+]/, '');

      sortObj[field] = order;
    });
  }

  if (Object.keys(sortObj).length > 0) {
    mergedCategories.sort((a, b) => {
      for (const [field, order] of Object.entries(sortObj)) {
        const aVal = (a as Record<string, unknown>)[field];
        const bVal = (b as Record<string, unknown>)[field];

        if (aVal === bVal) continue;

        const comparison = String(aVal).localeCompare(String(bVal));
        return order === 1 ? comparison : -comparison;
      }
      return 0;
    });
  }

  // Pagination
  const totalDocuments = mergedCategories.length;
  const paginationResult = createPagination(query, totalDocuments);
  const { skip, limit, pagination } = paginationResult;

  const data = mergedCategories.slice(skip, skip + limit);

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
            isActive: '$isActive',
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

/*
  modify this update to handle the ff:
  - if the category being updated is a 'global' category (scope: 'global'), create a 'custom' category for the user instead of modifying the global one
  - if the category being updated is already a 'custom' category, proceed with the update as usual
*/
const update = async (
  _id: CategoryProps['_id'],
  data: CategoryProps,
  userId?: string,
) => {
  const scope = data.scope;

  if (scope === 'global') {
    // Fetch the existing category
    const existingCategory = await CategoryModel.findOne({ _id });

    if (!existingCategory) {
      throw new Error('Category not found');
    }

    if (!userId) {
      throw new Error('User ID is required to create custom category');
    }

    // Create a new custom category instead of updating the global one
    const newCustomCategory = await CategoryModel.create({
      type: existingCategory.type?._id,
      id: existingCategory.id,
      name: data.name ?? existingCategory.name,
      icon: data.icon ?? existingCategory.icon,
      isActive: data.isActive ?? existingCategory.isActive,
      scope: 'custom',
      userId: new Types.ObjectId(userId),
    });

    await newCustomCategory.populate('type');

    return newCustomCategory;
  }

  return await CategoryModel.findOneAndUpdate({ _id }, data, {
    new: true,
  }).populate('type');
};

const remove = async (_id: CategoryProps['_id']) => {
  return await CategoryModel.findByIdAndDelete({ _id });
};

export {
  create,
  createMany,
  createCustom,
  getAll,
  get,
  getByType,
  getSpecificType,
  update,
  remove,
};
