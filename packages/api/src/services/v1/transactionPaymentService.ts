import { Types } from 'mongoose';
import { CategoryModel, CategoryProps } from '../../models/v1/categoryModel';
import { CurrencyModel, CurrencyProps } from '../../models/v1/currencyModel';
import { ExchangeRateModel } from '../../models/v1/exchangeRateModel';
import { PaymentModel, PaymentProps } from '../../models/v1/paymentModel';
import {
  TransactionModel,
  TransactionProps
} from '../../models/v1/transactionModel';
import { TypeModel, TypeProps } from '../../models/v1/typeModel';
import convertCurrency from '../../utilities/convertCurrency';

type FetchTransactionPaymentProps = {
  date: Date;
  currency: string;
};

type IncomeTransactionsProps = TransactionProps & {
  categoryId: CategoryProps['_id'];
  category: CategoryProps['name'];
  typeId: TypeProps['_id'];
  type: TypeProps['name'];
  currencyId: CurrencyProps['_id'];
  currency: CurrencyProps['name'];
};

type ExpenseTransactionPaymentsProps = TransactionProps & {
  categoryId: CategoryProps['_id'];
  category: CategoryProps['name'];
  categoryIcon: CategoryProps['icon'];
  typeId: TypeProps['_id'];
  type: TypeProps['name'];
  currencyId: CurrencyProps['_id'];
  currency: CurrencyProps['name'];
  paymentId: PaymentProps['_id'];
  paidAmount: PaymentProps['amount'];
  paidCurrencyId: CurrencyProps['_id'];
  paidCurrency: CurrencyProps['name'];
};

type ProcessTransactionPaymentDataProps = {
  incomeTransactions: IncomeTransactionsProps[];
  expenseTransactionPayments: ExpenseTransactionPaymentsProps[];
  rates: Record<string, number>;
  currency: string;
};

const fetchTransactionPayments = async (data: FetchTransactionPaymentProps) => {
  const date = new Date(data.date);
  const year = new Date(date).getFullYear();
  const month = new Date(date).getMonth() + 1;
  const paddedMonth = month.toString().padStart(2, '0');
  const yearMonth = parseInt(`${year}${paddedMonth}`);

  const incomeTransactions = await TransactionModel.aggregate([
    {
      // Find transactions within the specified date range and exclude transactions with the specified date (year-month)
      $match: {
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
    {
      // Perform a left outer join with the CategoryModel collection
      $lookup: {
        from: CategoryModel.collection.name,
        localField: 'category',
        foreignField: '_id',
        as: 'category'
      }
    },
    {
      // Unwind the array created by populate to get the category object
      $unwind: '$category'
    },
    {
      // Perform a left outer join with the TypeModel collection based on the 'type' field of the category
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
      $lookup: {
        from: CurrencyModel.collection.name,
        localField: 'currency',
        foreignField: '_id',
        as: 'currency'
      }
    },
    {
      $unwind: '$currency'
    },
    {
      // Filter transactions where the category type is 'Expense'
      $match: {
        'type.name': 'Income'
      }
    },
    {
      $project: {
        _id: 1,
        name: 1,
        categoryId: '$category._id',
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
        excludedDates: 1
      }
    },
    {
      $sort: { category: 1, name: 1 }
    }
  ]);

  const expenseTransactionPayments = await TransactionModel.aggregate([
    {
      // Find transactions within the specified date range and exclude transactions with the specified date (year-month)
      $match: {
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
              $expr: {
                $and: [
                  { $gte: [{ $year: '$date' }, year] },
                  { $gte: [{ $month: '$date' }, month] }
                ]
              }
            }
          }
        ]
      }
    },
    {
      // Unwind the payment array to include each payment object separately
      $unwind: {
        path: '$payment',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $lookup: {
        from: CurrencyModel.collection.name,
        localField: 'payment.currency',
        foreignField: '_id',
        as: 'paymentCurrency'
      }
    },
    {
      $unwind: {
        path: '$paymentCurrency',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      // Perform a left outer join with the CategoryModel collection
      $lookup: {
        from: CategoryModel.collection.name,
        localField: 'category',
        foreignField: '_id',
        as: 'category'
      }
    },
    {
      // Unwind the array created by populate to get the category object
      $unwind: '$category'
    },
    {
      $lookup: {
        from: CurrencyModel.collection.name,
        localField: 'currency',
        foreignField: '_id',
        as: 'currency'
      }
    },
    {
      $unwind: '$currency'
    },
    {
      // Perform a left outer join with the TypeModel collection based on the 'type' field of the category
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
      // Filter transactions where the category type is 'Expense'
      $match: {
        'type.name': 'Expense'
      }
    },
    {
      $project: {
        _id: 1,
        name: 1,
        categoryId: '$category._id',
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
        excludedDates: 1
      }
    },
    {
      $sort: { category: 1, name: 1 }
    }
  ]);

  const latestExchangeRates = await ExchangeRateModel.findOne().sort({
    date: -1
  });
  const rates = latestExchangeRates?.rates || {};

  const output = processTransactionPaymentData({
    incomeTransactions,
    expenseTransactionPayments,
    rates,
    currency: data.currency
  });

  return output;
};

const processTransactionPaymentData = ({
  incomeTransactions,
  expenseTransactionPayments,
  rates,
  currency
}: ProcessTransactionPaymentDataProps) => {
  const budget = incomeTransactions.reduce(
    (accumulator: number, incomeTransaction: IncomeTransactionsProps) => {
      const value = parseFloat(incomeTransaction.amount.toString());
      const fromCurrency = incomeTransaction.currency;

      const amount = convertCurrency({
        value,
        fromCurrency,
        toCurrency: currency,
        rates
      });

      return accumulator + amount;
    },
    0
  );

  let totalAmount = 0;
  let totalPaidAmount = 0;

  expenseTransactionPayments.forEach(
    (expenseTransactionPayment: ExpenseTransactionPaymentsProps) => {
      if (expenseTransactionPayment.amount) {
        const totalAmountValue = parseFloat(
          expenseTransactionPayment.amount.toString()
        );
        const totalAmountCurrency = expenseTransactionPayment.currency;

        totalAmount += convertCurrency({
          value: totalAmountValue,
          fromCurrency: totalAmountCurrency,
          toCurrency: currency,
          rates
        });
      }

      if (expenseTransactionPayment.paidAmount) {
        const totalPaidAmountValue = parseFloat(
          expenseTransactionPayment.paidAmount.toString()
        );
        const totalPaidAmountCurrency = expenseTransactionPayment.paidCurrency;

        totalPaidAmount += convertCurrency({
          value: totalPaidAmountValue,
          fromCurrency: totalPaidAmountCurrency,
          toCurrency: currency,
          rates
        });
      }
    }
  );

  const main = {
    currency,
    budget,
    totalAmount,
    totalPaidAmount,
    balance: budget - totalPaidAmount,
    extra: budget - totalAmount,
    paymentCompletionRate: totalPaidAmount / totalAmount
  };

  const categories = Object.values(
    expenseTransactionPayments.reduce(
      (
        accumulator: any,
        expenseTransactionPayment: ExpenseTransactionPaymentsProps
      ) => {
        const key = expenseTransactionPayment.categoryId.toString();

        if (!accumulator[key]) {
          accumulator[key] = {
            _id: expenseTransactionPayment.categoryId,
            name: expenseTransactionPayment.category,
            icon: expenseTransactionPayment.categoryIcon,
            totalAmount: 0,
            totalPaidAmount: 0,
            paymentCompletionRate: 0,
            transactions: []
          };
        }

        let amount = 0;

        if (expenseTransactionPayment.amount) {
          const amountCurrency = expenseTransactionPayment.currency;

          const transactionAmount = parseFloat(
            expenseTransactionPayment.amount.toString()
          );

          amount =
            currency === amountCurrency
              ? transactionAmount
              : convertCurrency({
                  value: transactionAmount,
                  fromCurrency: amountCurrency,
                  toCurrency: currency,
                  rates
                });
        }

        let paidAmount = 0;
        if (expenseTransactionPayment.paidAmount) {
          const transactionPaidAmount = parseFloat(
            expenseTransactionPayment.paidAmount.toString()
          );
          const paidCurrency = expenseTransactionPayment.paidCurrency;

          paidAmount =
            currency === paidCurrency
              ? transactionPaidAmount
              : convertCurrency({
                  value: transactionPaidAmount,
                  fromCurrency: paidCurrency,
                  toCurrency: currency,
                  rates
                });
        }

        const transaction = {
          _id: expenseTransactionPayment._id,
          paymentId: expenseTransactionPayment.paymentId,
          name: expenseTransactionPayment.name,
          amount,
          paidAmount
        };

        accumulator[key].transactions.push(transaction);
        accumulator[key].totalAmount += transaction.amount;
        accumulator[key].totalPaidAmount += transaction.paidAmount;
        accumulator[key].paymentCompletionRate =
          accumulator[key].totalPaidAmount / accumulator[key].totalAmount;

        return accumulator;
      },
      {}
    )
  );

  const output = {
    main,
    categories
  };

  return output;
};

export { fetchTransactionPayments };
