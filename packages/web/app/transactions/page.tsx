'use client';

import { useEffect, useRef, useState } from 'react';
import moment from 'moment';
import { useTranslations } from 'next-intl';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

import { useAppSelector } from '../../lib/hooks';
import { fetchTransactions } from '../../providers/fetchTransactions';
import { useGetTransactionsQuery } from '../../lib/services/transactions';

import { DatePicker } from '../../components/shared/DatePicker';
import { Button } from '../../components/ui/button';
import { ScrollShadow } from '../../components/ui/scroll-shadow';
import { SelectBox } from '../../components/shared/SelectBox';
import TransactionCard from './Transaction/TransactionCard';

import type { ListProps } from '../../types/List';
import type { IconProps } from '../../components/shared/CardIcon';

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

const limit = 8;

const Transactions = () => {
  const t = useTranslations();

  const { types } = useAppSelector((state) => state.main);

  const [date, setDate] = useState<Date>(new Date());
  const [selectedType, setSelectedType] = useState<ListProps>({
    _id: '',
    name: ''
  });
  const [page, setPage] = useState(1);

  const { data, isFetching } = useGetTransactionsQuery(
    {
      page,
      limit,
      body: { type: selectedType._id, date: date.toISOString() }
    },
    { skip: !selectedType._id || !date }
  );

  const transactions: TransactionProps[] = data ?? [];

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (types && types.length > 0) {
      setSelectedType(types[0]);
    }
  }, [types]);

  useEffect(() => {
    // Reset the transactions and page when date or type changes
    setPage(1);
  }, [date, selectedType]);

  // useEffect(() => {
  //   const onScroll = () => {
  //     const scrolledToBottom =
  //       window.innerHeight + window.scrollY >= document.body.offsetHeight;

  //     if (scrolledToBottom && !isFetching) {
  //       console.log('Fetching more data...');
  //       setPage(page + 1);
  //     }
  //   };

  //   document.addEventListener('scroll', onScroll);

  //   return function () {
  //     document.removeEventListener('scroll', onScroll);
  //   };
  // }, [page, isFetching]);

  useEffect(() => {
    const onScroll = () => {
      const container = scrollContainerRef.current;
      if (!container) return;

      const scrolledToBottom =
        container.scrollHeight - container.scrollTop <=
        container.clientHeight + 10;

      if (scrolledToBottom && !isFetching) {
        console.log('Fetching more data...');
        setPage((prevPage) => prevPage + 1); // Update page for fetching new data
      }
    };

    const container = scrollContainerRef.current;
    container?.addEventListener('scroll', onScroll);

    return () => {
      container?.removeEventListener('scroll', onScroll);
    };
  }, [isFetching]);

  const handlePrevMonth = () => {
    const newDate = moment(date).add(-1, 'months');

    setDate(moment(newDate).toDate());
  };

  const handleNextMonth = () => {
    const newDate = moment(date).add(1, 'months');

    setDate(moment(newDate).toDate());
  };

  return (
    <div className="space-y-6 sm:space-y-10">
      <div className="flex flex-row justify-center items-center">
        <Button
          variant="ghost"
          size="sm_rounded_icon"
          onClick={handlePrevMonth}
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>

        <DatePicker date={date} onChange={setDate}>
          <Button variant="ghost" className="px-1">
            <p className="text-3xl sm:text-5xl font-extrabold sm:font-black hover:underline hover:bg-background">
              {moment(date).format('MMM yyyy')}
            </p>
          </Button>
        </DatePicker>

        <Button
          variant="ghost"
          size="sm_rounded_icon"
          onClick={handleNextMonth}
        >
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-2">
        <div className="flex flex-row justify-end">
          <SelectBox
            variant="ghost"
            items={types}
            selectedItem={selectedType}
            setSelectedItem={setSelectedType}
            placeholder={t('Common.label.selectPlaceholder')}
            className="w-fit p-0 text-base font-semibold"
          />
        </div>

        <ScrollShadow
          ref={scrollContainerRef}
          className="h-[70vh]"
          hideScrollBar
        >
          <div className="space-y-4">
            {transactions.length > 1 &&
              transactions.map((transaction, index) => (
                <TransactionCard
                  key={index}
                  transaction={transaction}
                  // fetchTransactionsData={fetchTransactionsData}
                />
              ))}
          </div>
        </ScrollShadow>
      </div>
    </div>
  );
};

export default Transactions;
