'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import fetchTransactions from '@/providers/fetchTransactions';
import { useEffect, useState } from 'react';

type TransactionProps = {
  _id: string;
  name: string;
  category: {
    _id: string;
    name: string;
    type: string;
    active: boolean;
    icon: string;
  };
  currency: {
    _id: string;
    name: string;
    description: string;
  };
  amount: any;
  startDate: string;
  endDate: string;
  excludedDates: any[];
};

const Transactions = () => {
  const [transactions, setTransactions] = useState<TransactionProps[]>([]);

  useEffect(() => {
    fetchTransactionsData();
  }, []);

  const fetchTransactionsData = async () => {
    const result = await fetchTransactions({
      page: '1',
      limit: '0',
      sortField: 'name'
    });

    setTransactions(result);
  };

  return (
    <div>
      {transactions.map((transaction) => (
        <Card key={transaction._id}>
          <CardHeader>{transaction.name}</CardHeader>
          <CardContent>
            {/* <p>{transaction.amount.$numberDecimal}</p> */}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Transactions;
