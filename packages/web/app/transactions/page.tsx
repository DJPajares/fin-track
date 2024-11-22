'use client';

import { useEffect, useState } from 'react';
import { Pagination, Tab, Tabs } from '@nextui-org/react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import CardIcon, { type IconProps } from '@/components/shared/CardIcon';

import EditTransactionDrawer from './EditTransaction/EditTransactionDrawer';

import { useAppSelector } from '@/lib/hooks';
import fetchTransactions from '@/providers/fetchTransactions';

import { formatCurrency } from '../../../../shared/utilities/formatCurrency';
import { DatePicker } from '@/components/shared/DatePicker';
import { Button } from '@/components/ui/button';
import moment from 'moment';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

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

  const [date, setDate] = useState<Date>(new Date());
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
  }, [date, tabType]);

  // useEffect(() => {
  //   setCurrentPage(1);

  //   fetchTransactionsData();
  // }, [tabType]);

  useEffect(() => {
    fetchTransactionsData();
  }, [currentPage]);

  const fetchTransactionsData = async () => {
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

  const handlePrevMonth = () => {
    const newDate = moment(date).add(-1, 'months');

    setDate(moment(newDate).toDate());
  };

  const handleNextMonth = () => {
    const newDate = moment(date).add(1, 'months');

    setDate(moment(newDate).toDate());
  };

  return (
    <div className="space-y-8 sm:space-y-12">
      <div className="flex flex-row justify-center items-center">
        <Button variant="ghost" size="icon" onClick={handlePrevMonth}>
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>

        <DatePicker date={date} onChange={setDate}>
          <Button variant="ghost" className="px-0">
            <p className="text-3xl sm:text-5xl font-extrabold sm:font-black hover:underline hover:bg-background">
              {moment(date).format('MMM yyyy')}
            </p>
          </Button>
        </DatePicker>

        <Button variant="ghost" size="icon" onClick={handleNextMonth}>
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
      </div>

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

              {transactions.map((transaction) => (
                <div key={transaction._id} className="space-y-2">
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

                        <p className="text-lg font-semibold sm:text-xl sm:font-bold">
                          {transaction.name}
                        </p>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex flex-col items-end">
                            <p className="text-lg font-semibold sm:text-xl sm:font-bold">
                              {formatCurrency({
                                value: transaction.amount,
                                currency: transaction.currencyName,
                                decimal: 2
                              })}
                            </p>

                            <p className="text-xs font-extralight">{`(${transaction.currencyName})`}</p>
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
    </div>
  );
};

export default Transactions;
