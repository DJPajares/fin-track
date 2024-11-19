import {
  TransactionModel,
  TransactionProps
} from '../../models/v1/transactionModel';
import createPagination from '../../utilities/createPagination';

import type { QueryParamsProps } from '../../types/commonTypes';

type FetchTransactionPaymentProps = {
  date: Date;
  type: string;
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

      // sortObj[field] = order;
      sortObj = {
        field,
        order
      };
    });
  }

  const date = new Date(data.date);
  const year = new Date(date).getFullYear();
  const month = new Date(date).getMonth() + 1;
  const paddedMonth = month.toString().padStart(2, '0');
  const yearMonth = parseInt(`${year}${paddedMonth}`);

  const type = data.type;

  const output = await TransactionModel.aggregate([
    {
      $match: {
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
    },
    // Lookup to populate category
    {
      $lookup: {
        from: 'categories',
        localField: 'category',
        foreignField: '_id',
        as: 'category'
      }
    },
    { $unwind: '$category' },

    // Lookup to populate currency
    {
      $lookup: {
        from: 'currencies',
        localField: 'currency',
        foreignField: '_id',
        as: 'currency'
      }
    },
    { $unwind: '$currency' },

    // Lookup to populate type from category
    {
      $lookup: {
        from: 'types',
        localField: 'category.type',
        foreignField: '_id',
        as: 'type'
      }
    },
    { $unwind: '$type' },
    {
      // Filter transactions where the category type is passed in body
      $match: {
        'type.name': type
      }
    },

    // Add a sort stage before grouping transactions
    {
      $sort: {
        name: 1 // Sort by transaction name (ascending)
      }
    },

    // Group by category to aggregate sorted transactions
    {
      $group: {
        _id: {
          categoryId: '$category._id',
          categoryName: '$category.name',
          typeId: '$type._id',
          typeName: '$type.name'
        },
        transactions: {
          $push: {
            _id: '$_id',
            name: '$name',
            currencyId: '$currency._id',
            currencyName: '$currency.name',
            amount: { $toDouble: '$amount' },
            description: '$description'
          }
        }
      }
    },

    // Project the grouped data into the desired structure
    {
      $project: {
        _id: 0,
        categoryId: '$_id.categoryId',
        categoryName: '$_id.categoryName',
        typeId: '$_id.typeId',
        typeName: '$_id.typeName',
        transactions: 1
      }
    },

    // Sort categories by name
    {
      $sort: { categoryName: 1 }
    }
  ]);

  return output;
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
