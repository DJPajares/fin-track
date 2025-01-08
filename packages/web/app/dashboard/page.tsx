'use client';

import { useEffect, useMemo, useState } from 'react';
import moment from 'moment';
import { useTranslations } from 'next-intl';
import { useAppDispatch, useAppSelector } from '../../lib/hooks/use-redux';
import {
  setDashboardCurrency,
  setDashboardDate
} from '../../lib/redux/feature/dashboard/dashboardSlice';

import { ScrollShadow, CircularProgress } from '@nextui-org/react';
// import { CircularProgress } from '@nextui-org/react';
// import { ScrollShadow } from '../../components/ui/scroll-shadow';
import { Button } from '../../components/ui/button';
import { Skeleton } from '../../components/ui/skeleton';
import { Card } from '../../components/ui/card';
import { DatePicker } from '../../components/shared/DatePicker';
import { Separator } from '../../components/ui/separator';

import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

// import CategoryDialog from '../../app/dashboard/Category/CategoryDialog';
import CategoryCard from '../../app/dashboard/Category/CategoryCard';
import CategoryDrawer from '../../app/dashboard/Category/CategoryDrawer';
import TransactionDrawer from '../../app/dashboard/Transaction/TransactionDrawer';

import fetchTransactionPayments from '../../services/fetchTransactionPayments';
import { formatCurrency } from '@shared/utilities/formatCurrency';
import { dateStringFormat } from '@shared/constants/dateStringFormat';

import type {
  DashboardSelectionItemsProps,
  DashboardDataProps,
  DashboardDataCategoryResult,
  DashboardDataResult
} from '../../types/Dashboard';

const initialDashboardData = {
  main: {
    currency: '',
    budget: 0,
    totalAmount: 0,
    totalPaidAmount: 0,
    balance: 0,
    extra: 0,
    paymentCompletionRate: 0
  },
  categories: []
};

const initialTransactionPaymentCategory = {
  _id: '',
  name: '',
  totalAmount: 0,
  totalPaidAmount: 0,
  paymentCompletionRate: 0,
  transactions: []
};

const Dashboard = () => {
  const t = useTranslations('Page.dashboard');
  const dispatch = useAppDispatch();

  const { currencies } = useAppSelector((state) => state.main);
  const { currency } = useAppSelector((state) => state.dashboard);
  const dashboardDateString = useAppSelector((state) => state.dashboard.date);

  const dashboardDate = useMemo(
    () => moment(dashboardDateString, dateStringFormat).toDate(),
    [dashboardDateString]
  );

  const [dashboardData, setDashboardData] =
    useState<DashboardDataResult>(initialDashboardData);
  const [dashboardCategoryData, setDashboardCategoryData] =
    useState<DashboardDataCategoryResult>(initialTransactionPaymentCategory);
  const [date, setDate] = useState(dashboardDate);
  const [isCurrencyPopoverOpen, setIsCurrencyPopoverOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isTransactionDrawerOpen, setIsTransactionDrawerOpen] = useState(false);

  const {
    dashbardCategories,
    hasDashboardMainData,
    balance,
    extra,
    totalAmount,
    totalPaidAmount
  } = useMemo(() => {
    return {
      dashbardCategories: dashboardData.categories,
      hasDashboardMainData: Object.keys(dashboardData.main).length > 0,
      balance: dashboardData.main.balance,
      extra: dashboardData.main.extra,
      totalAmount: dashboardData.main.totalAmount,
      totalPaidAmount: dashboardData.main.totalPaidAmount
    };
  }, [dashboardData]);

  useEffect(() => {
    if (currencies.length > 0) {
      const dashboardCurrency = currencies.filter(
        (thisCurrency) => thisCurrency.name === currency.name
      );

      dispatch(
        setDashboardCurrency({
          currency: dashboardCurrency[0]
        })
      );
    }
  }, [currencies, currency]);

  useEffect(() => {
    const hasCurrency = Object.keys(currency).length > 0;

    if (dashboardDate && hasCurrency) {
      fetchDashboardData({ date: dashboardDate, currency: currency.name });
    }
  }, [dashboardDate, currency]);

  useEffect(() => {
    handleDateSelection(date);
  }, [date]);

  const fetchDashboardData = async ({ date, currency }: DashboardDataProps) => {
    const data = await fetchTransactionPayments({
      date,
      currency
    });

    setDashboardData(data);
  };

  const handleDateSelection = (date: Date) => {
    dispatch(
      setDashboardDate({
        date: moment(date).format(dateStringFormat)
      })
    );
  };

  const handleCurrencySelection = ({
    selectedCurrency
  }: {
    selectedCurrency: DashboardSelectionItemsProps;
  }) => {
    // store in redux state
    dispatch(
      setDashboardCurrency({
        currency: selectedCurrency
      })
    );

    setIsCurrencyPopoverOpen(false);
  };

  const handleCardClick = (category: DashboardDataCategoryResult) => {
    setDashboardCategoryData(category);
    setIsDialogOpen(true);
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

  return (
    <div className="space-y-4 sm:space-y-8">
      {/* CALENDAR */}
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

      {/* PROGRESS BAR */}
      <div className="flex flex-col items-center">
        {hasDashboardMainData ? (
          <CircularProgress
            classNames={{
              svg: 'w-36 sm:w-64 h-36 sm:h-64 drop-shadow-md',
              value: 'text-3xl sm:text-6xl font-semibold',
              indicator: 'stroke-primary'
            }}
            label={t('completed')}
            value={(totalPaidAmount / totalAmount) * 100 || 0}
            strokeWidth={3}
            showValueLabel={true}
          />
        ) : (
          <Skeleton className="h-36 w-36 rounded-full" />
        )}
      </div>

      {/* BALANCE CARD */}
      <Card className="p-4 space-y-2">
        <div className="flex flex-row items-center justify-between">
          <p className="text-xl sm:text-3xl font-bold sm:font-black">
            {t('balance')}
          </p>

          {hasDashboardMainData ? (
            <p className="text-xl sm:text-3xl font-bold sm:font-black">
              {formatCurrency({
                value: balance,
                currency: currency.name
              })}
            </p>
          ) : (
            <Skeleton className="h-6 w-20" />
          )}
        </div>

        <div className="flex flex-row items-center justify-between">
          <p className="text-base sm:text-lg font-medium sm:font-semibold">
            {t('extra')}
          </p>

          {hasDashboardMainData ? (
            <p className="text-base sm:text-lg font-medium sm:font-semibold">
              {formatCurrency({
                value: extra,
                currency: currency.name
              })}
            </p>
          ) : (
            <Skeleton className="h-4 w-20" />
          )}
        </div>

        <Separator />

        <div className="space-y-1">
          <div className="flex flex-row items-center justify-end space-x-2">
            {hasDashboardMainData ? (
              <>
                <p className="text-sm sm:text-base font-normal sm:font-medium">
                  {t('settled')}:
                </p>

                <p className="text-sm sm:text-base font-semibold sm:font-bold">
                  {formatCurrency({
                    value: totalPaidAmount,
                    currency: currency.name
                  })}
                </p>
              </>
            ) : (
              <Skeleton className="h-4 w-32" />
            )}
          </div>

          <div className="flex flex-row items-center justify-end space-x-2">
            {hasDashboardMainData ? (
              <>
                <p className="text-sm sm:text-base font-normal sm:font-medium">
                  {t('unsettled')}:
                </p>

                <p className="text-sm sm:text-base font-semibold sm:font-bold">
                  {formatCurrency({
                    value: totalAmount - totalPaidAmount,
                    currency: currency.name
                  })}
                </p>
              </>
            ) : (
              <Skeleton className="h-4 w-40" />
            )}
          </div>
        </div>
      </Card>

      {/* CATEGORY CARD */}
      <ScrollShadow className="max-h-[40vh] sm:max-h-[90vh]" hideScrollBar>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 sm:gap-10 items-start justify-center">
          {dashbardCategories.map((category: DashboardDataCategoryResult) => (
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
      <Button className="w-full my-4" onClick={handleAddTransactionButton}>
        {t('transactionButton')}
      </Button>

      {/* HIDDEN DRAWERS */}
      <CategoryDrawer
        category={dashboardCategoryData}
        setDashboardData={setDashboardData}
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
      />

      {/* <CategoryDialog
        category={dashboardCategoryData}
        setDashboardData={setDashboardData}
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
      /> */}

      <TransactionDrawer
        currencies={currencies}
        setDashboardData={setDashboardData}
        isTransactionDrawerOpen={isTransactionDrawerOpen}
        setIsTransactionDrawerOpen={setIsTransactionDrawerOpen}
      />
    </div>
  );
};

export default Dashboard;
