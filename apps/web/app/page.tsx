'use client';

import { ScrollShadow } from '@heroui/react';
import moment from 'moment';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';

import AmountSettledCard from '../components/shared/HomeCard/AmountSettledCard';
import BalanceCard from '../components/shared/HomeCard/BalanceCard';
import BudgetHealthCard from '../components/shared/HomeCard/BudgetHealthCard';
import ExpenseBreakdownCard from '../components/shared/HomeCard/ExpenseBreakdownCard';
import ExtrasCard from '../components/shared/HomeCard/ExtrasCard';
import SavingsCard from '../components/shared/HomeCard/SavingsCard';
import TopSpendingCard from '../components/shared/HomeCard/TopSpendingCard';
import TrendsCard from '../components/shared/HomeCard/TrendsCard';
import UnpaidBillsCard from '../components/shared/HomeCard/UnpaidBillsCard';
import Loader from '../components/shared/Loader';
import { Button } from '../components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { useAppSelector } from '../lib/hooks/use-redux';
import {
  useGetDashboardDataQuery,
  useGetTransactionPaymentsByCategoryQuery,
  useGetTransactionsByTypeDateRangeQuery,
} from '../lib/redux/services/dashboard';
import type {
  ExpensePieDataProps,
  PreviousSavingsProps,
  TrendDataProps,
  UpcomingExtraProps,
} from '../types/HomeCard';
import type { TransactionPaymentCategoryProps } from '../types/TransactionPayment';

// Force dynamic rendering to avoid prerendering issues
export const dynamic = 'force-dynamic';

const Home = () => {
  const router = useRouter();
  const t = useTranslations();

  const quotes = t.raw('Page.home.motivation.quotes') as string[]; // Access raw array

  const { user } = useAppSelector((state) => state.auth);
  const userId = user?.id || '';
  const { currency } = useAppSelector((state) => state.dashboard);

  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(() =>
    Math.floor(Math.random() * quotes.length),
  );
  const [fade, setFade] = useState(false);
  const [upcomingExtras, setUpcomingExtras] = useState<UpcomingExtraProps[]>(
    [],
  );
  const [previousSavings, setPreviousSavings] = useState<
    PreviousSavingsProps[]
  >([]);
  const [trendsData, setTrendsData] = useState<TrendDataProps[]>([]);

  const date = new Date();

  const { data: dashboardData, isFetching: isDashboardDataFetching } =
    useGetDashboardDataQuery(
      {
        date,
        currency: currency.name,
        userId,
      },
      {
        skip: !userId || !currency.name,
      },
    );

  const {
    data: transactionsByTypeData,
    isFetching: isTransactionsByTypeDataFetching,
  } = useGetTransactionsByTypeDateRangeQuery(
    {
      startDate: moment(date).add(1, 'months').toDate(),
      endDate: moment(date).add(3, 'months').toDate(),
      currency: currency.name,
      userId,
    },
    {
      skip: !userId || !currency.name,
    },
  );

  const {
    data: transactionPaymentsByCategoryData,
    isFetching: isTransactionPaymentsByCategoryDataFetching,
  } = useGetTransactionPaymentsByCategoryQuery(
    {
      startDate: moment(date).subtract(2, 'months').toDate(),
      endDate: date,
      currency: currency.name,
      userId,
      category: 'savings',
    },
    {
      skip: !userId || !currency.name,
    },
  );

  const { data: incomeTrendsData, isFetching: isIncomeTrendsDataFetching } =
    useGetTransactionsByTypeDateRangeQuery(
      {
        startDate: moment(date).subtract(5, 'months').toDate(),
        endDate: date,
        currency: currency.name,
        userId,
      },
      {
        skip: !userId || !currency.name,
      },
    );

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(true); // Trigger fade-out

      // Wait for fade-out before updating content
      setTimeout(() => {
        setCurrentQuoteIndex((prevIndex) => {
          let newIndex;
          do {
            newIndex = Math.floor(Math.random() * quotes.length);
          } while (newIndex === prevIndex && quotes.length > 1);
          return newIndex;
        });
        setFade(false); // Trigger fade-in
      }, 500); // Match the animation duration
    }, 8000);

    return () => clearInterval(interval); // Cleanup interval on unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setUpcomingExtras(
      transactionsByTypeData
        ? transactionsByTypeData.map((transaction) => {
            const yearMonth = moment(transaction.date).format('MMM YYYY');
            const month = moment(transaction.date).format('MMM');
            const extra =
              (transaction.income || 0) - (transaction.expense || 0);

            return {
              month,
              yearMonth,
              extra,
            };
          })
        : [],
    );
  }, [transactionsByTypeData]);

  useEffect(() => {
    setPreviousSavings(
      transactionPaymentsByCategoryData
        ? transactionPaymentsByCategoryData.map((transaction) => {
            const yearMonth = moment(transaction.date).format('MMM YYYY');
            const month = moment(transaction.date).format('MMM');
            const amount = transaction.paidAmount;

            return {
              month,
              yearMonth,
              amount,
            };
          })
        : [],
    );
  }, [transactionPaymentsByCategoryData]);

  useEffect(() => {
    setTrendsData(
      incomeTrendsData
        ? incomeTrendsData.map((transaction) => {
            const yearMonth = moment(transaction.date).format('MMM YYYY');
            const month = moment(transaction.date).format('MMM');

            return {
              month,
              yearMonth,
              income: transaction.income || 0,
              expense: transaction.expense || 0,
            };
          })
        : [],
    );
  }, [incomeTrendsData]);

  // Calculate accumulative extra per month
  const accumulativeExtra =
    upcomingExtras.length > 0
      ? upcomingExtras.reduce((sum, item) => sum + item.extra, 0)
      : 0;

  // Calculate accumulative savings per month
  const accumulativeSavings =
    previousSavings.length > 0
      ? previousSavings.reduce((sum, item) => sum + item.amount, 0)
      : 0;

  // Unpaid categories — sorted by lowest completion rate
  const unpaidCategories = useMemo((): TransactionPaymentCategoryProps[] => {
    if (!dashboardData?.categories) return [];
    return (dashboardData.categories as TransactionPaymentCategoryProps[])
      .filter(
        (cat: TransactionPaymentCategoryProps) => cat.paymentCompletionRate < 1,
      )
      .sort(
        (
          a: TransactionPaymentCategoryProps,
          b: TransactionPaymentCategoryProps,
        ) => a.paymentCompletionRate - b.paymentCompletionRate,
      )
      .slice(0, 5);
  }, [dashboardData?.categories]);

  // Top spending categories — sorted by highest totalAmount
  const topSpendingCategories =
    useMemo((): TransactionPaymentCategoryProps[] => {
      if (!dashboardData?.categories) return [];
      return [
        ...(dashboardData.categories as TransactionPaymentCategoryProps[]),
      ]
        .sort(
          (
            a: TransactionPaymentCategoryProps,
            b: TransactionPaymentCategoryProps,
          ) => b.totalAmount - a.totalAmount,
        )
        .slice(0, 5);
    }, [dashboardData?.categories]);

  // Expense pie chart data — from categories
  const expensePieData = useMemo((): ExpensePieDataProps[] => {
    if (!dashboardData?.categories) return [];
    return (dashboardData.categories as TransactionPaymentCategoryProps[])
      .filter((cat: TransactionPaymentCategoryProps) => cat.totalAmount > 0)
      .map((cat: TransactionPaymentCategoryProps) => ({
        id: cat.id,
        name: cat.name,
        amount: cat.totalAmount,
      }));
  }, [dashboardData?.categories]);

  const isLoading =
    isDashboardDataFetching ||
    isTransactionsByTypeDataFetching ||
    isTransactionPaymentsByCategoryDataFetching ||
    isIncomeTrendsDataFetching ||
    !currency.name;

  if (isLoading) return <Loader />;

  return (
    <>
      <ScrollShadow
        aria-label={t('Page.home.ariaLabel')}
        className="flex max-h-[calc(100dvh-theme(height.36))] flex-col gap-4 sm:max-h-none sm:gap-8"
        hideScrollBar
      >
        {/* Finance Overview Cards */}
        <div className="grid auto-rows-fr grid-cols-2 gap-5 sm:grid-cols-3 sm:gap-10">
          <AmountSettledCard
            totalPaidAmount={dashboardData?.main?.totalPaidAmount ?? 0}
            totalAmount={dashboardData?.main?.totalAmount ?? 0}
            paymentCompletionRate={
              dashboardData?.main?.paymentCompletionRate ?? 0
            }
            currency={currency.name}
          />

          <SavingsCard
            accumulativeSavings={accumulativeSavings}
            previousSavings={previousSavings}
            currency={currency.name}
          />

          <ExtrasCard
            accumulativeExtra={accumulativeExtra}
            upcomingExtras={upcomingExtras}
            currency={currency.name}
          />

          <TrendsCard trendsData={trendsData} currency={currency.name} />

          <BalanceCard
            balance={dashboardData?.main?.balance ?? 0}
            currency={currency.name}
          />

          <UnpaidBillsCard unpaidCategories={unpaidCategories} />

          <TopSpendingCard
            topSpendingCategories={topSpendingCategories}
            currency={currency.name}
          />

          <ExpenseBreakdownCard
            expensePieData={expensePieData}
            currency={currency.name}
          />

          <BudgetHealthCard
            budget={dashboardData?.main?.budget ?? 0}
            totalAmount={dashboardData?.main?.totalAmount ?? 0}
            currency={currency.name}
          />
        </div>

        <Separator />

        <Card className="relative flex flex-col">
          <CardHeader className="gap-4 px-4">
            <CardDescription>{t('Page.home.motivation.title')}</CardDescription>
            <CardTitle
              className={`font-normal italic transition-opacity duration-500 ${
                fade ? 'opacity-0' : 'opacity-100'
              }`}
            >
              {`"${quotes[currentQuoteIndex]}"`}
            </CardTitle>
          </CardHeader>
        </Card>
      </ScrollShadow>

      <div className="sticky right-0 bottom-0 left-0 mt-auto sm:relative">
        <Button
          size="lg"
          className="w-full"
          onClick={() => router.push('/dashboard')}
        >
          {t('Page.home.dashboardButton')}
        </Button>
      </div>
    </>
  );
};

export default Home;
