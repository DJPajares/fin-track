'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import moment from 'moment';

import { CircularProgress } from '@heroui/react';
import { Button } from '../components/ui/button';
import CardDialog from '../components/shared/CardDialog';
import { Separator } from '../components/ui/separator';
import { Label } from '../components/ui/label';
import { CartesianGrid, LabelList, Line, LineChart, XAxis } from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '../components/ui/chart';
import { TrendingUpIcon } from 'lucide-react';

import { useToast } from '../lib/hooks/use-toast';
import {
  useGetDashboardDataQuery,
  useGetTransactionsByTypeDateRangeQuery,
} from '../lib/redux/services/dashboard';
import { useAppSelector } from '../lib/hooks/use-redux';

import { formatCurrency } from '@shared/utilities/formatCurrency';

const isMockedData = process.env.NEXT_PUBLIC_USE_MOCKED_DATA === 'true';

type UpcomingExtraProps = {
  month: string;
  yearMonth: string;
  extra: number;
};

const Home = () => {
  const router = useRouter();
  const { toast } = useToast();
  const t = useTranslations();

  const quotes = t.raw('Page.home.motivation.quotes') as string[]; // Access raw array

  const { currency } = useAppSelector((state) => state.dashboard);

  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [fade, setFade] = useState(false);
  const [upcomingExtras, setUpcomingExtras] = useState<UpcomingExtraProps[]>(
    [],
  );

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
            const extra = transaction.income - transaction.expense;

            return {
              month: transaction.month,
              yearMonth,
              extra,
            };
          })
        : [],
    );
  }, [transactionsByTypeData]);

  const chartConfig = {
    extra: {
      label: 'Extra',
      color: 'hsl(var(--chart-1))',
      icon: TrendingUpIcon,
    },
  } satisfies ChartConfig;

  return (
    <div className="space-y-6 py-4 sm:space-y-8">
      <div className="grid grid-cols-2 items-start justify-center gap-5 sm:grid-cols-3 sm:gap-10">
        <CardDialog isExpandable>
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

      <div className="grid grid-cols-2 items-start justify-center gap-5 sm:grid-cols-3 sm:gap-10">
        <CardDialog title={t('Page.home.cards.upcomingExtra.title')}>
          <ChartContainer config={chartConfig}>
            <LineChart
              accessibilityLayer
              data={upcomingExtras}
              margin={{
                left: 20,
                right: 20,
                top: 10,
                bottom: 5,
              }}
            >
              <CartesianGrid vertical={true} />
              <XAxis
                dataKey="yearMonth"
                tickLine={false}
                axisLine={false}
                hide
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Line
                dataKey="extra"
                type="natural"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                dot={{
                  fill: 'hsl(var(--primary))',
                }}
                activeDot={{
                  r: 6,
                }}
              >
                <LabelList
                  position="top"
                  offset={12}
                  formatter={(value: number) =>
                    formatCurrency({ value, currency: currency.name })
                  }
                  fontSize={9}
                />
              </Line>
            </LineChart>
          </ChartContainer>
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
