'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import moment from 'moment';
import { TrendingUpIcon } from 'lucide-react';

import { CircularProgress } from '@heroui/react';
import { Button } from '../components/ui/button';
import CardDialog from '../components/shared/CardDialog';
import { Separator } from '../components/ui/separator';
import { Label } from '../components/ui/label';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ReferenceLine,
  XAxis,
  YAxis,
} from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '../components/ui/chart';

import { useToast } from '../lib/hooks/use-toast';
import {
  useGetDashboardDataQuery,
  useGetTransactionsByTypeDateRangeQuery,
  useGetTransactionPaymentsByCategoryQuery,
} from '../lib/redux/services/dashboard';
import { useAppSelector } from '../lib/hooks/use-redux';
import { useIsMobile } from '../lib/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  const { toast } = useToast();
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

  const { data: dashboardData } = useGetDashboardDataQuery({
    date,
    currency: currency.name,
  });

  const { data: upcomingDashboardData } = useGetDashboardDataQuery({
    date: moment(date).add(1, 'months'),
    currency: currency.name,
  });

  const { data: transactionsByTypeData } =
    useGetTransactionsByTypeDateRangeQuery({
      startDate: moment(date).add(1, 'months').toDate(),
      endDate: moment(date).add(3, 'months').toDate(),
      currency: currency.name,
    });

  const { data: transactionPaymentsByCategoryData } =
    useGetTransactionPaymentsByCategoryQuery({
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
        toast({
          variant: 'destructive',
          title: 'USING MOCKED DATA',
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
            const extra = transaction.income - transaction.expense;

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

  return (
    <div className="space-y-6 py-4 sm:space-y-8">
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

        <CardDialog title="Previous Savings">
          {transactionPaymentsByCategoryData?.length ? (
            <ChartContainer config={previousSavingsChartConfig}>
              <BarChart
                accessibilityLayer
                data={previousSavings}
                layout="vertical"
                margin={{
                  // top: 5,
                  // left: -30,
                  right: 40,
                }}
              >
                <CartesianGrid horizontal={false} />
                <YAxis dataKey="month" type="category" hide />
                <XAxis dataKey="amount" type="number" hide />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      formatter={(value) => {
                        return (
                          <span className="flex flex-col justify-between">
                            <p
                              className={`${parseFloat(value.toString()) < 0 && 'text-destructive'} 'font-semibold'`}
                            >
                              {formatCurrency({
                                value: parseFloat(value.toString()),
                                currency: currency.name,
                              })}
                            </p>
                          </span>
                        );
                      }}
                    />
                  }
                />
                <Bar dataKey="amount" layout="vertical" fill="var(--primary)">
                  <LabelList
                    dataKey="month"
                    position="insideLeft"
                    className="fill-primary-foreground tracking-tighter"
                  />
                  <LabelList
                    dataKey="amount"
                    position="right"
                    className="fill-foreground"
                    fontSize={9}
                    formatter={(value: number) =>
                      formatCurrency({ value, currency: currency.name })
                    }
                  />
                </Bar>
              </BarChart>
            </ChartContainer>
          ) : (
            <Label variant="subtitle">No data available</Label>
          )}
        </CardDialog>

        <CardDialog title={t('Page.home.cards.upcomingExtra.title')}>
          <ChartContainer config={upcomingExtraChartConfig}>
            <BarChart
              data={upcomingExtras}
              margin={{
                top: 10,
                bottom: 10,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="yearMonth"
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
                hide
              />
              {!isMobile && (
                <YAxis
                  axisLine={false}
                  tickFormatter={(value) =>
                    formatCurrency({ value, currency: currency.name })
                  }
                />
              )}
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    hideIndicator
                    formatter={(value) => {
                      return formatCurrency({
                        value: parseFloat(value.toString()),
                        currency: currency.name,
                      });
                    }}
                  />
                }
              />
              <Bar dataKey="extra" fill="var(--primary)" radius={1}>
                <LabelList position="top" dataKey="month" fillOpacity={1} />
                {upcomingExtras.map((item) => (
                  <Cell key={item.month} />
                ))}
              </Bar>
              <ReferenceLine y={0} stroke="var(--muted-foreground)" />
            </BarChart>
          </ChartContainer>
        </CardDialog>

        <CardDialog
          title={t('Page.home.cards.upcomingExtra.title')}
          isExpandable
        >
          <div className="text-end">
            <Label
              variant="title_lg"
              className={`${upcomingDashboardData?.main?.extra < 0 && 'text-destructive'}`}
            >
              {formatCurrency({
                value: upcomingDashboardData?.main?.extra || 0,
                currency: currency.name,
              })}
            </Label>
          </div>
        </CardDialog>
      </div>

      <Separator />

      <div>
        <CardDialog title={t('Page.home.motivation.title')} isExpandable>
          <Label
            variant="subtitle"
            className={`italic transition-opacity duration-500 ${
              fade ? 'opacity-0' : 'opacity-100'
            }`}
          >
            {`"${quotes[currentQuoteIndex]}"`}
          </Label>
        </CardDialog>
      </div>

      <Button className="my-4 w-full" onClick={() => router.push('/dashboard')}>
        {t('Page.home.dashboardButton')}
      </Button>
    </div>
  );
};

export default Home;
