'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import moment from 'moment';
import { useTranslations } from 'next-intl';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

import { useAppSelector } from '../../lib/hooks/use-redux';
import { useGetTransactionsQuery } from '../../lib/redux/services/transactions';

import { CircularProgress, ScrollShadow } from '@heroui/react';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { DatePicker } from '../../components/shared/DatePicker';
import { SelectBox } from '../../components/shared/SelectBox';
import Loader from '../../components/shared/Loader';
import TransactionCard from './Transaction/TransactionCard';

import { dateStringFormat } from '@shared/constants/dateStringFormat';

import type { ListProps } from '../../types/List';
import type { TransactionProps } from '../../types/Transaction';

const Transactions = () => {
  const t = useTranslations();

  const { types } = useAppSelector((state) => state.main);
  const { user } = useAppSelector((state) => state.auth);
  const userId = user?.id || '';
  const dashboardDateString = useAppSelector((state) => state.dashboard.date);

  const newTypes = types.map((type) => {
    const isTranslated = t.has(`Common.type.${type.id}`);

    return {
      _id: type._id,
      name: isTranslated ? t(`Common.type.${type.id}`) : type.name,
    };
  });

  const dashboardDate = useMemo(
    () => moment(dashboardDateString, dateStringFormat).toDate(),
    [dashboardDateString],
  );

  const [date, setDate] = useState<Date>(dashboardDate);
  const [selectedType, setSelectedType] = useState<ListProps>({
    _id: '',
    name: '',
  });

  const [queryParams, setQueryParams] = useState({
    page: 1,
    limit: 8,
    body: {
      date: date.toISOString(),
      type: selectedType._id,
      userId,
    },
  });

  const [isResetting, setIsResetting] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const {
    data,
    isFetching,
    isLoading: isApiLoading,
    error,
  } = useGetTransactionsQuery(queryParams, {
    skip: !selectedType._id || !date || !userId || types.length === 0,
  });

  const transactions: TransactionProps[] = useMemo(() => {
    return data?.data ?? [];
  }, [data]);

  const isFullyFetched = useMemo(() => {
    return data?.isFullyFetched ?? false;
  }, [data]);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (types && types.length > 0) {
      setSelectedType(types[0]);
      setQueryParams((prev) => ({
        ...prev,
        body: {
          ...prev.body,
          type: types[0]._id,
        },
      }));
    }
  }, [types]);

  // Update selectedType name when translations change
  useEffect(() => {
    if (selectedType._id && newTypes.length > 0) {
      const updatedType = newTypes.find((t) => t._id === selectedType._id);
      if (updatedType && updatedType.name !== selectedType.name) {
        setSelectedType(updatedType);
      }
    }
  }, [newTypes, selectedType._id, selectedType.name]);

  useEffect(() => {
    setIsResetting(true);

    if (selectedType._id) {
      setQueryParams((prev) => ({
        ...prev,
        page: 1,
        body: {
          date: date.toISOString(),
          type: selectedType._id,
          userId,
        },
      }));
    }
  }, [date, selectedType, userId]);

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
      if (!container || isFullyFetched || isFetching || isLoadingMore) return;

      const scrolledToBottom =
        container.scrollHeight - container.scrollTop <=
        container.clientHeight + 100;

      if (scrolledToBottom) {
        setIsLoadingMore(true);

        setQueryParams((prev) => ({
          ...prev,
          page: prev.page + 1,
        }));
      }
    };

    const container = scrollContainerRef.current;
    container?.addEventListener('scroll', onScroll);

    return () => {
      container?.removeEventListener('scroll', onScroll);
    };
  }, [isFetching, isFullyFetched, isLoadingMore]);

  useEffect(() => {
    if (!isFetching) {
      setIsLoadingMore(false);
    }
  }, [isFetching]);

  const handlePrevMonth = () => {
    const newDate = moment(date).add(-1, 'months');

    setDate(moment(newDate).toDate());
  };

  const handleNextMonth = () => {
    const newDate = moment(date).add(1, 'months');

    setDate(moment(newDate).toDate());
  };

  const isLoading = isFetching && !isLoadingMore;

  if (isLoading) return <Loader />;

  return (
    <>
      <div className="flex flex-row items-center justify-center gap-1 sm:gap-4">
        <Button variant="ghost" size="rounded-icon" onClick={handlePrevMonth}>
          <ChevronLeftIcon className="size-4" />
        </Button>

        <DatePicker date={date} onChange={setDate}>
          <Button variant="ghost" className="px-1">
            <Label
              variant="title-xl"
              className="hover:bg-background hover:underline"
            >
              {moment(date).format('MMM yyyy')}
            </Label>
          </Button>
        </DatePicker>

        <Button variant="ghost" size="rounded-icon" onClick={handleNextMonth}>
          <ChevronRightIcon className="size-4" />
        </Button>
      </div>

      <div className="space-y-2">
        <div className="flex flex-row justify-end">
          <SelectBox
            variant="ghost"
            items={newTypes}
            selectedItem={selectedType}
            setSelectedItem={setSelectedType}
            placeholder={t('Common.label.selectPlaceholder')}
            className="w-fit p-0 text-base font-semibold"
          />
        </div>

        <ScrollShadow
          ref={scrollContainerRef}
          className="h-[70vh] overflow-y-auto"
          hideScrollBar
        >
          <div className="space-y-4">
            {transactions.length > 0 &&
              transactions.map((transaction) => (
                <TransactionCard
                  key={transaction._id}
                  date={date}
                  transaction={transaction}
                />
              ))}

            {isLoadingMore && (
              <div className="flex justify-center py-4">
                <CircularProgress size="sm" aria-label="Loading more..." />
              </div>
            )}

            {isFullyFetched && transactions.length > 0 && (
              <div className="text-center">
                <Label variant="subtitle" className="text-muted-foreground">
                  {t('Common.label.noMoreData')}
                </Label>
              </div>
            )}

            {!isApiLoading && transactions.length === 0 && (
              <div className="text-center">
                <Label variant="subtitle" className="text-muted-foreground">
                  {t('Common.label.noData')}
                </Label>
              </div>
            )}

            {error && (
              <div className="text-center">
                <Label variant="error">
                  {t('Common.label.errorLoadingData')}
                </Label>
              </div>
            )}
          </div>
        </ScrollShadow>
      </div>
    </>
  );
};

export default Transactions;
