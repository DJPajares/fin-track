'use client';

import { CircularProgress, ScrollShadow } from '@heroui/react';
import { dateStringFormat } from '@shared/constants/dateStringFormat';
import { formatCurrency } from '@shared/utilities/formatCurrency';
import { DatePicker } from '@web/components/shared/DatePicker';
import Loader from '@web/components/shared/Loader';
import {
  TypographyCaption,
  TypographyLabel,
  TypographyLead,
} from '@web/components/shared/Typography';
import { Button } from '@web/components/ui/button';
import { Card, CardContent } from '@web/components/ui/card';
import { Separator } from '@web/components/ui/separator';
import { Skeleton } from '@web/components/ui/skeleton';
import { useAppDispatch, useAppSelector } from '@web/lib/hooks/use-redux';
import { setDashboardDate } from '@web/lib/redux/feature/dashboard/dashboardSlice';
import { useGetDashboardDataQuery } from '@web/lib/redux/services/dashboard';
import type { DashboardDataCategoryResult } from '@web/types/Dashboard';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import moment from 'moment';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';

import CategoryCard from './Category/CategoryCard';
import CategoryDrawer from './Category/CategoryDrawer';
import TransactionDrawer from './Transaction/TransactionDrawer';

const initialTransactionPaymentCategory = {
  _id: '',
  id: '',
  name: '',
  totalAmount: 0,
  totalPaidAmount: 0,
  paymentCompletionRate: 0,
  transactions: [],
};

const Dashboard = () => {
  const t = useTranslations('Page.dashboard');
  const dispatch = useAppDispatch();

  const { currency, date: dashboardDateString } = useAppSelector(
    (state) => state.dashboard,
  );
  const { user } = useAppSelector((state) => state.auth);
  const userId = user?.id || '';

  const dashboardDate = useMemo(
    () => moment(dashboardDateString, dateStringFormat).toDate(),
    [dashboardDateString],
  );

  const [dashboardCategoryData, setDashboardCategoryData] =
    useState<DashboardDataCategoryResult>(initialTransactionPaymentCategory);
  const [date, setDate] = useState(dashboardDate);
  const [isCategoryDrawerOpen, setIsCategoryDrawerOpen] = useState(false);
  const [isTransactionDrawerOpen, setIsTransactionDrawerOpen] = useState(false);

  const { data, isFetching, isLoading } = useGetDashboardDataQuery(
    {
      date: dashboardDate,
      currency: currency.label,
      userId,
    },
    {
      skip: !currency.label || !userId,
    },
  );

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
    dispatch(
      setDashboardDate({
        date: moment(date).format(dateStringFormat),
      }),
    );
  }, [date, dispatch]);

  const handleCardClick = (category: DashboardDataCategoryResult) => {
    setDashboardCategoryData(category);
    setIsCategoryDrawerOpen(true);
  };

  const handleAddTransactionButton = () => {
    setIsTransactionDrawerOpen(true);
  };

  const handlePrevMonth = () => {
    const newDate = moment(dashboardDate).add(-1, 'months');

    setDate(moment(newDate).toDate());
  };

  const handleNextMonth = () => {
    const newDate = moment(dashboardDate).add(1, 'months');

    setDate(moment(newDate).toDate());
  };

  if (isLoading || !currency.label) return <Loader />;

  return (
    <>
      <>
        <ScrollShadow
          className="flex max-h-[calc(100dvh-theme(height.36))] flex-col gap-4 sm:max-h-none sm:gap-8"
          hideScrollBar
        >
          {/* CALENDAR */}
          <div className="flex flex-row items-center justify-center gap-1 sm:gap-4">
            <Button variant="ghost" size="icon-sm" onClick={handlePrevMonth}>
              <ChevronLeftIcon className="size-4" />
            </Button>

            <DatePicker date={date} onChange={setDate}>
              <Button variant="ghost" className="px-1">
                <TypographyLead className="hover:bg-background hover:underline">
                  {moment(date).format('MMM yyyy')}
                </TypographyLead>
              </Button>
            </DatePicker>

            <Button variant="ghost" size="icon-sm" onClick={handleNextMonth}>
              <ChevronRightIcon className="size-4" />
            </Button>
          </div>

          {/* CIRCULAR PROGRESS BAR */}
          {isFetching ? (
            <div className="flex flex-col items-center space-y-2">
              <Skeleton className="aspect-square h-36 rounded-full sm:h-64" />
              <Skeleton className="h-4 w-20" />
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <CircularProgress
                classNames={{
                  svg: 'size-36 sm:size-64 drop-shadow-md',
                  value: 'text-3xl sm:text-6xl font-semibold',
                  indicator: 'stroke-primary',
                }}
                label={t('completed')}
                value={Math.floor((totalPaidAmount / totalAmount) * 100) || 0}
                strokeWidth={3}
                showValueLabel={true}
              />
            </div>
          )}

          {/* BALANCE CARD */}
          {isFetching ? (
            <Skeleton className="h-40 w-full" />
          ) : (
            <Card>
              <CardContent className="flex flex-col gap-2">
                {/* Primary Metrics - Balance & Extra */}
                <div className="flex flex-row justify-between">
                  <div>
                    <TypographyCaption>{t('totalDue')}</TypographyCaption>
                    <TypographyLabel>
                      {formatCurrency({
                        value: totalAmount,
                        currency: currency.label,
                      })}
                    </TypographyLabel>
                  </div>

                  <div className="flex flex-col items-end">
                    <TypographyCaption>{t('monthlyExtra')}</TypographyCaption>
                    <TypographyLabel>
                      {formatCurrency({
                        value: extra,
                        currency: currency.label,
                      })}
                    </TypographyLabel>
                  </div>
                </div>

                <Separator />

                {/* Secondary Metrics - Total Due, Settled & Unsettled */}
                <div className="flex flex-row justify-between">
                  <div>
                    <div className="flex flex-row items-end gap-2">
                      <TypographyCaption>{t('settled')}:</TypographyCaption>
                      <TypographyLabel>
                        {formatCurrency({
                          value: totalPaidAmount,
                          currency: currency.label,
                        })}
                      </TypographyLabel>
                    </div>

                    <div className="flex flex-row items-end gap-2">
                      <TypographyCaption>{t('unsettled')}:</TypographyCaption>
                      <TypographyLabel>
                        {formatCurrency({
                          value: totalAmount - totalPaidAmount,
                          currency: currency.label,
                        })}
                      </TypographyLabel>
                    </div>
                  </div>

                  <div className="flex flex-col items-end">
                    <TypographyCaption>{t('runningBalance')}</TypographyCaption>
                    <TypographyLabel>
                      {formatCurrency({
                        value: balance,
                        currency: currency.label,
                      })}
                    </TypographyLabel>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* CATEGORY CARD */}
          <ScrollShadow className="max-h-[40vh] sm:max-h-[90vh]" hideScrollBar>
            {isFetching ? (
              <div className="grid grid-cols-2 items-start justify-center gap-4 sm:grid-cols-3 sm:gap-8">
                <Skeleton className="h-44 w-full sm:h-56" />
                <Skeleton className="h-44 w-full sm:h-56" />
              </div>
            ) : (
              <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] items-start justify-center gap-4 sm:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] sm:gap-8">
                {dashboardCategories.map(
                  (category: DashboardDataCategoryResult) => (
                    <div key={category._id}>
                      <CategoryCard
                        category={category}
                        currency={currency.label}
                        handleCardClick={handleCardClick}
                      />
                    </div>
                  ),
                )}
              </div>
            )}
          </ScrollShadow>
        </ScrollShadow>

        {/* TRANSACTION BUTTON */}
        <div className="sticky right-0 bottom-0 left-0 mt-auto sm:relative">
          {isFetching ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <Button
              size="lg"
              className="w-full"
              onClick={handleAddTransactionButton}
            >
              {t('transactionButton')}
            </Button>
          )}
        </div>
      </>

      {/* HIDDEN DRAWERS */}
      <CategoryDrawer
        key={`${dashboardCategoryData._id || 'empty'}-${isCategoryDrawerOpen ? 'open' : 'closed'}`}
        category={dashboardCategoryData}
        isDrawerOpen={isCategoryDrawerOpen}
        setIsDrawerOpen={setIsCategoryDrawerOpen}
      />

      <TransactionDrawer
        isDrawerOpen={isTransactionDrawerOpen}
        setIsDrawerOpen={setIsTransactionDrawerOpen}
      />
    </>
  );
};

export default Dashboard;
