import {
  TransactionModel,
  TransactionProps,
} from '../../models/v1/transactionModel';
import createPagination from '../../utilities/createPagination';

import { Types } from 'mongoose';

import type { QueryParamsProps, SortObjProps } from '../../types/commonTypes';
import { CategoryModel } from '../../models/v1/categoryModel';
import { ExchangeRateModel } from '../../models/v1/exchangeRateModel';
import convertCurrency from '../../utilities/convertCurrency';
import moment from 'moment';

import { serializeText } from '../../utilities/serializeText';

import formatYearMonth from '../../../../../shared/utilities/formatYearMonth';

import type { FetchTransactionProps } from '../../../../../shared/types/Transaction';
import type {
  FetchByDateProps,
  FetchByDateRangeProps,
  CreateTransactionBody,
  CreateManyTransactionsBody,
  UpdateTransactionBody,
} from '../../types/v1/transactionRequestTypes';

const ensureUserId = (data: { userId?: string }) => {
  if (!data.userId) {
    const error = new Error('userId is required to fetch transactions');
    // Mark as bad request so the error handler can return 400
    (error as Error & { statusCode?: number }).statusCode = 400;
    throw error;
  }

  return data.userId;
};

const create = async (data: CreateTransactionBody) => {
  return await TransactionModel.create(data);
};

const createMany = async (data: CreateManyTransactionsBody) => {
  return await TransactionModel.insertMany(data);
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
  const sortObj: SortObjProps = {};
  if (sort) {
    sort.split(',').forEach((sortField: string) => {
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
    pagination,
  };
};

const buildFilters = (data: FetchTransactionProps) => {
  const userId = ensureUserId(data);
  const date = new Date(data.date);
  const year = new Date(date).getFullYear();
  const month = new Date(date).getMonth() + 1;

  const yearMonth = formatYearMonth(date);

  return {
    user: { userId },
    date: {
      $expr: {
        $and: [
          {
            $lte: [
              {
                $add: [
                  { $multiply: [{ $year: '$startDate' }, 100] },
                  { $month: '$startDate' },
                ],
              },
              yearMonth,
            ],
          },
          {
            $gte: [
              {
                $add: [
                  { $multiply: [{ $year: '$endDate' }, 100] },
                  { $month: '$endDate' },
                ],
              },
              yearMonth,
            ],
          },
          {
            $not: {
              $in: [
                month,
                {
                  $map: {
                    input: '$excludedDates',
                    as: 'date',
                    in: { $month: '$$date' },
                  },
                },
              ],
            },
          },
          {
            $not: {
              $in: [
                year,
                {
                  $map: {
                    input: '$excludedDates',
                    as: 'date',
                    in: { $year: '$$date' },
                  },
                },
              ],
            },
          },
        ],
      },
    },
    type: data.type ? { 'type._id': new Types.ObjectId(data.type) } : {},
  };
};

const getTotalCount = async (data: FetchTransactionProps) => {
  const userId = ensureUserId(data);
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
        userId,
      },
      {
        category: { $in: categoryIdArray }, // Match category IDs
      },
      {
        $expr: {
          $and: [
            {
              $lte: [
                {
                  $add: [
                    { $multiply: [{ $year: '$startDate' }, 100] },
                    { $month: '$startDate' },
                  ],
                },
                yearMonth,
              ],
            },
            {
              $gte: [
                {
                  $add: [
                    { $multiply: [{ $year: '$endDate' }, 100] },
                    { $month: '$endDate' },
                  ],
                },
                yearMonth,
              ],
            },
            {
              $not: {
                $in: [
                  month,
                  {
                    $map: {
                      input: '$excludedDates',
                      as: 'date',
                      in: { $month: '$$date' },
                    },
                  },
                ],
              },
            },
            {
              $not: {
                $in: [
                  year,
                  {
                    $map: {
                      input: '$excludedDates',
                      as: 'date',
                      in: { $year: '$$date' },
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    ],
  };

  // Step 3: Count the documents with the filtered criteria
  const totalDocuments = await TransactionModel.countDocuments(filters);

  return totalDocuments;
};

const getAdvanced = async (
  query: QueryParamsProps,
  data: FetchTransactionProps,
) => {
  // [SAMPLE ENDPOINT]: /transactions/getAdvanced?page=2&limit=4

  // Pagination
  const totalDocuments = await getTotalCount(data);
  const paginationResult = createPagination(query, totalDocuments);
  const { skip, limit, pagination } = paginationResult;

  // Filter
  const filters = buildFilters(data);

  const output = await TransactionModel.aggregate([
    { $match: filters.user },
    { $match: filters.date },
    {
      $lookup: {
        from: 'categories',
        localField: 'category',
        foreignField: '_id',
        as: 'category',
      },
    },
    { $unwind: '$category' },
    {
      $lookup: {
        from: 'currencies',
        localField: 'currency',
        foreignField: '_id',
        as: 'currency',
      },
    },
    { $unwind: '$currency' },
    {
      $lookup: {
        from: 'types',
        localField: 'category.type',
        foreignField: '_id',
        as: 'type',
      },
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
        categoryIdSerialized: '$category.id',
        categoryName: '$category.name',
        categoryIcon: '$category.icon',
        isRecurring: '$isRecurring',
        startDate: '$startDate',
        endDate: '$endDate',
        currencyId: '$currency._id',
        currencyName: '$currency.name',
        amount: { $toDouble: '$amount' },
        description: '$description',
      },
    },
    { $sort: { categoryName: 1, name: 1 } },
    { $skip: skip },
    { $limit: limit },
  ]);

  return {
    data: output,
    pagination,
  };
};

const getByDate = async (data: FetchByDateProps) => {
  const date = new Date(data.date);
  const currency = data.currency;

  const latestExchangeRates = await ExchangeRateModel.findOne().sort({
    date: -1,
  });
  const rates = latestExchangeRates?.rates || {};

  const filters = buildFilters(data);

  const transactions = await TransactionModel.aggregate([
    { $match: filters.user },
    { $match: filters.date },
    {
      $lookup: {
        from: 'categories',
        localField: 'category',
        foreignField: '_id',
        as: 'category',
      },
    },
    { $unwind: '$category' },
    {
      $lookup: {
        from: 'currencies',
        localField: 'currency',
        foreignField: '_id',
        as: 'currency',
      },
    },
    { $unwind: '$currency' },
    {
      $lookup: {
        from: 'types',
        localField: 'category.type',
        foreignField: '_id',
        as: 'type',
      },
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
        categoryIdSerialized: '$category.id',
        categoryName: '$category.name',
        categoryIcon: '$category.icon',
        currencyId: '$currency._id',
        currencyName: '$currency.name',
        amount: { $toDouble: '$amount' },
        description: '$description',
      },
    },
    { $sort: { typeName: 1, categoryName: 1, name: 1 } },
  ]);

  const convertedTransactions = transactions.map((transaction) => {
    const fromCurrency = transaction.currencyName;
    const amount = transaction.amount;

    const convertedAmount = convertCurrency({
      value: amount,
      fromCurrency,
      toCurrency: currency,
      rates,
    });

    return {
      ...transaction,
      convertedAmount,
      convertedCurrency: currency,
    };
  });

  return {
    data: {
      date,
      transactions: convertedTransactions,
    },
  };
};

const getByDateRange = async (data: FetchByDateRangeProps) => {
  const startDate = new Date(data.startDate);
  const endDate = new Date(data.endDate);
  const currency = data.currency;

  const datesArray = [];

  // Fetch exchange rates
  const latestExchangeRates = await ExchangeRateModel.findOne().sort({
    date: -1,
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
        ...data,
        date: new Date(date),
      };

      const filters = buildFilters(dataToFilter);

      const transactions = await TransactionModel.aggregate([
        { $match: filters.user },
        { $match: filters.date },
        {
          $lookup: {
            from: 'categories',
            localField: 'category',
            foreignField: '_id',
            as: 'category',
          },
        },
        { $unwind: '$category' },
        {
          $lookup: {
            from: 'currencies',
            localField: 'currency',
            foreignField: '_id',
            as: 'currency',
          },
        },
        { $unwind: '$currency' },
        {
          $lookup: {
            from: 'types',
            localField: 'category.type',
            foreignField: '_id',
            as: 'type',
          },
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
            categoryIdSerialized: '$category.id',
            categoryName: '$category.name',
            categoryIcon: '$category.icon',
            currencyId: '$currency._id',
            currencyName: '$currency.name',
            amount: { $toDouble: '$amount' },
            description: '$description',
          },
        },
        { $sort: { typeName: 1, categoryName: 1, name: 1 } },
      ]);

      const convertedTransactions = transactions.map((transaction) => {
        const fromCurrency = transaction.currencyName;
        const amount = transaction.amount;

        const convertedAmount = convertCurrency({
          value: amount,
          fromCurrency,
          toCurrency: currency,
          rates,
        });

        return {
          ...transaction,
          convertedAmount,
          convertedCurrency: currency,
        };
      });

      return {
        date,
        transactions: convertedTransactions,
      };
    }),
  );

  return {
    data: output,
  };
};

const getCategories = async (data: FetchByDateProps) => {
  const result = await getByDate(data);

  const { transactions } = result.data;

  const aggregatedData = transactions.reduce(
    (acc, transaction) => {
      const {
        categoryId,
        categoryIdSerialized,
        categoryName,
        categoryIcon,
        convertedAmount,
      } = transaction;

      // Check if the categoryId already exists in the accumulator
      if (acc[categoryId]) {
        acc[categoryId].amount += Math.floor(convertedAmount);
      } else {
        acc[categoryId] = {
          id: categoryId,
          idSerialized: categoryIdSerialized,
          category: categoryName,
          serializedCategory: serializeText(categoryName),
          icon: categoryIcon,
          amount: Math.floor(convertedAmount),
        };
      }

      return acc;
    },
    {} as Record<
      string,
      {
        id: string;
        idSerialized: string;
        category: string;
        serializedCategory: string;
        icon: string;
        amount: number;
      }
    >,
  );

  type ChartConfigProps = {
    [id: string]: {
      id: string;
      label: string;
      icon: string;
    };
  };

  type OutputProps = {
    id: string;
    idSerialized: string;
    category: string;
    icon: string;
    amount: number;
  };

  const output: OutputProps[] = Object.values(aggregatedData);

  const chartConfig = output.reduce<ChartConfigProps>(
    (acc, item: OutputProps) => {
      const id = serializeText(item.category);

      acc[id] = {
        id: item.idSerialized,
        label: item.category,
        icon: '',
      };

      return acc;
    },
    {},
  );

  return {
    data: output,
    chartConfig,
  };
};

const getMonthlyTypes = async (data: FetchByDateRangeProps) => {
  const result = await getByDateRange(data);

  const output = result.data.map((dataRow) => {
    const types: Record<string, number> = {};
    const { date, transactions } = dataRow;

    transactions.forEach((transaction) => {
      const { typeName, convertedAmount } = transaction;
      const key = serializeText(typeName);

      if (!types[key]) {
        types[key] = 0;
      }

      types[key] += Math.floor(convertedAmount);
    });

    return {
      month: moment(date).format('MMMM'),
      year: moment(date).format('YYYY'),
      date,
      ...types,
    };
  });

  return output;
};

const getMonthlyCategories = async (data: FetchByDateRangeProps) => {
  const result = await getByDateRange(data);

  const output = result.data.map((dataRow) => {
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
      year: moment(date).format('YYYY'),
      date,
      ...categories,
    };
  });

  return output;
};

const get = async (_id: TransactionProps['_id']) => {
  return await TransactionModel.find({ _id });
};

const update = async (
  _id: TransactionProps['_id'],
  data: UpdateTransactionBody,
) => {
  return await TransactionModel.findOneAndUpdate({ _id }, data, {
    new: true,
  }).populate(['category', 'currency']);
};

const remove = async (_id: TransactionProps['_id']) => {
  return await TransactionModel.findByIdAndDelete({ _id });
};

export {
  create,
  createMany,
  getAll,
  getAdvanced,
  getCategories,
  getMonthlyTypes,
  getMonthlyCategories,
  get,
  update,
  remove,
};
