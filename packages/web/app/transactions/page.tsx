'use client';

import { useEffect, useState } from 'react';
import { Pagination, Tab, Tabs } from '@nextui-org/react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import CardIcon, { type IconProps } from '@/components/shared/CardIcon';

import EditTransactionDrawer from './EditTransaction/EditTransactionDrawer';

import { useAppSelector } from '@/lib/hooks';
import fetchTransactions from '@/providers/fetchTransactions';

import { formatCurrency } from '../../../../shared/utilities/formatCurrency';

type TransactionProps = {
  _id: string;
  name: string;
  typeId: string;
  typeName: string;
  categoryId: string;
  categoryName: string;
  categoryIcon: IconProps;
  currencyId: string;
  currencyName: string;
  amount: number;
  description: string;
};

type PaginationProps = {
  limit: number;
  currentPage: number;
  totalPages: number;
  totalDocuments: number;
};

const Transactions = () => {
  const { types } = useAppSelector((state) => state.main);

  const [transactions, setTransactions] = useState<TransactionProps[]>([]);
  const [pagination, setPagination] = useState<PaginationProps>({
    limit: 0,
    currentPage: 0,
    totalPages: 0,
    totalDocuments: 0
  });
  const [tabType, setTabType] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);

    fetchTransactionsData();
  }, [tabType]);

  useEffect(() => {
    fetchTransactionsData();
  }, [currentPage]);

  const fetchTransactionsData = async () => {
    const date = new Date();

    if (tabType) {
      const result = await fetchTransactions({
        type: tabType,
        date,
        page: currentPage,
        limit: 3
      });

      setTransactions(result.data);
      setPagination(result.pagination);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-8">
      <Tabs
        variant="bordered"
        radius="full"
        size="lg"
        color="primary"
        className="flex flex-col items-center"
        classNames={{
          tabContent:
            'group-data-[selected=true]:text-primary-foreground text-sm font-bold uppercase'
        }}
        selectedKey={tabType}
        onSelectionChange={setTabType}
      >
        {types.map((type) => (
          <Tab key={type._id.toString()} title={type.name}>
            <div className="space-y-2">
              {transactions.map((transaction) => (
                <div key={transaction._id}>
                  <EditTransactionDrawer
                    transaction={transaction}
                    fetchTransactions={fetchTransactionsData}
                  >
                    <Card className="cursor-pointer">
                      <CardHeader>
                        <div className="flex flex-row items-center justify-between gap-4">
                          <p className="text-sm text-slate-500 dark:text-slate-400 truncate hover:text-clip">
                            {transaction.categoryName}
                          </p>

                          {<CardIcon icon={transaction.categoryIcon} />}
                        </div>

                        <h1 className="text-lg font-bold sm:text-xl sm:font-bold">
                          {transaction.name}
                        </h1>
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
          </Tab>
        ))}
      </Tabs>

      <div className="flex flex-col items-center">
        <Pagination
          variant="light"
          color="primary"
          total={pagination.totalPages}
          page={currentPage}
          initialPage={1}
          onChange={setCurrentPage}
          showControls
        />
      </div>
    </div>
  );
};

export default Transactions;
