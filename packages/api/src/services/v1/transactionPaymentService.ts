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
    },
    {
      $project: {
        _id: 1,
        name: 1,
        categoryId: '$category._id',
        category: '$category.name',
        typeId: '$type._id',
        type: '$type.name',
        amount: 1,
        currencyId: '$currency._id',
        currency: '$currency.name',
        description: 1,
        recurring: 1,
        startDate: 1,
        endDate: 1,
        excludedDates: 1
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
        typeId: '$type._id',
        typeName: '$type.name',
        amount: 1,
        currencyId: '$currency._id',
        currency: '$currency.name',
        paidAmount: '$payment.amount',
        paidCurrencyId: '$paymentCurrency._id',
        paidCurrency: '$paymentCurrency.name',
        description: 1,
        recurring: 1,
        startDate: 1,
        endDate: 1,
        excludedDates: 1
      }
    }
  ]);

  const latestExchangeRates = await ExchangeRateModel.findOne().sort({
    date: -1
  });
  const rates = latestExchangeRates?.rates || {};

  // console.log('incomeTransactions', incomeTransactions);
  console.log('expenseTransactionPayments', expenseTransactionPayments);

  const processTransactionPaymentData = () => {
    const budget = incomeTransactions.reduce(
      (accumulator, incomeTransaction) => {
        const value = parseFloat(incomeTransaction.amount);
        const fromCurrency = incomeTransaction.currency;

        const amount = convertCurrency(value, fromCurrency, currency, rates);

        return accumulator + amount;
      },
      0
    );

    let totalAmount = 0;
    let totalPaidAmount = 0;

    expenseTransactionPayments.forEach((expenseTransactionPayment) => {
      if (expenseTransactionPayment.amount) {
        const totalAmountValue = parseFloat(expenseTransactionPayment.amount);
        const totalAmountCurrency = expenseTransactionPayment.currency;

        totalAmount += convertCurrency(
          totalAmountValue,
          totalAmountCurrency,
          currency,
          rates
        );
      }

      if (expenseTransactionPayment.paidAmount) {
        const totalPaidAmountValue = parseFloat(
          expenseTransactionPayment.paidAmount
        );
        const totalPaidAmountCurrency = expenseTransactionPayment.paidCurrency;

        totalPaidAmount += convertCurrency(
          totalPaidAmountValue,
          totalPaidAmountCurrency,
          currency,
          rates
        );
      }
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
          const key = expenseTransactionPayment.categoryId;

          if (!accumulator[key]) {
            accumulator[key] = {
              _id: expenseTransactionPayment.categoryId,
              name: expenseTransactionPayment.category,
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
              expenseTransactionPayment.amount
            );

            amount =
              currency === amountCurrency
                ? transactionAmount
                : convertCurrency(
                    transactionAmount,
                    amountCurrency,
                    currency,
                    rates
                  );
          }

          let paidAmount = 0;

          if (expenseTransactionPayment.paidAmount) {
            const paidCurrency = expenseTransactionPayment.paidCurrency;

            const transactionPaidAmount = parseFloat(
              expenseTransactionPayment.paidAmount
            );

            paidAmount =
              currency === paidCurrency
                ? transactionPaidAmount
                : convertCurrency(
                    transactionPaidAmount,
                    paidCurrency,
                    currency,
                    rates
                  );
          }

          const transaction = {
            _id: expenseTransactionPayment._id,
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

  return processTransactionPaymentData();
};

export { fetchTransactionPayments };
