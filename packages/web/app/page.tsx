'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import moment from 'moment';
import { toast } from 'sonner';

import { TrendingUpIcon } from 'lucide-react';

import { CircularProgress } from '@heroui/react';
import { Button } from '../components/ui/button';
import CardDialog from '../components/shared/CardDialog';
import { Separator } from '../components/ui/separator';
import { Area, AreaChart } from 'recharts';
import { ChartConfig, ChartContainer } from '../components/ui/chart';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@web/components/ui/card';

import {
  useGetDashboardDataQuery,
  useGetTransactionsByTypeDateRangeQuery,
  useGetTransactionPaymentsByCategoryQuery,
} from '../lib/redux/services/dashboard';
import { useAppSelector } from '../lib/hooks/use-redux';

import { formatCurrency } from '@shared/utilities/formatCurrency';

const isMockedData = process.env.NEXT_PUBLIC_USE_MOCKED_DATA === 'true';

type UpcomingExtraProps = {
  month: string;
  yearMonth: string;
  extra: number;
};

type PreviousSavingsProps = {
  month: string;
  yearMonth: string;
  amount: number;
};

const Home = () => {
  const router = useRouter();
  const t = useTranslations();

  const quotes = t.raw('Page.home.motivation.quotes') as string[]; // Access raw array

  const { currency } = useAppSelector((state) => state.dashboard);

  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [fade, setFade] = useState(false);
  const [upcomingExtras, setUpcomingExtras] = useState<UpcomingExtraProps[]>(
    [],
  );
  const [previousSavings, setPreviousSavings] = useState<
    PreviousSavingsProps[]
  >([]);

  const date = new Date();

  const { data: dashboardData, isFetching: isDashboardDataFetching } =
    useGetDashboardDataQuery({
      date,
      currency: currency.name,
    });

  const {
    data: transactionsByTypeData,
    isFetching: isTransactionsByTypeDataFetching,
  } = useGetTransactionsByTypeDateRangeQuery({
    startDate: moment(date).add(1, 'months').toDate(),
    endDate: moment(date).add(3, 'months').toDate(),
    currency: currency.name,
  });

  const {
    data: transactionPaymentsByCategoryData,
    isFetching: isTransactionPaymentsByCategoryDataFetching,
  } = useGetTransactionPaymentsByCategoryQuery({
    startDate: moment(date).subtract(2, 'months').toDate(),
    endDate: date,
    currency: currency.name,
    category: 'savings',
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(true); // Trigger fade-out

      // Wait for fade-out before updating content
      setTimeout(() => {
        setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
        setFade(false); // Trigger fade-in
      }, 500); // Match the animation duration
    }, 8000);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  useEffect(() => {
    if (isMockedData) {
      const timeout = setTimeout(() => {
        toast('USING MOCKED DATA', {
          description:
            "API calls won't work. Adding, modifying, or deleting data within the app will either crash or not work at all.",
        });
      }, 0);

      return () => clearTimeout(timeout);
    }
  }, [toast]);

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

  const upcomingExtraChartConfig = {
    extra: {
      label: 'Extra',
      color: 'var(--chart-1)',
      icon: TrendingUpIcon,
    },
  } satisfies ChartConfig;

  const previousSavingsChartConfig = {
    amount: {
      label: 'Amount',
      color: 'var(--chart-1)',
    },
  } satisfies ChartConfig;

  // Calculate average extra per month
  const averageExtra =
    upcomingExtras.length > 0
      ? upcomingExtras.reduce((sum, item) => sum + item.extra, 0) /
        upcomingExtras.length
      : 0;

  // Calculate average savings per month
  const averageSavings =
    previousSavings.length > 0
      ? previousSavings.reduce((sum, item) => sum + item.amount, 0) /
        previousSavings.length
      : 0;

  return (
    <div className="space-y-6 py-4 sm:space-y-8">
      {isDashboardDataFetching ||
      isTransactionsByTypeDataFetching ||
      isTransactionPaymentsByCategoryDataFetching ? (
        <div className="flex flex-col items-center space-y-2">
          <CircularProgress size="lg" aria-label="Loading more..." />
        </div>
      ) : (
        <>
          <div className="grid auto-rows-fr grid-cols-2 gap-5 sm:grid-cols-3 sm:gap-10">
            <CardDialog
              className="flex flex-col items-center justify-center"
              isExpandable
            >
              <CircularProgress
                classNames={{
                  svg: 'w-24 h-24 drop-shadow-md',
                  value: 'text-2xl font-semibold',
                  indicator: 'stroke-primary',
                  label: 'text-center font-extralight tracking-wider',
                }}
                label={t('Page.home.cards.progress.title')}
                value={dashboardData?.main?.paymentCompletionRate * 100 || 0}
                strokeWidth={3}
                showValueLabel={true}
              />
            </CardDialog>

            <Card className="relative flex flex-col pb-0">
              <CardHeader className="px-4">
                <CardDescription>
                  {t('Page.home.cards.previousSavings.title')}
                </CardDescription>
                <CardTitle className="text-2xl">
                  {formatCurrency({
                    value: averageSavings,
                    currency: currency.name,
                  })}
                </CardTitle>
                <CardDescription className="text-xs">
                  {t('Page.home.cards.averageSavings.title')}
                </CardDescription>
              </CardHeader>
              <CardContent className="relative mt-auto flex-1 p-0">
                <ChartContainer
                  config={previousSavingsChartConfig}
                  className="relative size-full"
                >
                  <AreaChart
                    data={previousSavings}
                    margin={{
                      left: 0,
                      right: 0,
                    }}
                    className="size-fit"
                  >
                    <Area
                      dataKey="amount"
                      fill="var(--primary)"
                      fillOpacity={0.1}
                      stroke="var(--primary)"
                      strokeWidth={2}
                      type="monotone"
                      baseValue="dataMin"
                    />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="relative flex flex-col pb-0">
              <CardHeader className="px-4">
                <CardDescription>
                  {t('Page.home.cards.upcomingExtra.title')}
                </CardDescription>
                <CardTitle className="text-2xl">
                  {formatCurrency({
                    value: averageExtra,
                    currency: currency.name,
                  })}
                </CardTitle>
                <CardDescription className="text-xs">
                  {t('Page.home.cards.averageExtra.title')}
                </CardDescription>
              </CardHeader>
              <CardContent className="relative mt-auto flex-1 p-0">
                <ChartContainer
                  config={upcomingExtraChartConfig}
                  className="relative size-full"
                >
                  <AreaChart
                    data={upcomingExtras}
                    margin={{
                      left: 0,
                      right: 0,
                    }}
                    className="size-fit"
                  >
                    <Area
                      dataKey="extra"
                      fill="var(--primary)"
                      fillOpacity={0.1}
                      stroke="var(--primary)"
                      strokeWidth={2}
                      type="monotone"
                      baseValue="dataMin"
                    />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          <Separator />

          <Card className="relative flex flex-col">
            <CardHeader className="gap-4 px-4">
              <CardDescription>
                {t('Page.home.motivation.title')}
              </CardDescription>
              <CardTitle
                className={`font-normal italic transition-opacity duration-500 ${
                  fade ? 'opacity-0' : 'opacity-100'
                }`}
              >
                {`"${quotes[currentQuoteIndex]}"`}
              </CardTitle>
            </CardHeader>
          </Card>
        </>
      )}

      <Button className="my-4 w-full" onClick={() => router.push('/dashboard')}>
        {t('Page.home.dashboardButton')}
      </Button>
    </div>
  );
};

export default Home;
