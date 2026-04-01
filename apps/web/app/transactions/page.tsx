'use client';

import { Button, ProgressCircle, ScrollShadow } from '@heroui/react';
import { dateStringFormat } from '@shared/constants/dateStringFormat';
import { Label } from '@web/components/shared/Typography';
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon } from 'lucide-react';
import moment from 'moment';
import { useTranslations } from 'next-intl';
import {
  type SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { DatePicker } from '../../components/shared/DatePicker';
import Loader from '../../components/shared/Loader';
import { SelectBox } from '../../components/shared/SelectBox';
import { useAppSelector } from '../../lib/hooks/use-redux';
import { useGetTransactionsQuery } from '../../lib/redux/services/transactions';
import type { ListProps } from '../../types/List';
import type { TransactionProps } from '../../types/Transaction';
import TransactionDrawer from '../dashboard/Transaction/TransactionDrawer';
import TransactionCard from './Transaction/TransactionCard';

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

  const selectedType = newTypes.find((type) => type._id === selectedTypeId) ??
    newTypes[0] ?? { _id: '', name: '' };

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
    skip: !selectedType._id || !date || !userId || types.length === 0,
  });

  const transactions: TransactionProps[] = useMemo(() => {
    return data?.data ?? [];
  }, [data]);

  const isFullyFetched = useMemo(() => {
    return data?.isFullyFetched ?? false;
  }, [data]);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isLoadingMore = isFetching && page > 1;
  const isLoading = isApiLoading || (isFetching && page === 1);

  const resetScrollPosition = () => {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectedTypeChange = (value: SetStateAction<ListProps>) => {
    const nextType = typeof value === 'function' ? value(selectedType) : value;

    setSelectedTypeId(nextType._id);
    setPage(1);
    resetScrollPosition();
  };

  const handleDateChange = (nextDate: Date) => {
    setDate(nextDate);
    setPage(1);
    resetScrollPosition();
  };

  useEffect(() => {
    const onScroll = () => {
      const container = scrollContainerRef.current;
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
  }, [isFetching, isFullyFetched, isLoadingMore]);

  const handlePrevMonth = () => {
    const newDate = moment(date).add(-1, 'months');

    handleDateChange(moment(newDate).toDate());
  };

  const handleNextMonth = () => {
    const newDate = moment(date).add(1, 'months');

    handleDateChange(moment(newDate).toDate());
  };

  const handleAddTransactionButton = () => {
    setIsDrawerOpen(true);
  };

  const handleTransactionSuccess = async () => {
    setPage(1);
    resetScrollPosition();
    await refetch();
  };

  if (isLoading) return <Loader />;

  return (
    <>
      <div className="flex flex-row items-center justify-center gap-1 sm:gap-4">
        <Button variant="ghost" onClick={handlePrevMonth} isIconOnly>
          <ChevronLeftIcon className="size-4" />
        </Button>

        <DatePicker date={date} onChange={handleDateChange}>
          <Button variant="ghost" className="px-1">
            <Label
              variant="title-xl"
              className="hover:bg-background hover:underline"
            >
              {moment(date).format('MMM yyyy')}
            </Label>
          </Button>
        </DatePicker>

        <Button variant="ghost" onClick={handleNextMonth} isIconOnly>
          <ChevronRightIcon className="size-4" />
        </Button>
      </div>

      <div className="space-y-2">
        <div className="flex flex-row justify-end">
          <SelectBox
            variant="secondary"
            items={newTypes}
            selectedItem={selectedType}
            setSelectedItem={handleSelectedTypeChange}
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
                <ProgressCircle size="sm" aria-label="Loading more..." />
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

      {/* FLOATING ACTION BUTTON */}
      <Button
        className="fixed right-4 bottom-4 z-50 size-12 cursor-pointer shadow-lg sm:right-8 sm:bottom-8"
        onClick={handleAddTransactionButton}
        isIconOnly
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
