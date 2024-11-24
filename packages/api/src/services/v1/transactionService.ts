import {
  TransactionModel,
  TransactionProps
} from '../../models/v1/transactionModel';
import createPagination from '../../utilities/createPagination';

import { Types } from 'mongoose';

import type { QueryParamsProps } from '../../types/commonTypes';
import { CategoryModel } from '../../models/v1/categoryModel';

type FetchTransactionProps = {
  date: Date;
  type: string;
};

type FetchTransactionDateRangeProps = {
  startDate: Date;
  endDate: Date;
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

const buildFilters = (data: FetchTransactionProps) => {
  const date = new Date(data.date);
  const year = new Date(date).getFullYear();
  const month = new Date(date).getMonth() + 1;
  const paddedMonth = month.toString().padStart(2, '0');
  const yearMonth = parseInt(`${year}${paddedMonth}`);

  // const yearMonth = parseInt(
  //   `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}`
  // );

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

const getTotalCount = async (data: FetchTransactionProps) => {
  const date = new Date(data.date);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const paddedMonth = month.toString().padStart(2, '0');
  const yearMonth = parseInt(`${year}${paddedMonth}`);

  // const yearMonth = parseInt(
  //   `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}`
  // );

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

const getAdvanced = async (
  query: QueryParamsProps,
  data: FetchTransactionProps
) => {
  // [SAMPLE ENDPOINT]: /transactions/getAdvanced?page=2&limit=4

  // Pagination
  const totalDocuments = await getTotalCount(data);
  const paginationResult = createPagination(query, totalDocuments);
  const { skip, limit, pagination } = paginationResult;

  // Filter
  const filters = buildFilters(data);

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

// const getTransactionsByCategory = async (
//   query: QueryParamsProps,
//   data: FetchTransactionDateRangeProps
// ) => {
//   // const { startDate, endDate } = data;

//   const startDate = new Date(data.startDate);
//   const startDateYear = new Date(startDate).getFullYear();
//   const startDateMonth = new Date(startDate).getMonth() + 1;
//   const startDateYearMonth = parseInt(
//     `${startDateYear}${startDateMonth.toString().padStart(2, '0')}`
//   );

//   const endDate = new Date(data.endDate);
//   const endDateYear = new Date(endDate).getFullYear();
//   const endDateMonth = new Date(endDate).getMonth() + 1;
//   const endDateYearMonth = parseInt(
//     `${endDateYear}${endDateMonth.toString().padStart(2, '0')}`
//   );

//   const transactions = await TransactionModel.aggregate([
//     // Match transactions based on year-month range
//     // {
//     //   $match: {
//     //     $expr: {
//     //       $and: [
//     //         {
//     //           $gte: [
//     //             {
//     //               $add: [
//     //                 { $multiply: [{ $year: '$startDate' }, 100] },
//     //                 { $month: '$startDate' }
//     //               ]
//     //             },
//     //             startDateYearMonth
//     //           ]
//     //         },
//     //         {
//     //           $lte: [
//     //             {
//     //               $add: [
//     //                 { $multiply: [{ $year: '$startDate' }, 100] },
//     //                 { $month: '$startDate' }
//     //               ]
//     //             },
//     //             endDateYearMonth
//     //           ]
//     //         }
//     //       ]
//     //     }
//     //   }
//     // },
//     {
//       $match: {
//         $expr: {
//           $and: [
//             {
//               $lte: [
//                 {
//                   $add: [
//                     { $multiply: [{ $year: '$startDate' }, 100] },
//                     { $month: '$startDate' }
//                   ]
//                 },
//                 endDateYearMonth
//               ]
//             },
//             {
//               $gte: [
//                 {
//                   $add: [
//                     { $multiply: [{ $year: '$endDate' }, 100] },
//                     { $month: '$endDate' }
//                   ]
//                 },
//                 startDateYearMonth
//               ]
//             }
//           ]
//         }
//       }
//     },
//     // Lookup categories
//     {
//       $lookup: {
//         from: 'categories',
//         localField: 'category',
//         foreignField: '_id',
//         as: 'categoryDetails'
//       }
//     },
//     {
//       $lookup: {
//         from: 'types',
//         localField: 'categoryDetails.type',
//         foreignField: '_id',
//         as: 'typeDetails'
//       }
//     },
//     {
//       $lookup: {
//         from: 'currencies',
//         localField: 'currency',
//         foreignField: '_id',
//         as: 'currencyDetails'
//       }
//     },
//     // Unwind arrays
//     { $unwind: '$categoryDetails' },
//     { $unwind: '$typeDetails' },
//     { $unwind: '$currencyDetails' },
//     // Add year-month field for grouping
//     {
//       $addFields: {
//         yearMonth: {
//           $dateToString: { format: '%Y-%m', date: '$startDate' }
//         }
//       }
//     },
//     // Group by year-month
//     {
//       $group: {
//         _id: '$yearMonth',
//         // _id: 0,
//         transactions: {
//           $push: {
//             _id: '$_id',
//             name: '$name',
//             typeId: '$typeDetails._id',
//             typeName: '$typeDetails.name',
//             categoryId: '$categoryDetails._id',
//             categoryName: '$categoryDetails.name',
//             categoryIcon: '$categoryDetails.icon',
//             currencyId: '$currencyDetails._id',
//             currencyName: '$currencyDetails.name',
//             amount: '$amount',
//             description: '$description'
//           }
//         }
//       }
//     },
//     // Sort results by year-month
//     { $sort: { _id: 1 } }
//   ]);

//   return transactions;
// };

const getDatesArray = (startDate: string, endDate: string): string[] => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const datesArray = [];

  // Iterate through each month between startDate and endDate
  while (start <= end) {
    datesArray.push(new Date(start).toISOString());
    start.setUTCMonth(start.getUTCMonth() + 1); // Move to the next month
  }

  return datesArray;
};

const getTransactionsByCategory = async (
  query: QueryParamsProps,
  data: FetchTransactionDateRangeProps
) => {
  const start = new Date(data.startDate);
  const end = new Date(data.endDate);

  let datesArray = [];

  // Iterate through each month between startDate and endDate
  while (start <= end) {
    datesArray.push(new Date(start).toISOString());
    start.setUTCMonth(start.getUTCMonth() + 1); // Move to the next month
  }

  const output = await Promise.all(
    datesArray.map(async (date) => {
      const dataToFilter = {
        date: new Date(date),
        type: data.type
      };

      const filters = buildFilters(dataToFilter);

      const result = await TransactionModel.aggregate([
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
        { $sort: { categoryName: 1, name: 1 } }
      ]);

      return {
        date,
        result
      };
    })
  );

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

export {
  create,
  getAll,
  getAdvanced,
  getTransactionsByCategory,
  get,
  update,
  remove
};
