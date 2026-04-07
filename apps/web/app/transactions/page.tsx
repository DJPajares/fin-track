'use client';

import { CircularProgress, ScrollShadow } from '@heroui/react';
import { dateStringFormat } from '@shared/constants/dateStringFormat';
import TransactionDrawer from '@web/app/dashboard/Transaction/TransactionDrawer';
import { DatePicker } from '@web/components/shared/DatePicker';
import Loader from '@web/components/shared/Loader';
import { SelectBox } from '@web/components/shared/SelectBox';
import {
  TypographyCardTitle,
  TypographyLabel,
  TypographyMuted,
} from '@web/components/shared/Typography';
import { Button } from '@web/components/ui/button';
import { useAppSelector } from '@web/lib/hooks/use-redux';
import { useGetTransactionsQuery } from '@web/lib/redux/services/transactions';
import type { ListProps } from '@web/types/List';
import type { TransactionProps } from '@web/types/Transaction';
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon } from 'lucide-react';
import moment from 'moment';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useRef, useState } from 'react';

import TransactionCard from './Transaction/TransactionCard';

const defaultType: ListProps = {
  _id: '',
  name: '',
};

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
  const [selectedTypeId, setSelectedTypeId] = useState('');
  const [page, setPage] = useState(1);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const selectedType = useMemo(() => {
    return (
      newTypes.find((type) => type._id === selectedTypeId) ??
      newTypes[0] ??
      defaultType
    );
  }, [newTypes, selectedTypeId]);

  const queryParams = useMemo(
    () => ({
      page,
      limit: 8,
      body: {
        date: date.toISOString(),
        type: selectedType._id,
        userId,
      },
    }),
    [date, page, selectedType._id, userId],
  );

  const {
    data,
    isFetching,
    isLoading: isApiLoading,
    error,
    refetch,
  } = useGetTransactionsQuery(queryParams, {
    skip: !selectedType._id || !userId || types.length === 0,
  });

  const transactions: TransactionProps[] = useMemo(() => {
    return data?.data ?? [];
  }, [data]);

  const isFullyFetched = useMemo(() => {
    return data?.isFullyFetched ?? false;
  }, [data]);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToTop = () => {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const onScroll = () => {
      const container = scrollContainerRef.current;
      const isLoadingMore = isFetching && page > 1;

      if (!container || isFullyFetched || isFetching || isLoadingMore) return;

      const scrolledToBottom =
        container.scrollHeight - container.scrollTop <=
        container.clientHeight + 100;

      if (scrolledToBottom) {
        setPage((prevPage) => prevPage + 1);
      }
    };

    const container = scrollContainerRef.current;
    container?.addEventListener('scroll', onScroll);

    return () => {
      container?.removeEventListener('scroll', onScroll);
    };
  }, [isFetching, isFullyFetched, page]);

  const updateDate = (nextDate: Date) => {
    setDate(nextDate);
    setPage(1);
    scrollToTop();
  };

  const handlePrevMonth = () => {
    const newDate = moment(date).add(-1, 'months');

    updateDate(moment(newDate).toDate());
  };

  const handleNextMonth = () => {
    const newDate = moment(date).add(1, 'months');

    updateDate(moment(newDate).toDate());
  };

  const handleTypeChange = (nextType: ListProps) => {
    setSelectedTypeId(nextType._id);
    setPage(1);
    scrollToTop();
  };

  const handleAddTransactionButton = () => {
    setIsDrawerOpen(true);
  };

  const handleTransactionSuccess = async () => {
    scrollToTop();

    if (page !== 1) {
      setPage(1);
      return;
    }

    await refetch();
  };

  const isLoadingMore = isFetching && page > 1;
  const isLoading = isApiLoading || (isFetching && page === 1);

  if (isLoading) return <Loader />;

  return (
    <>
      <div className="flex flex-row items-center justify-center gap-1 sm:gap-4">
        <Button variant="ghost" size="icon" onClick={handlePrevMonth}>
          <ChevronLeftIcon className="size-4" />
        </Button>

        <DatePicker date={date} onChange={updateDate}>
          <Button variant="ghost" className="px-1">
            <TypographyCardTitle className="hover:bg-background hover:underline">
              {moment(date).format('MMM yyyy')}
            </TypographyCardTitle>
          </Button>
        </DatePicker>

        <Button variant="ghost" size="icon" onClick={handleNextMonth}>
          <ChevronRightIcon className="size-4" />
        </Button>
      </div>

      <div className="space-y-2">
        <div className="flex flex-row justify-end">
          <SelectBox
            variant="ghost"
            items={newTypes}
            selectedItem={selectedType}
            setSelectedItem={handleTypeChange}
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
                <TypographyMuted>
                  {t('Common.label.noMoreData')}
                </TypographyMuted>
              </div>
            )}

            {!isApiLoading && transactions.length === 0 && (
              <div className="text-center">
                <TypographyMuted>{t('Common.label.noData')}</TypographyMuted>
              </div>
            )}

            {error && (
              <div className="text-center">
                <TypographyLabel className="text-destructive-foreground">
                  {t('Common.label.errorLoadingData')}
                </TypographyLabel>
              </div>
            )}
          </div>
        </ScrollShadow>
      </div>

      {/* FLOATING ACTION BUTTON */}
      <Button
        size="icon"
        className="fixed right-4 bottom-4 z-50 size-12 cursor-pointer shadow-lg sm:right-8 sm:bottom-8"
        onClick={handleAddTransactionButton}
      >
        <PlusIcon className="size-6" />
      </Button>

      {/* TRANSACTION DRAWER */}
      <TransactionDrawer
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
        defaultDate={date}
        defaultType={selectedType}
        onSuccess={handleTransactionSuccess}
      />
    </>
  );
};

export default Transactions;
