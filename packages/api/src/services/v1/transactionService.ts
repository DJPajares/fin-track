import {
  TransactionModel,
  TransactionProps
} from '../../models/v1/transactionModel';
import createPagination from '../../utilities/createPagination';

import { Types } from 'mongoose';

import type { QueryParamsProps } from '../../types/commonTypes';
import { CategoryModel } from '../../models/v1/categoryModel';

type FetchTransactionPaymentProps = {
  date: Date;
  type: string;
};

const buildFilters = (data: FetchTransactionPaymentProps) => {
  const date = new Date(data.date);
  const year = new Date(date).getFullYear();
  const month = new Date(date).getMonth() + 1;
  const paddedMonth = month.toString().padStart(2, '0');
  const yearMonth = parseInt(`${year}${paddedMonth}`);

  const type = new Types.ObjectId(data.type);

  return {
    date: {
      $expr: {
        $and: [
          {
            $lte: [
              {
                $add: [
                  { $multiply: [{ $year: '$startDate' }, 100] },
                  { $month: '$startDate' }
                ]
              },
              yearMonth
            ]
          },
          {
            $gte: [
              {
                $add: [
                  { $multiply: [{ $year: '$endDate' }, 100] },
                  { $month: '$endDate' }
                ]
              },
              yearMonth
            ]
          },
          {
            $not: {
              $in: [
                month,
                {
                  $map: {
                    input: '$excludedDates',
                    as: 'date',
                    in: { $month: '$$date' }
                  }
                }
              ]
            }
          },
          {
            $not: {
              $in: [
                year,
                {
                  $map: {
                    input: '$excludedDates',
                    as: 'date',
                    in: { $year: '$$date' }
                  }
                }
              ]
            }
          }
        ]
      }
    },
    type: { 'type._id': type }
  };
};

const getTotalCount = async (data: FetchTransactionPaymentProps) => {
  const date = new Date(data.date);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const paddedMonth = month.toString().padStart(2, '0');
  const yearMonth = parseInt(`${year}${paddedMonth}`);
  const type = new Types.ObjectId(data.type);

  // Step 1: Fetch category IDs matching the given type
  const categoryIds = await CategoryModel.find({ type }).select('_id');

  if (!categoryIds || categoryIds.length === 0) {
    return 0; // No matching categories, so no transactions will match
  }

  const categoryIdArray = categoryIds.map((category) => category._id);

  // Step 2: Filter transactions using the category IDs and date logic
  const filters = {
    $and: [
      {
        category: { $in: categoryIdArray } // Match category IDs
      },
      {
        $expr: {
          $and: [
            {
              $lte: [
                {
                  $add: [
                    { $multiply: [{ $year: '$startDate' }, 100] },
                    { $month: '$startDate' }
                  ]
                },
                yearMonth
              ]
            },
            {
              $gte: [
                {
                  $add: [
                    { $multiply: [{ $year: '$endDate' }, 100] },
                    { $month: '$endDate' }
                  ]
                },
                yearMonth
              ]
            },
            {
              $not: {
                $in: [
                  month,
                  {
                    $map: {
                      input: '$excludedDates',
                      as: 'date',
                      in: { $month: '$$date' }
                    }
                  }
                ]
              }
            },
            {
              $not: {
                $in: [
                  year,
                  {
                    $map: {
                      input: '$excludedDates',
                      as: 'date',
                      in: { $year: '$$date' }
                    }
                  }
                ]
              }
            }
          ]
        }
      }
    ]
  };

  // Step 3: Count the documents with the filtered criteria
  const totalDocuments = await TransactionModel.countDocuments(filters);

  return totalDocuments;
};

const create = async (data: TransactionProps) => {
  return await TransactionModel.create(data);
};

const getAll = async (query: QueryParamsProps) => {
  // [SAMPLE ENDPOINT]: /transactions?page=2&limit=4&sort=-name

  const { filter, sort } = query;

  // Pagination
  const totalDocuments = await TransactionModel.countDocuments();
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

  const data = await TransactionModel.find(filterObj)
    .populate(['category', 'currency'])
    .sort(sortObj)
    .collation({ locale: 'en' }) // case insensitive sorting
    .skip(skip)
    .limit(limit);

  return {
    data,
    pagination
  };
};

const getAdvanced = async (
  query: QueryParamsProps,
  data: FetchTransactionPaymentProps
) => {
  // [SAMPLE ENDPOINT]: /transactions/getAdvanced?page=2&limit=4&sort=-name

  const { filter, sort } = query;

  // Pagination
  const totalDocuments = await getTotalCount(data);
  const paginationResult = createPagination(query, totalDocuments);
  const { skip, limit, pagination } = paginationResult;

  // Filter
  const filters = buildFilters(data);

  // Sort
  let sortObj: any = {};
  if (sort) {
    sort.split(',').forEach((sortField) => {
      const order = sortField.startsWith('-') ? -1 : 1;
      const field = sortField.replace(/^[-+]/, '');
      sortObj[field] = order;
    });
  }

  const output = await TransactionModel.aggregate([
    { $match: filters.date },
    {
      $lookup: {
        from: 'categories',
        localField: 'category',
        foreignField: '_id',
        as: 'category'
      }
    },
    { $unwind: '$category' },
    {
      $lookup: {
        from: 'currencies',
        localField: 'currency',
        foreignField: '_id',
        as: 'currency'
      }
    },
    { $unwind: '$currency' },
    {
      $lookup: {
        from: 'types',
        localField: 'category.type',
        foreignField: '_id',
        as: 'type'
      }
    },
    { $unwind: '$type' },
    { $match: filters.type },
    {
      $project: {
        _id: '$_id',
        name: '$name',
        typeId: '$type._id',
        typeName: '$type.name',
        categoryId: '$category._id',
        categoryName: '$category.name',
        categoryIcon: '$category.icon',
        currencyId: '$currency._id',
        currencyName: '$currency.name',
        amount: { $toDouble: '$amount' },
        description: '$description'
      }
    },
    { $sort: { categoryName: 1, name: 1 } },
    { $skip: skip },
    { $limit: limit }
  ]);

  return {
    data: output,
    pagination
  };
};

const get = async (_id: TransactionProps['_id']) => {
  return await TransactionModel.find({ _id });
};

const update = async (_id: TransactionProps['_id'], data: TransactionProps) => {
  return await TransactionModel.findOneAndUpdate({ _id }, data, {
    new: true
  }).populate(['category', 'currency']);
};

const remove = async (_id: TransactionProps['_id']) => {
  return await TransactionModel.findByIdAndDelete({ _id });
};

export { create, getAll, getAdvanced, get, update, remove };
