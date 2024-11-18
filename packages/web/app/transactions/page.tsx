'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import fetchTransactions from '@/providers/fetchTransactions';

import { formatCurrency } from '../../../../shared/utilities/formatCurrency';
import EditTransactionDrawer from './EditTransaction/EditTransactionDrawer';

type TransactionProps = {
  transactions: [
    {
      _id: string;
      name: string;
      currencyId: string;
      currencyName: string;
      amount: number;
      description: string;
    }
  ];
  categoryId: string;
  categoryName: string;
  typeId: string;
  typeName: string;
};

const Transactions = () => {
  const [transactions, setTransactions] = useState<TransactionProps[]>([]);

  useEffect(() => {
    fetchTransactionsData();
  }, []);

  const fetchTransactionsData = async () => {
    const date = new Date();

    const result = await fetchTransactions({ date });

    setTransactions(result);
  };

  return (
    <div className="space-y-2">
      {transactions.map((transactionCategory) => (
        <div key={transactionCategory.categoryId} className="space-y-2">
          <Label
            className="text-lg font-bold"
            key={transactionCategory.categoryId}
          >
            {transactionCategory.categoryName}
          </Label>

          {transactionCategory.transactions.map((transaction) => (
            <div key={transaction._id}>
              <EditTransactionDrawer
                transaction={transaction}
                fetchTransactions={fetchTransactionsData}
              >
                <Card>
                  <CardHeader>
                    <p className="text-sm truncate hover:text-clip">
                      {transaction.name}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex flex-row justify-between items-center">
                        <p className="text-lg font-bold">
                          {formatCurrency({
                            value: transaction.amount,
                            currency: transaction.currencyName,
                            decimal: 2
                          })}
                        </p>

                        <p>{`(${transaction.currencyName})`}</p>
                      </div>

                      <p className="italic text-slate-500 dark:text-slate-400">
                        {transaction.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </EditTransactionDrawer>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Transactions;
