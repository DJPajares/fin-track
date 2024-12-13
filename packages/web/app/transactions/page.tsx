'use client';

import { useEffect, useRef, useState } from 'react';
import moment from 'moment';
import { useTranslations } from 'next-intl';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

import { useAppSelector } from '../../lib/hooks';
import { fetchTransactions } from '../../providers/fetchTransactions';

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

const defaultType = {
  _id: '',
  name: ''
};

const Transactions = () => {
  const t = useTranslations();

  const { types } = useAppSelector((state) => state.main);

  const [date, setDate] = useState<Date>(new Date());
  const [transactions, setTransactions] = useState<TransactionProps[]>([]);
  const [selectedType, setSelectedType] = useState<ListProps>(defaultType);

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (types && types.length > 0) {
      setSelectedType(types[0]);
    }
  }, [types]);

  useEffect(() => {
    setTransactions([]);
    setPage(1);
    fetchTransactionsData();
    setHasMore(true);
  }, [date, selectedType]);

  useEffect(() => {
    fetchTransactionsData();
  }, [page]);

  const fetchTransactionsData = async () => {
    if (selectedType._id) {
      const result = await fetchTransactions({
        type: selectedType._id,
        date,
        page: page,
        limit: 8
      });

      if (result.data.length === 0) {
        setHasMore(false);
      } else {
        setTransactions((prevData) => [...prevData, ...result.data]);
      }

      setLoading(false);
    }
  };

  const lastElementRef = (node: HTMLDivElement | null) => {
    if (loading) return;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setLoading(true);
        setPage((prevPage) => prevPage + 1);
      }
    });

    if (node) {
      observerRef.current.observe(node);
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

        <ScrollShadow className="h-[70vh]" hideScrollBar>
          <div className="space-y-4">
            {transactions.map((transaction, index) => (
              <TransactionCard
                key={index}
                transaction={transaction}
                fetchTransactionsData={fetchTransactionsData}
              />
            ))}

            <div ref={lastElementRef} className="h-4" />
          </div>
        </ScrollShadow>
      </div>
    </div>
  );
};

export default Transactions;
