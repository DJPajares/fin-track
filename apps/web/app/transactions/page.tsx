'use client';

import { dateStringFormat } from '@shared/constants/dateStringFormat';
import type { ListProps } from '@shared/types/List';
import TransactionDrawer from '@web/app/dashboard/Transaction/TransactionDrawer';
import { DatePicker } from '@web/components/shared/DatePicker';
import Loader from '@web/components/shared/Loader';
import { ScrollShadow } from '@web/components/shared/ScrollShadow';
import { SelectBox } from '@web/components/shared/SelectBox';
import {
  TypographyCardTitle,
  TypographyLabel,
  TypographyMuted,
} from '@web/components/shared/Typography';
import { Button } from '@web/components/ui/button';
import { useAppSelector } from '@web/lib/hooks/use-redux';
import { useGetTransactionsQuery } from '@web/lib/redux/services/transactions';
import type { TransactionProps } from '@web/types/Transaction';
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon } from 'lucide-react';
import moment from 'moment';
import { useTranslations } from 'next-intl';
import { useMemo, useRef, useState } from 'react';

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
      body: {
        date: date.toISOString(),
        type: selectedType._id,
        userId,
      },
    }),
    [date, selectedType._id, userId],
  );

  const { data, isFetching, error, refetch } = useGetTransactionsQuery(
    queryParams,
    {
      skip: !selectedType._id || !userId || types.length === 0,
    },
  );

  const transactions: TransactionProps[] = useMemo(() => {
    return data?.data ?? [];
  }, [data]);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToTop = () => {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateDate = (nextDate: Date) => {
    setDate(nextDate);
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
    scrollToTop();
  };

  const handleAddTransactionButton = () => {
    setIsDrawerOpen(true);
  };

  const handleTransactionSuccess = async () => {
    scrollToTop();
    await refetch();
  };

  if (isFetching) return <Loader />;

  return (
    <>
      <div className="flex flex-row items-center justify-center gap-1 sm:gap-4">
        <Button variant="ghost" size="icon" onClick={handlePrevMonth}>
          <ChevronLeftIcon className="size-4" />
        </Button>

        <DatePicker date={date} onChange={updateDate}>
          <Button variant="ghost">
            <TypographyCardTitle>
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
          className="h-[70vh] overflow-y-auto p-2"
          hideScrollBar
        >
          <div className="flex flex-col gap-4">
            {transactions.length > 0 &&
              transactions.map((transaction) => (
                <TransactionCard
                  key={transaction._id}
                  date={date}
                  transaction={transaction}
                />
              ))}

            {!isFetching && transactions.length === 0 && (
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
        size="icon-lg"
        className="fixed right-4 bottom-4 z-50 cursor-pointer rounded-full shadow-lg sm:right-8 sm:bottom-8"
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
