'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import moment from 'moment';
import { useTranslations } from 'next-intl';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

import { useAppSelector } from '../../lib/hooks/use-redux';
import { useGetTransactionsQuery } from '../../lib/redux/services/transactions';

import { DatePicker } from '../../components/shared/DatePicker';
import { Button } from '../../components/ui/button';
import { CircularProgress, ScrollShadow } from '@heroui/react';
// import { ScrollShadow } from '../../components/ui/scroll-shadow';
import { SelectBox } from '../../components/shared/SelectBox';
import TransactionCard from './Transaction/TransactionCard';

import { dateStringFormat } from '@shared/constants/dateStringFormat';

import type { ListProps } from '../../types/List';
import type { TransactionProps } from '../../types/Transaction';

const Transactions = () => {
  const t = useTranslations();

  const { types } = useAppSelector((state) => state.main);
  const dashboardDateString = useAppSelector((state) => state.dashboard.date);

  const dashboardDate = useMemo(
    () => moment(dashboardDateString, dateStringFormat).toDate(),
    [dashboardDateString],
  );

  const [date, setDate] = useState<Date>(dashboardDate);
  const [selectedType, setSelectedType] = useState<ListProps>({
    _id: '',
    name: '',
  });
  const [page, setPage] = useState(1);
  const [isResetting, setIsResetting] = useState(false);

  const { data, isFetching, isLoading } = useGetTransactionsQuery(
    {
      page,
      limit: 8,
      body: { type: selectedType._id, date: date.toISOString() },
    },
    { skip: !selectedType._id || !date },
  );

  const transactions: TransactionProps[] = data?.data ?? [];
  const isFullyFetched = data?.isFullyFetched ?? false;

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (types && types.length > 0) {
      setSelectedType(types[0]);
    }
  }, [types]);

  useEffect(() => {
    setPage(1);
    setIsResetting(true);
  }, [date, selectedType]);

  useEffect(() => {
    if (isResetting) {
      const container = scrollContainerRef.current;

      if (container) {
        container.scrollTo({ top: 0, behavior: 'smooth' });
      }

      setIsResetting(false);
    }
  }, [isResetting]);

  useEffect(() => {
    const onScroll = () => {
      const container = scrollContainerRef.current;
      if (!container || isFullyFetched) return; // Stop if fully fetched

      const scrolledToBottom =
        container.scrollHeight - container.scrollTop <=
        container.clientHeight + 10;

      if (scrolledToBottom && !isFetching) {
        setPage((prevPage) => prevPage + 1); // Load next page
      }
    };

    const container = scrollContainerRef.current;
    container?.addEventListener('scroll', onScroll);

    return () => {
      container?.removeEventListener('scroll', onScroll);
    };
  }, [isFetching, isFullyFetched]);

  const handlePrevMonth = () => {
    const newDate = moment(date).add(-1, 'months');

    setDate(moment(newDate).toDate());
  };

  const handleNextMonth = () => {
    const newDate = moment(date).add(1, 'months');

    setDate(moment(newDate).toDate());
  };

  if (isLoading)
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center">
        <CircularProgress aria-label="Loading..." size="lg" />
      </div>
    );

  return (
    <div className="mx-auto max-w-lg space-y-6 sm:space-y-10">
      <div className="flex flex-row items-center justify-center">
        <Button
          variant="ghost"
          size="sm_rounded_icon"
          onClick={handlePrevMonth}
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>

        <DatePicker date={date} onChange={setDate}>
          <Button variant="ghost" className="px-1">
            <p className="hover:bg-background text-3xl font-extrabold hover:underline sm:text-5xl sm:font-black">
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
            {transactions.length > 0 &&
              transactions.map((transaction, index) => (
                <TransactionCard
                  key={index}
                  date={date}
                  transaction={transaction}
                  // fetchTransactionsData={fetchTransactionsData}
                />
              ))}
          </div>
        </ScrollShadow>

        {/* {isFullyFetched && <p>No more data to load</p>} */}
      </div>
    </div>
  );
};

export default Transactions;
