import { CategoryModel } from '../../models/v1/categoryModel';
import { CurrencyModel } from '../../models/v1/currencyModel';
import {
  TransactionModel,
  TransactionProps
} from '../../models/v1/transactionModel';
import { TypeModel } from '../../models/v1/typeModel';
import type { QueryParamsProps } from '../../types/commonTypes';
import createPagination from '../../utilities/createPagination';

type FetchTransactionPaymentProps = {
  date: Date;
  currency: string;
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

  // const transactions = await TransactionModel.aggregate([
  //   {
  //     $match: {
  //       $expr: {
  //         $and: [
  //           {
  //             $lte: [
  //               {
  //                 $add: [
  //                   { $multiply: [{ $year: '$startDate' }, 100] },
  //                   { $month: '$startDate' }
  //                 ]
  //               },
  //               yearMonth
  //             ]
  //           },
  //           {
  //             $gte: [
  //               {
  //                 $add: [
  //                   { $multiply: [{ $year: '$endDate' }, 100] },
  //                   { $month: '$endDate' }
  //                 ]
  //               },
  //               yearMonth
  //             ]
  //           },
  //           {
  //             $not: {
  //               $in: [
  //                 month,
  //                 {
  //                   $map: {
  //                     input: '$excludedDates',
  //                     as: 'date',
  //                     in: { $month: '$$date' }
  //                   }
  //                 }
  //               ]
  //             }
  //           },
  //           {
  //             $not: {
  //               $in: [
  //                 year,
  //                 {
  //                   $map: {
  //                     input: '$excludedDates',
  //                     as: 'date',
  //                     in: { $year: '$$date' }
  //                   }
  //                 }
  //               ]
  //             }
  //           }
  //         ]
  //       }
  //     }
  //   },
  //   { $sort: { name: 1 } }
  // ]);

  // const categories = await CategoryModel.populate(transactions, {
  //   path: 'category'
  // });

  // const output = await CurrencyModel.populate(categories, {
  //   path: 'currency'
  // });

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
        as: 'categoryDetails'
      }
    },
    { $unwind: '$categoryDetails' },

    // Lookup to populate currency
    {
      $lookup: {
        from: 'currencies',
        localField: 'currency',
        foreignField: '_id',
        as: 'currencyDetails'
      }
    },
    { $unwind: '$currencyDetails' },

    // Lookup to populate type from category
    {
      $lookup: {
        from: 'types',
        localField: 'categoryDetails.type',
        foreignField: '_id',
        as: 'typeDetails'
      }
    },
    { $unwind: '$typeDetails' },

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
          categoryId: '$categoryDetails._id',
          categoryName: '$categoryDetails.name',
          typeId: '$typeDetails._id',
          typeName: '$typeDetails.name'
        },
        transactions: {
          $push: {
            _id: '$_id',
            name: '$name',
            currencyId: '$currencyDetails._id',
            currencyName: '$currencyDetails.name',
            amount: { $toDouble: '$amount' },
            description: '$description'
            // startDate: '$startDate',
            // endDate: '$endDate',
            // excludedDates: '$excludedDates'
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
