'use client';

import { useEffect, useMemo, useState } from 'react';
import moment from 'moment';
import { useTranslations } from 'next-intl';
import { useAppDispatch, useAppSelector } from '../../lib/hooks/use-redux';
import {
  setDashboardCurrency,
  setDashboardDate,
} from '../../lib/redux/feature/dashboard/dashboardSlice';
import { useGetDashboardDataQuery } from '../../lib/redux/services/dashboard';

import { ScrollShadow, CircularProgress } from '@heroui/react';
import { Button } from '../../components/ui/button';
import { Skeleton } from '../../components/ui/skeleton';
import { Card } from '../../components/ui/card';
import { DatePicker } from '../../components/shared/DatePicker';
import { Separator } from '../../components/ui/separator';

import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

import CategoryCard from '../../app/dashboard/Category/CategoryCard';
import CategoryDrawer from '../../app/dashboard/Category/CategoryDrawer';
import TransactionDrawer from '../../app/dashboard/Transaction/TransactionDrawer';

import { formatCurrency } from '@shared/utilities/formatCurrency';
import { dateStringFormat } from '@shared/constants/dateStringFormat';

import type { DashboardDataCategoryResult } from '../../types/Dashboard';

const initialTransactionPaymentCategory = {
  _id: '',
  name: '',
  totalAmount: 0,
  totalPaidAmount: 0,
  paymentCompletionRate: 0,
  transactions: [],
};

const Dashboard = () => {
  const t = useTranslations('Page.dashboard');
  const dispatch = useAppDispatch();

  const { currencies } = useAppSelector((state) => state.main);
  const { currency } = useAppSelector((state) => state.dashboard);
  const dashboardDateString = useAppSelector((state) => state.dashboard.date);

  const dashboardDate = useMemo(
    () => moment(dashboardDateString, dateStringFormat).toDate(),
    [dashboardDateString],
  );

  const [dashboardCategoryData, setDashboardCategoryData] =
    useState<DashboardDataCategoryResult>(initialTransactionPaymentCategory);
  const [date, setDate] = useState(dashboardDate);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { data, isFetching, isLoading } = useGetDashboardDataQuery({
    date: dashboardDate,
    currency: currency.name,
  });

  const { dashboardCategories, balance, extra, totalAmount, totalPaidAmount } =
    useMemo(() => {
      return {
        dashboardCategories: data?.categories || [],
        balance: data?.main?.balance ?? 0,
        extra: data?.main?.extra ?? 0,
        totalAmount: data?.main?.totalAmount ?? 0,
        totalPaidAmount: data?.main?.totalPaidAmount ?? 0,
      };
    }, [data]);

  useEffect(() => {
    if (currencies.length > 0) {
      const dashboardCurrency = currencies.filter(
        (thisCurrency) => thisCurrency.name === currency.name,
      );

      dispatch(
        setDashboardCurrency({
          currency: dashboardCurrency[0],
        }),
      );
    }
  }, [currencies, currency]);

  useEffect(() => {
    handleDateSelection(date);
  }, [date]);

  const handleDateSelection = (date: Date) => {
    dispatch(
      setDashboardDate({
        date: moment(date).format(dateStringFormat),
      }),
    );
  };

  const handleCardClick = (category: DashboardDataCategoryResult) => {
    setDashboardCategoryData(category);
    setIsDialogOpen(true);
  };

  const handleAddTransactionButton = () => {
    setIsDrawerOpen(true);
  };

  const handlePrevMonth = () => {
    const newDate = moment(dashboardDate).add(-1, 'months');

    setDate(moment(newDate).toDate());
  };

  const handleNextMonth = () => {
    const newDate = moment(dashboardDate).add(1, 'months');

    setDate(moment(newDate).toDate());
  };

  if (isLoading)
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center">
        <CircularProgress aria-label="Loading..." size="lg" />
      </div>
    );

  return (
    <div className="space-y-4 sm:space-y-8">
      {/* CALENDAR */}
      <div className="flex flex-row items-center justify-center gap-1 sm:gap-4">
        <Button variant="ghost" size="rounded-icon" onClick={handlePrevMonth}>
          <ChevronLeftIcon className="size-4" />
        </Button>

        <DatePicker date={date} onChange={setDate}>
          <Button variant="ghost" className="px-1">
            <p className="hover:bg-background text-3xl font-extrabold hover:underline sm:text-5xl sm:font-black">
              {moment(date).format('MMM yyyy')}
            </p>
          </Button>
        </DatePicker>

        <Button variant="ghost" size="rounded-icon" onClick={handleNextMonth}>
          <ChevronRightIcon className="size-4" />
        </Button>
      </div>

      {/* PROGRESS BAR */}
      {isFetching ? (
        <div className="flex flex-col items-center space-y-2">
          <Skeleton className="aspect-square h-36 rounded-full sm:h-64" />
          <Skeleton className="h-4 w-20" />
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <CircularProgress
            classNames={{
              svg: 'w-36 sm:w-64 h-36 sm:h-64 drop-shadow-md',
              value: 'text-3xl sm:text-6xl font-semibold',
              indicator: 'stroke-primary',
            }}
            label={t('completed')}
            value={(totalPaidAmount / totalAmount) * 100 || 0}
            strokeWidth={3}
            showValueLabel={true}
          />
        </div>
      )}

      {/* BALANCE CARD */}
      <Card className="flex flex-col gap-2 p-4">
        <div className="flex flex-row items-center justify-between">
          <p className="text-xl font-bold sm:text-3xl sm:font-black">
            {t('balance')}
          </p>

          {isFetching ? (
            <Skeleton className="h-6 w-20" />
          ) : (
            <p className="text-xl font-bold sm:text-3xl sm:font-black">
              {formatCurrency({
                value: balance,
                currency: currency.name,
              })}
            </p>
          )}
        </div>

        <div className="flex flex-row items-center justify-between">
          <p className="text-base font-medium sm:text-lg sm:font-semibold">
            {t('extra')}
          </p>

          {isFetching ? (
            <Skeleton className="h-4 w-20" />
          ) : (
            <p className="text-base font-medium sm:text-lg sm:font-semibold">
              {formatCurrency({
                value: extra,
                currency: currency.name,
              })}
            </p>
          )}
        </div>

        <Separator />

        <div className="space-y-1">
          <div className="flex flex-row items-center justify-end space-x-2">
            <p className="text-sm font-normal sm:text-base sm:font-medium">
              {t('settled')}:
            </p>

            {isFetching ? (
              <Skeleton className="h-5 w-16" />
            ) : (
              <p className="text-sm font-semibold sm:text-base sm:font-bold">
                {formatCurrency({
                  value: totalPaidAmount,
                  currency: currency.name,
                })}
              </p>
            )}
          </div>

          <div className="flex flex-row items-center justify-end space-x-2">
            <p className="text-sm font-normal sm:text-base sm:font-medium">
              {t('unsettled')}:
            </p>

            {isFetching ? (
              <Skeleton className="h-5 w-16" />
            ) : (
              <p className="text-sm font-semibold sm:text-base sm:font-bold">
                {formatCurrency({
                  value: totalAmount - totalPaidAmount,
                  currency: currency.name,
                })}
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* CATEGORY CARD */}
      <ScrollShadow className="max-h-[40vh] sm:max-h-[90vh]" hideScrollBar>
        <div className="grid grid-cols-2 items-start justify-center gap-5 sm:grid-cols-3 sm:gap-10">
          {dashboardCategories.map((category: DashboardDataCategoryResult) => (
            <div key={category._id}>
              <CategoryCard
                category={category}
                currency={currency.name}
                handleCardClick={handleCardClick}
              />
            </div>
          ))}
        </div>
      </ScrollShadow>

      {/* TRANSACTION BUTTON */}
      <Button className="my-4 w-full" onClick={handleAddTransactionButton}>
        {t('transactionButton')}
      </Button>

      {/* HIDDEN DRAWERS */}
      <CategoryDrawer
        category={dashboardCategoryData}
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
      />

      <TransactionDrawer
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
      />
    </div>
  );
};

export default Dashboard;
