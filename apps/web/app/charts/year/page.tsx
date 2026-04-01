'use client';

import { Button, Card, Key, ListBox, Select } from '@heroui/react';
import { dateStringFormat } from '@shared/constants/dateStringFormat';
import { formatCurrency } from '@shared/utilities/formatCurrency';
import { Label } from '@web/components/shared/Typography';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  TrendingDownIcon,
  TrendingUpIcon,
} from 'lucide-react';
import moment from 'moment';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  XAxis,
  YAxis,
} from 'recharts';

import Loader from '../../../components/shared/Loader';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '../../../components/ui/chart';
import { useIsMobile } from '../../../lib/hooks/use-mobile';
import { useAppSelector } from '../../../lib/hooks/use-redux';
import {
  useGetTransactionPaymentsByCategoryQuery,
  useGetTransactionsByTypeDateRangeQuery,
} from '../../../lib/redux/services/dashboard';

type ChartDataPropsA = {
  date: string;
  expense: number;
  income: number;
};

type ChartDataPropsB = {
  date: string;
  incomeVsExpenses: number;
};

type SavingsDataProps = { month: string; yearMonth: string; amount: number };

const generateYearsArray = (range: number): number[] => {
  const currentYear = new Date().getFullYear();
  const startYear = currentYear - range;
  const endYear = currentYear + range;

  return Array.from(
    { length: endYear - startYear + 1 },
    (_, index) => startYear + index,
  );
};

const Charts = () => {
  const t = useTranslations();
  const isMobile = useIsMobile();

  const { user } = useAppSelector((state) => state.auth);
  const userId = user?.id || '';
  const dashboardDateString = useAppSelector((state) => state.dashboard.date);

  const dashboardDate = useMemo(
    () => moment(dashboardDateString, dateStringFormat).toDate(),
    [dashboardDateString],
  );

  const [selectedYear, setSelectedYear] = useState<Key | null>(
    dashboardDate.getFullYear().toString(),
  );

  const { currency } = useAppSelector((state) => state.dashboard);
  const selectedYearValue = String(selectedYear ?? '');

  const { data: transactionsData, isFetching: isTransactionsDataFetching } =
    useGetTransactionsByTypeDateRangeQuery(
      {
        startDate: moment(selectedYearValue, 'YYYY').startOf('year').toDate(),
        endDate: moment(selectedYearValue, 'YYYY').endOf('year').toDate(),
        currency: currency.name,
        userId,
      },
      {
        skip: !userId || !currency.name,
      },
    );

  const { data: savingsData, isFetching: isSavingsDataFetching } =
    useGetTransactionPaymentsByCategoryQuery(
      {
        startDate: moment(selectedYearValue, 'YYYY').startOf('year').toDate(),
        endDate: moment(selectedYearValue, 'YYYY').endOf('year').toDate(),
        currency: currency.name,
        userId,
        category: 'savings',
      },
      {
        skip: !userId || !currency.name,
      },
    );

  const chartDataA = useMemo<ChartDataPropsA[]>(() => {
    return (transactionsData ?? []).map((transaction) => {
      const month = moment(transaction.date).format('MMM');
      const year = moment(transaction.date).format('YYYY');

      return {
        ...transaction,
        month,
        year,
      };
    });
  }, [transactionsData]);

  const chartDataB = useMemo<ChartDataPropsB[]>(() => {
    return chartDataA.map((data) => ({
      ...data,
      incomeVsExpenses: (data.income || 0) - (data.expense || 0),
    }));
  }, [chartDataA]);

  const savingsChartData = useMemo<SavingsDataProps[]>(() => {
    return (savingsData ?? [])
      .filter(
        (transaction) =>
          moment(transaction.date).utc().year().toString() ===
          selectedYearValue,
      )
      .map((transaction) => {
        const yearMonth = moment(transaction.date).utc().format('YYYYMM');
        const month = moment(transaction.date).utc().format('MMM');
        const amount = transaction.paidAmount;

        return {
          yearMonth,
          month,
          amount,
        };
      });
  }, [savingsData, selectedYearValue]);

  const yearsArray = generateYearsArray(10);

  const handlePrevYear = () => {
    const newDate = moment(selectedYearValue).add(-1, 'years');

    setSelectedYear(moment(newDate).format('YYYY'));
  };

  const handleNextMonth = () => {
    const newDate = moment(selectedYearValue).add(1, 'years');

    setSelectedYear(moment(newDate).format('YYYY'));
  };

  const isLoading = isTransactionsDataFetching || isSavingsDataFetching;

  const chartConfig = {
    income: {
      label: t('Common.type.income'),
      color: 'var(--primary)',
      icon: TrendingUpIcon,
    },
    expense: {
      label: t('Common.type.expense'),
      color: 'var(--secondary)',
      icon: TrendingDownIcon,
    },
    incomeVsExpenses: {
      label: t('Page.charts.yearly.incomeVsExpensesTitle'),
      color: 'var(--primary)',
      icon: TrendingUpIcon,
    },
    savings: {
      label: t('Common.category.savings'),
      color: 'var(--accent)',
      icon: TrendingUpIcon,
    },
  } satisfies ChartConfig;

  const savingsChartConfig = {
    amount: {
      label: 'Amount',
      color: 'var(--chart-1)',
    },
  } satisfies ChartConfig;

  if (isLoading || !currency.name) return <Loader />;

  return (
    <>
      <div className="flex flex-row items-center justify-center">
        <Button variant="ghost" onClick={handlePrevYear} isIconOnly>
          <ChevronLeftIcon className="size-4" />
        </Button>

        <Select
          value={selectedYear}
          defaultValue={selectedYear}
          onChange={(value) => {
            setSelectedYear(value);
          }}
        >
          <Select.Trigger className="w-fit text-2xl font-bold">
            <Select.Value />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover>
            <ListBox>
              {yearsArray.map((year) => (
                <ListBox.Item key={year} id={year} textValue={year.toString()}>
                  {year}
                  <ListBox.ItemIndicator />
                </ListBox.Item>
              ))}
            </ListBox>
          </Select.Popover>
        </Select>

        <Button variant="ghost" onClick={handleNextMonth} isIconOnly>
          <ChevronRightIcon className="size-4" />
        </Button>
      </div>

      {/* CHART A */}
      <Card>
        <Card.Header className="flex flex-row items-center justify-center">
          <Card.Title>
            {t('Page.charts.yearly.incomeVsExpensesTitle')}
          </Card.Title>
        </Card.Header>
        <Card.Content className="p-1">
          <ChartContainer config={chartConfig}>
            <BarChart data={chartDataB}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                // tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
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
              <Bar
                dataKey="incomeVsExpenses"
                fill="var(--chart-1)"
                radius={2}
              />
              {/* <ReferenceLine y={0} stroke="var(--primary)" /> */}
              <ReferenceLine y={0} stroke="#808080" />
            </BarChart>
          </ChartContainer>
        </Card.Content>
      </Card>

      {/* CHART B */}
      <Card>
        <Card.Header className="flex flex-row items-center justify-center">
          <Card.Title>
            {t('Page.charts.yearly.incomeAndExpensesTitle')}
          </Card.Title>
        </Card.Header>
        <Card.Content className="p-1">
          <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer data={chartDataA}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                // tickLine={false}
                // axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
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
                content={<ChartTooltipContent hideIndicator />}
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="income" fill="var(--chart-1)" radius={2} />
              <Bar dataKey="expense" fill="var(--chart-2)" radius={2} />
            </BarChart>
          </ChartContainer>
        </Card.Content>
      </Card>

      {/* CHART C - Savings */}
      <Card>
        <Card.Header className="flex flex-row items-center justify-center">
          <Card.Title>{t('Page.charts.yearly.savingsTitle')}</Card.Title>
        </Card.Header>
        <Card.Content className="p-1">
          {savingsChartData?.length ? (
            <ChartContainer config={savingsChartConfig}>
              <BarChart accessibilityLayer data={savingsChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" type="category" />
                {!isMobile && <YAxis dataKey="amount" type="number" />}
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
                <Bar dataKey="amount" fill="var(--chart-1)" />
              </BarChart>
            </ChartContainer>
          ) : (
            <div className="flex items-center justify-center">
              <Label variant="subtitle-md">{t('Common.label.noData')}</Label>
            </div>
          )}
        </Card.Content>
      </Card>
    </>
  );
};

export default Charts;
