import { CategoryModel } from '../../models/v1/categoryModel';
import { CurrencyModel } from '../../models/v1/currencyModel';
import { ExchangeRateModel } from '../../models/v1/exchangeRateModel';
import { PaymentModel } from '../../models/v1/paymentModel';
import { TransactionModel } from '../../models/v1/transactionModel';
import { TypeModel } from '../../models/v1/typeModel';
import convertCurrency from '../../utilities/convertCurrency';

type TransactionPaymentProps = {
  date: Date;
  currency: string;
};

const fetchTransactionPayments = async (data: TransactionPaymentProps) => {
  const date = new Date(data.date);
  const currency = data.currency;

  const incomeTransactions = await TransactionModel.aggregate([
    {
      // Find transactions within the specified date range and exclude transactions with the specified date
      $match: {
        startDate: { $lte: date },
        endDate: { $gte: date },
        excludedDates: { $nin: [date] }
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
      // Unwind the array created by populate to get the category object
      $unwind: '$type'
    },
    {
      // Perform a left outer join with the TypeModel collection based on the 'type' field of the category
      $lookup: {
        from: CurrencyModel.collection.name,
        localField: 'currency',
        foreignField: '_id',
        as: 'currency'
      }
    },
    {
      // Unwind the array created by populate to get the category object
      $unwind: '$currency'
    },
    {
      // Filter transactions where the category type is 'Expense'
      $match: {
        'type.name': 'Income'
      }
    }
  ]);

  const expenseTransactionPayments = await TransactionModel.aggregate([
    {
      // Find transactions within the specified date range and exclude transactions with the specified date
      $match: {
        startDate: { $lte: date },
        endDate: { $gte: date },
        excludedDates: { $nin: [date] }
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
              date: { $gte: date }
            }
          }
        ]
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
      $addFields: {
        paidAmount: { $sum: '$payment.amount' },
        paidCurrency: '$payment.currency'
      }
    }
  ]);

  const latestExchangeRates = await ExchangeRateModel.findOne().sort({
    date: -1
  });
  const rates = latestExchangeRates?.rates || {};

  const processTransactionPaymentData = () => {
    const budget = incomeTransactions.reduce(
      (accumulator, incomeTransaction) =>
        accumulator + parseFloat(incomeTransaction.amount),
      0
    );

    // const totalAmount = expenseTransactionPayments.reduce(
    //   (acculumator, expenseTransactionPayment) =>
    //     acculumator + parseFloat(expenseTransactionPayment.amount),
    //   0
    // );

    // const totalPaidAmount = expenseTransactionPayments.reduce(
    //   (accumulator, expenseTransactionPayment) =>
    //     accumulator + parseFloat(expenseTransactionPayment.paidAmount),
    //   0
    // );

    let totalAmount = 0;
    let totalPaidAmount = 0;
    expenseTransactionPayments.forEach((expenseTransactionPayment) => {
      totalAmount += expenseTransactionPayment.amount;
      totalPaidAmount += expenseTransactionPayment.paidAmount;
    });

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
        (accumulator, expenseTransactionPayment) => {
          const key = expenseTransactionPayment.category._id;

          if (!accumulator[key]) {
            accumulator[key] = {
              _id: expenseTransactionPayment.category._id,
              name: expenseTransactionPayment.category.name,
              currency,
              totalAmount: 0,
              totalPaidAmount: 0,
              paymentCompletionRate: 0,
              transactions: []
            };
          }

          const amountCurrency = expenseTransactionPayment.currency;
          const paidCurrency = expenseTransactionPayment.paidCurrency;

          let amount = parseFloat(expenseTransactionPayment.amount);
          if (currency !== amountCurrency) {
            amount = convertCurrency(amount, amountCurrency, currency, rates);
          }

          let paidAmount = parseFloat(expenseTransactionPayment.paidAmount);
          if (currency !== paidCurrency) {
            paidAmount = convertCurrency(
              paidAmount,
              paidCurrency,
              currency,
              rates
            );
          }

          const transaction = {
            _id: expenseTransactionPayment._id,
            name: expenseTransactionPayment.name,
            currency,
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

  return processTransactionPaymentData();
};

export { fetchTransactionPayments };
