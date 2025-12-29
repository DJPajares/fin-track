import { CategoryModel } from '../../models/v1/categoryModel';
import { CurrencyModel } from '../../models/v1/currencyModel';
import { ExchangeRateModel } from '../../models/v1/exchangeRateModel';
import { PaymentModel } from '../../models/v1/paymentModel';
import { TransactionModel } from '../../models/v1/transactionModel';
import { TypeModel } from '../../models/v1/typeModel';
import convertCurrency from '../../utilities/convertCurrency';
import formatYearMonth from '../../../../../shared/utilities/formatYearMonth';

import type {
  AccumulatorProps,
  ExpenseTransactionPaymentsProps,
  IncomeTransactionsProps,
  ProcessTransactionPaymentDataProps,
} from '../../types/transactionPaymentTypes';
import type {
  DateCurrencyProps,
  DateRangeCurrencyProps,
  TransactionPaymentProps,
} from '../../types/v1/transactionPaymentRequestTypes';

const getIncomeTransactions = async ({
  date,
  userId,
}: TransactionPaymentProps) => {
  const year = new Date(date).getFullYear();
  const month = new Date(date).getMonth() + 1;

  const yearMonth = formatYearMonth(date);

  return await TransactionModel.aggregate([
    {
      // Find transactions within the specified date range and exclude transactions with the specified date (year-month)
      $match: {
        userId,
        $expr: {
          $and: [
            // { $lte: [{ $year: '$startDate' }, year] },
            // { $lte: [{ $month: '$startDate' }, month] },
            // { $gte: [{ $year: '$endDate' }, year] },
            // { $gte: [{ $month: '$endDate' }, month] },
            // { $lte: ['$startDate', new Date(data.date)] },
            // { $gte: ['$endDate', new Date(data.date)] },
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
    },
    {
      // Perform a left outer join with the CategoryModel collection
      $lookup: {
        from: CategoryModel.collection.name,
        localField: 'category',
        foreignField: '_id',
        as: 'category',
      },
    },
    {
      // Unwind the array created by populate to get the category object
      $unwind: '$category',
    },
    {
      // Perform a left outer join with the TypeModel collection based on the 'type' field of the category
      $lookup: {
        from: TypeModel.collection.name,
        localField: 'category.type',
        foreignField: '_id',
        as: 'type',
      },
    },
    {
      $unwind: '$type',
    },
    {
      $lookup: {
        from: CurrencyModel.collection.name,
        localField: 'currency',
        foreignField: '_id',
        as: 'currency',
      },
    },
    {
      $unwind: '$currency',
    },
    {
      // Filter transactions where the category type is 'Expense'
      $match: {
        'type.id': 'income',
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        categoryId: '$category._id',
        categoryIdSerialized: '$category.id',
        category: '$category.name',
        categoryIcon: '$category.icon',
        typeId: '$type._id',
        type: '$type.name',
        amount: 1,
        currencyId: '$currency._id',
        currency: '$currency.name',
        description: 1,
        isRecurring: 1,
        startDate: 1,
        endDate: 1,
        excludedDates: 1,
      },
    },
    {
      $sort: { category: 1, name: 1 },
    },
  ]);
};

const getExpenseTransactionPayments = async ({
  date,
  userId,
}: TransactionPaymentProps) => {
  const year = new Date(date).getFullYear();
  const month = new Date(date).getMonth() + 1;

  const yearMonth = formatYearMonth(date);

  return await TransactionModel.aggregate([
    {
      // Find transactions within the specified date range and exclude transactions with the specified date (year-month)
      $match: {
        userId,
        $expr: {
          $and: [
            // { $lte: [{ $year: '$startDate' }, year] },
            // { $lte: [{ $month: '$startDate' }, month] },
            // { $gte: [{ $year: '$endDate' }, year] },
            // { $gte: [{ $month: '$endDate' }, month] },
            // { $lte: ['$startDate', new Date(data.date)] },
            // { $gte: ['$endDate', new Date(data.date)] },
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
    },
    {
      // Perform a left outer join with the PaymentModel collection
      $lookup: {
        from: PaymentModel.collection.name,
        localField: '_id',
        foreignField: 'transaction',
        as: 'payment',
        pipeline: [
          {
            $match: {
              userId,
              $expr: {
                // $and: [
                //   { $gte: [{ $year: '$date' }, year] },
                //   { $gte: [{ $month: '$date' }, month] }
                // ]
                $and: [
                  {
                    $lte: [
                      {
                        $add: [
                          { $multiply: [{ $year: '$date' }, 100] },
                          { $month: '$date' },
                        ],
                      },
                      yearMonth,
                    ],
                  },
                  {
                    $gte: [
                      {
                        $add: [
                          { $multiply: [{ $year: '$date' }, 100] },
                          { $month: '$date' },
                        ],
                      },
                      yearMonth,
                    ],
                  },
                  // {
                  //   $not: {
                  //     $in: [
                  //       month,
                  //       {
                  //         $map: {
                  //           input: '$excludedDates',
                  //           as: 'date',
                  //           in: { $month: '$$date' }
                  //         }
                  //       }
                  //     ]
                  //   }
                  // },
                  // {
                  //   $not: {
                  //     $in: [
                  //       year,
                  //       {
                  //         $map: {
                  //           input: '$excludedDates',
                  //           as: 'date',
                  //           in: { $year: '$$date' }
                  //         }
                  //       }
                  //     ]
                  //   }
                  // }
                ],
              },
            },
          },
        ],
      },
    },
    {
      // Unwind the payment array to include each payment object separately
      $unwind: {
        path: '$payment',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: CurrencyModel.collection.name,
        localField: 'payment.currency',
        foreignField: '_id',
        as: 'paymentCurrency',
      },
    },
    {
      $unwind: {
        path: '$paymentCurrency',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      // Perform a left outer join with the CategoryModel collection
      $lookup: {
        from: CategoryModel.collection.name,
        localField: 'category',
        foreignField: '_id',
        as: 'category',
      },
    },
    {
      // Unwind the array created by populate to get the category object
      $unwind: '$category',
    },
    {
      $lookup: {
        from: CurrencyModel.collection.name,
        localField: 'currency',
        foreignField: '_id',
        as: 'currency',
      },
    },
    {
      $unwind: '$currency',
    },
    {
      // Perform a left outer join with the TypeModel collection based on the 'type' field of the category
      $lookup: {
        from: TypeModel.collection.name,
        localField: 'category.type',
        foreignField: '_id',
        as: 'type',
      },
    },
    {
      $unwind: '$type',
    },
    {
      // Filter transactions where the category type is 'Expense'
      $match: {
        'type.id': 'expense',
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        categoryId: '$category._id',
        categoryIdSerialized: '$category.id',
        category: '$category.name',
        categoryIcon: '$category.icon',
        typeId: '$type._id',
        typeName: '$type.name',
        amount: 1,
        currencyId: '$currency._id',
        currency: '$currency.name',
        paymentId: '$payment._id',
        paidAmount: '$payment.amount',
        paidCurrencyId: '$paymentCurrency._id',
        paidCurrency: '$paymentCurrency.name',
        description: 1,
        isRecurring: 1,
        startDate: 1,
        endDate: 1,
        excludedDates: 1,
      },
    },
    {
      $sort: { category: 1, name: 1 },
    },
  ]);
};

const processTransactionPaymentData = ({
  incomeTransactions,
  expenseTransactionPayments,
  rates,
  currency,
}: ProcessTransactionPaymentDataProps) => {
  // MAIN
  const budget = incomeTransactions.reduce(
    (accumulator: number, incomeTransaction: IncomeTransactionsProps) => {
      const value = parseFloat(incomeTransaction.amount.toString());
      const fromCurrency = incomeTransaction.currency;

      const amount = convertCurrency({
        value,
        fromCurrency,
        toCurrency: currency,
        rates,
      });

      return accumulator + amount;
    },
    0,
  );

  let totalAmount = 0;
  let totalPaidAmount = 0;

  expenseTransactionPayments.forEach(
    (expenseTransactionPayment: ExpenseTransactionPaymentsProps) => {
      if (expenseTransactionPayment.amount) {
        const totalAmountValue = parseFloat(
          expenseTransactionPayment.amount.toString(),
        );
        const totalAmountCurrency = expenseTransactionPayment.currency;

        totalAmount += convertCurrency({
          value: totalAmountValue,
          fromCurrency: totalAmountCurrency,
          toCurrency: currency,
          rates,
        });
      }

      if (expenseTransactionPayment.paidAmount) {
        const totalPaidAmountValue = parseFloat(
          expenseTransactionPayment.paidAmount.toString(),
        );
        const totalPaidAmountCurrency = expenseTransactionPayment.paidCurrency;

        totalPaidAmount += convertCurrency({
          value: totalPaidAmountValue,
          fromCurrency: totalPaidAmountCurrency,
          toCurrency: currency,
          rates,
        });
      }
    },
  );

  const main = {
    currency,
    budget,
    totalAmount,
    totalPaidAmount,
    balance: budget - totalPaidAmount,
    extra: budget - totalAmount,
    paymentCompletionRate: totalPaidAmount / totalAmount,
  };

  // CATEGORIES
  const categories = Object.values(
    expenseTransactionPayments.reduce(
      (
        accumulator: AccumulatorProps,
        expenseTransactionPayment: ExpenseTransactionPaymentsProps,
      ) => {
        const key = expenseTransactionPayment.categoryId.toString();

        // CATEGORY ACCUMULATOR
        if (!accumulator[key]) {
          accumulator[key] = {
            _id: expenseTransactionPayment.categoryId,
            id: expenseTransactionPayment.categoryIdSerialized,
            name: expenseTransactionPayment.category,
            icon: expenseTransactionPayment.categoryIcon,
            totalAmount: 0,
            totalPaidAmount: 0,
            paymentCompletionRate: 0,
            transactions: [],
          };
        }

        // TRANSACTION
        // [Amount]
        let amount = 0;
        let localAmount = 0;

        if (expenseTransactionPayment.amount) {
          const amountCurrency = expenseTransactionPayment.currency;

          const transactionAmount = parseFloat(
            expenseTransactionPayment.amount.toString(),
          );

          amount =
            currency === amountCurrency
              ? transactionAmount
              : convertCurrency({
                  value: transactionAmount,
                  fromCurrency: amountCurrency,
                  toCurrency: currency,
                  rates,
                });

          localAmount = transactionAmount;
        }

        // [Paid Amount]
        let paidAmount = 0;
        let localPaidAmount = 0;

        if (expenseTransactionPayment.paidAmount) {
          const transactionPaidAmount = parseFloat(
            expenseTransactionPayment.paidAmount.toString(),
          );
          const paidCurrency = expenseTransactionPayment.paidCurrency;

          paidAmount =
            currency === paidCurrency
              ? transactionPaidAmount
              : convertCurrency({
                  value: transactionPaidAmount,
                  fromCurrency: paidCurrency,
                  toCurrency: currency,
                  rates,
                });

          localPaidAmount = transactionPaidAmount;
        }

        // [In Local Currency]
        const localAmountValue = {
          currency: {
            _id: expenseTransactionPayment.currencyId,
            name: expenseTransactionPayment.currency,
          },
          amount: localAmount,
          paidCurrency: {
            _id: expenseTransactionPayment.paidCurrencyId,
            name: expenseTransactionPayment.paidCurrency,
          },
          paidAmount: localPaidAmount,
        };

        // [Transactions Array]
        const transaction = {
          _id: expenseTransactionPayment._id,
          paymentId: expenseTransactionPayment.paymentId,
          name: expenseTransactionPayment.name,
          amount,
          paidAmount,
          localAmount: localAmountValue,
        };

        // CATEGORY TOTAL
        accumulator[key].transactions.push(transaction);
        accumulator[key].totalAmount += transaction.amount;
        accumulator[key].totalPaidAmount += transaction.paidAmount;
        accumulator[key].paymentCompletionRate =
          accumulator[key].totalPaidAmount / accumulator[key].totalAmount;

        return accumulator;
      },
      {},
    ),
  );

  const output = {
    main,
    categories,
  };

  return output;
};

const fetchTransactionPayments = async (body: DateCurrencyProps) => {
  const { date, currency, userId } = body;

  const incomeTransactions = await getIncomeTransactions({ date, userId });

  const expenseTransactionPayments = await getExpenseTransactionPayments({
    date,
    userId,
  });

  const latestExchangeRates = await ExchangeRateModel.findOne().sort({
    date: -1,
  });
  const rates = latestExchangeRates?.rates || {};

  const output = processTransactionPaymentData({
    incomeTransactions,
    expenseTransactionPayments,
    rates,
    currency,
  });

  return output;
};

const fetchMonthlyByCategory = async (
  body: DateRangeCurrencyProps,
  categoryName?: string,
) => {
  const { startDate, endDate, currency, userId } = body;

  try {
    const startYearMonth = formatYearMonth(startDate);
    const endYearMonth = formatYearMonth(endDate);

    // First, get the category details if categoryName is provided
    let categoryDetails = null;
    if (categoryName) {
      categoryDetails = await CategoryModel.findOne({
        name: {
          $regex: new RegExp(`\\b${categoryName.split('').join('.*')}\\b`, 'i'),
        },
      });
    }

    // Get the currency details
    const currencyDetails = await CurrencyModel.findOne({ name: currency });
    if (!currencyDetails) {
      throw new Error(`Currency "${currency}" not found`);
    }

    // Ensure we have valid category details
    if (categoryName && !categoryDetails) {
      throw new Error(`Category "${categoryName}" not found`);
    }

    const latestExchangeRates = await ExchangeRateModel.findOne().sort({
      date: -1,
    });
    const rates = latestExchangeRates?.rates || {};

    const result = await PaymentModel.aggregate([
      {
        $match: {
          userId,
        },
      },
      {
        $facet: {
          dateRange: [
            {
              $addFields: {
                startDate: {
                  $dateFromString: {
                    dateString: startDate,
                  },
                },
                endDate: {
                  $dateFromString: {
                    dateString: endDate,
                  },
                },
              },
            },
            {
              $project: {
                dates: {
                  $map: {
                    input: {
                      $range: [
                        0,
                        {
                          $add: [
                            1,
                            {
                              $multiply: [
                                12,
                                {
                                  $subtract: [
                                    { $year: '$endDate' },
                                    { $year: '$startDate' },
                                  ],
                                },
                              ],
                            },
                            {
                              $subtract: [
                                { $month: '$endDate' },
                                { $month: '$startDate' },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    as: 'monthOffset',
                    in: {
                      $dateAdd: {
                        startDate: '$startDate',
                        unit: 'month',
                        amount: '$$monthOffset',
                      },
                    },
                  },
                },
              },
            },
            { $unwind: '$dates' },
            {
              $project: {
                date: '$dates',
                year: { $year: '$dates' },
                month: { $month: '$dates' },
                yearMonth: {
                  $toInt: {
                    $concat: [
                      { $toString: { $year: '$dates' } },
                      {
                        $cond: {
                          if: { $lt: [{ $month: '$dates' }, 10] },
                          then: {
                            $concat: ['0', { $toString: { $month: '$dates' } }],
                          },
                          else: { $toString: { $month: '$dates' } },
                        },
                      },
                    ],
                  },
                },
              },
            },
            // Add a group to ensure unique dates
            {
              $group: {
                _id: '$yearMonth',
                date: { $first: '$date' },
                year: { $first: '$year' },
                month: { $first: '$month' },
                yearMonth: { $first: '$yearMonth' },
              },
            },
          ],
          payments: [
            // Lookup transaction details
            {
              $lookup: {
                from: 'transactions',
                localField: 'transaction',
                foreignField: '_id',
                as: 'transactionData',
              },
            },
            { $unwind: '$transactionData' },

            // Lookup category details
            {
              $lookup: {
                from: 'categories',
                localField: 'transactionData.category',
                foreignField: '_id',
                as: 'categoryData',
              },
            },
            { $unwind: '$categoryData' },

            // Lookup currency details
            {
              $lookup: {
                from: 'currencies',
                localField: 'currency',
                foreignField: '_id',
                as: 'currencyData',
              },
            },
            {
              $unwind: {
                path: '$currencyData',
                preserveNullAndEmptyArrays: true,
              },
            },

            // Match category name (if provided)
            {
              $match: categoryName
                ? {
                    'categoryData.name': {
                      $regex: new RegExp(
                        `\\b${categoryName.split('').join('.*')}\\b`,
                        'i',
                      ),
                    },
                  }
                : {},
            },

            // Compute year-month for joining
            {
              $addFields: {
                yearMonth: {
                  $toInt: {
                    $concat: [
                      { $toString: { $year: '$date' } },
                      {
                        $cond: {
                          if: { $lt: [{ $month: '$date' }, 10] },
                          then: {
                            $concat: ['0', { $toString: { $month: '$date' } }],
                          },
                          else: { $toString: { $month: '$date' } },
                        },
                      },
                    ],
                  },
                },
              },
            },

            // Filter payments within date range
            {
              $match: {
                $expr: {
                  $and: [
                    { $gte: ['$yearMonth', startYearMonth] },
                    { $lte: ['$yearMonth', endYearMonth] },
                  ],
                },
              },
            },

            // Group by date and category
            {
              $group: {
                _id: {
                  yearMonth: '$yearMonth',
                  categoryId: '$categoryData._id',
                  categoryName: '$categoryData.name',
                  currencyId: '$currencyData._id',
                  currencyName: '$currencyData.name',
                },
                paymentId: { $first: '$_id' },
                totalAmount: { $sum: { $toDouble: '$amount' } },
              },
            },
            // Add currency conversion in the payments pipeline
            {
              $addFields: {
                convertedAmount: {
                  $cond: {
                    if: { $eq: ['$_id.currencyName', currency] },
                    then: '$totalAmount',
                    else: {
                      $multiply: [
                        '$totalAmount',
                        {
                          $divide: [
                            {
                              $ifNull: [
                                {
                                  $toDouble: {
                                    $getField: {
                                      field: currency,
                                      input: rates,
                                    },
                                  },
                                },
                                1,
                              ],
                            },
                            {
                              $ifNull: [
                                {
                                  $toDouble: {
                                    $getField: {
                                      field: {
                                        $ifNull: [
                                          '$_id.currencyName',
                                          currency,
                                        ],
                                      },
                                      input: rates,
                                    },
                                  },
                                },
                                1,
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  },
                },
              },
            },
          ],
        },
      },
      {
        $project: {
          combined: {
            $map: {
              input: '$dateRange',
              as: 'date',
              in: {
                $let: {
                  vars: {
                    payment: {
                      $filter: {
                        input: '$payments',
                        as: 'p',
                        cond: {
                          $eq: ['$$p._id.yearMonth', '$$date.yearMonth'],
                        },
                      },
                    },
                  },
                  in: {
                    date: '$$date.date',
                    year: '$$date.year',
                    month: '$$date.month',
                    yearMonth: '$$date.yearMonth',
                    categoryId: {
                      $ifNull: [
                        { $arrayElemAt: ['$$payment._id.categoryId', 0] },
                        categoryDetails?._id,
                      ],
                    },
                    categoryName: {
                      $ifNull: [
                        { $arrayElemAt: ['$$payment._id.categoryName', 0] },
                        categoryDetails?.name,
                      ],
                    },
                    currencyId: currencyDetails._id,
                    currencyName: currency,
                    paymentId: {
                      $ifNull: [
                        { $arrayElemAt: ['$$payment.paymentId', 0] },
                        null,
                      ],
                    },
                    paidAmount: {
                      $ifNull: [
                        { $arrayElemAt: ['$$payment.convertedAmount', 0] },
                        0,
                      ],
                    },
                  },
                },
              },
            },
          },
        },
      },
      { $unwind: '$combined' },
      { $replaceRoot: { newRoot: '$combined' } },
      { $sort: { yearMonth: 1 } },
    ]);

    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export { fetchTransactionPayments, fetchMonthlyByCategory };
