import {
  TransactionModel,
  TransactionProps
} from '../../models/v1/transactionModel';
import createPagination from '../../utilities/createPagination';

import { Types } from 'mongoose';

import type { QueryParamsProps } from '../../types/commonTypes';
import { CategoryModel } from '../../models/v1/categoryModel';
import { ExchangeRateModel } from '../../models/v1/exchangeRateModel';
import convertCurrency from '../../utilities/convertCurrency';
import moment from 'moment';

type FetchTransactionProps = {
  date: Date;
  type?: string;
};

type FetchByDateProps = {
  date: Date;
  currency: string;
  type?: string;
};

type FetchByDateRangeProps = {
  startDate: Date;
  endDate: Date;
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

const buildFilters = (data: FetchTransactionProps) => {
  const date = new Date(data.date);
  const year = new Date(date).getFullYear();
  const month = new Date(date).getMonth() + 1;

  const yearMonth = parseInt(`${year}${month.toString().padStart(2, '0')}`);

  // const yearMonth = parseInt(
  //   `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}`
  // );

  const type = data?.type ? new Types.ObjectId(data.type) : '';

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

const getByDate = async (data: FetchByDateProps) => {
  const date = new Date(data.date);
  const currency = data.currency;

  const latestExchangeRates = await ExchangeRateModel.findOne().sort({
    date: -1
  });
  const rates = latestExchangeRates?.rates || {};

  const filters = buildFilters(data);

  const transactions = await TransactionModel.aggregate([
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
    { $sort: { typeName: 1, categoryName: 1, name: 1 } }
  ]);

  const convertedTransactions = transactions.map((transaction) => {
    const fromCurrency = transaction.currencyName;
    const amount = transaction.amount;

    const convertedAmount = convertCurrency({
      value: amount,
      fromCurrency,
      toCurrency: currency,
      rates
    });

    return {
      ...transaction,
      convertedAmount,
      convertedCurrency: currency
    };
  });

  return {
    data: {
      date,
      transactions: convertedTransactions
    }
  };
};

const getDateByCategory = async (data: FetchByDateProps) => {
  const result = await getByDate(data);

  const { transactions } = result.data;

  const output = transactions.map((transaction) => {
    const { categoryName, convertedAmount } = transaction;

    return {
      category: categoryName,
      amount: Math.floor(convertedAmount)
    };
  });

  return {
    data: output
  };
};

const getByDateRange = async (data: FetchByDateRangeProps) => {
  const startDate = new Date(data.startDate);
  const endDate = new Date(data.endDate);
  const currency = data.currency;

  let datesArray = [];

  // Fetch exchange rates
  const latestExchangeRates = await ExchangeRateModel.findOne().sort({
    date: -1
  });
  const rates = latestExchangeRates?.rates || {};

  // Iterate through each month between startDate and endDate
  while (startDate <= endDate) {
    datesArray.push(new Date(startDate).toISOString());
    startDate.setUTCMonth(startDate.getUTCMonth() + 1); // Move to the next month
  }

  const output = await Promise.all(
    datesArray.map(async (date) => {
      const dataToFilter = {
        date: new Date(date)
      };

      const filters = buildFilters(dataToFilter);

      const transactions = await TransactionModel.aggregate([
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
        { $sort: { typeName: 1, categoryName: 1, name: 1 } }
      ]);

      const convertedTransactions = transactions.map((transaction) => {
        const fromCurrency = transaction.currencyName;
        const amount = transaction.amount;

        const convertedAmount = convertCurrency({
          value: amount,
          fromCurrency,
          toCurrency: currency,
          rates
        });

        return {
          ...transaction,
          convertedAmount,
          convertedCurrency: currency
        };
      });

      return {
        date,
        transactions: convertedTransactions
      };
    })
  );

  return {
    data: output
  };
};

const getDateRangeByType = async (data: FetchByDateRangeProps) => {
  const result = await getByDateRange(data);

  const output = result.data.map((dataRow) => {
    // const groupedTransactions: Record<string, any> = {};
    // const { date, transactions } = dataRow;

    // transactions.forEach((transaction) => {
    //   const { typeId, typeName, convertedAmount, convertedCurrency } =
    //     transaction;

    //   if (!groupedTransactions[typeId]) {
    //     groupedTransactions[typeId] = {
    //       typeId,
    //       typeName,
    //       convertedAmount: 0,
    //       convertedCurrency
    //     };
    //   }

    //   groupedTransactions[typeId].convertedAmount += convertedAmount;
    // });

    // return {
    //   date,
    //   transactions: Object.values(groupedTransactions)
    // };

    const types: Record<string, number> = {};
    const { date, transactions } = dataRow;

    transactions.forEach((transaction) => {
      const { typeName, convertedAmount } = transaction;
      const key = typeName.toLowerCase();

      if (!types[key]) {
        types[key] = 0;
      }

      types[key] += Math.floor(convertedAmount);
    });

    return {
      month: moment(date).format('MMMM'),
      ...types
    };
  });

  return output;
};

const getDateRangeByCategory = async (data: FetchByDateRangeProps) => {
  const result = await getByDateRange(data);

  const output = result.data.map((dataRow) => {
    // const groupedTransactions: Record<string, any> = {};
    // const { date, transactions } = dataRow;

    // transactions.forEach((transaction) => {
    //   const {
    //     categoryId,
    //     categoryName,
    //     categoryIcon,
    //     typeId,
    //     typeName,
    //     convertedAmount,
    //     convertedCurrency
    //   } = transaction;

    //   if (!groupedTransactions[categoryId]) {
    //     groupedTransactions[categoryId] = {
    //       categoryId,
    //       categoryName,
    //       categoryIcon,
    //       typeId,
    //       typeName,
    //       convertedAmount: 0,
    //       convertedCurrency
    //     };
    //   }

    //   groupedTransactions[categoryId].convertedAmount += convertedAmount;
    // });

    // return {
    //   date,
    //   transactions: Object.values(groupedTransactions)
    // };

    const categories: Record<string, number> = {};
    const { date, transactions } = dataRow;

    transactions.forEach((transaction) => {
      const { categoryName, convertedAmount } = transaction;
      const key = categoryName.toLowerCase();

      if (!categories[key]) {
        categories[key] = 0;
      }

      categories[key] += Math.floor(convertedAmount);
    });

    return {
      month: moment(date).format('MMMM'),
      ...categories
    };
  });

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
  getDateByCategory,
  getDateRangeByType,
  getDateRangeByCategory,
  get,
  update,
  remove
};
