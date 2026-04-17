'use client';

import { dateStringFormat } from '@shared/constants/dateStringFormat';
import { formatCurrency } from '@shared/utilities/formatCurrency';
import Loader from '@web/components/shared/Loader';
import { TypographyLead } from '@web/components/shared/Typography';
import { Button } from '@web/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@web/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@web/components/ui/chart';
import { Progress, ProgressLabel } from '@web/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@web/components/ui/select';
import { useIsMobile } from '@web/lib/hooks/use-mobile';
import { useAppSelector } from '@web/lib/hooks/use-redux';
import {
  useGetTransactionPaymentsByCategoryQuery,
  useGetTransactionsByTypeDateRangeQuery,
} from '@web/lib/redux/services/dashboard';
import { useGetTransactionsMonthlyCategoriesByDateRangeQuery } from '@web/lib/redux/services/transactions';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  TrendingDownIcon,
  TrendingUpIcon,
} from 'lucide-react';
import moment from 'moment';
import { useTranslations } from 'next-intl';
import { type CSSProperties, useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  XAxis,
  YAxis,
} from 'recharts';

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

  const [selectedYear, setSelectedYear] = useState<string>(
    dashboardDate.getFullYear().toString(),
  );

  const { currency } = useAppSelector((state) => state.dashboard);

  const { data: transactionsData, isFetching: isTransactionsDataFetching } =
    useGetTransactionsByTypeDateRangeQuery(
      {
        startDate: moment(selectedYear, 'YYYY').startOf('year').toDate(),
        endDate: moment(selectedYear, 'YYYY').endOf('year').toDate(),
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
        startDate: moment(selectedYear, 'YYYY').startOf('year').toDate(),
        endDate: moment(selectedYear, 'YYYY').endOf('year').toDate(),
        currency: currency.name,
        userId,
        category: 'savings',
      },
      {
        skip: !userId || !currency.name,
      },
    );

  const {
    data: monthlyCategoriesData,
    isFetching: isMonthlyCategoriesDataFetching,
  } = useGetTransactionsMonthlyCategoriesByDateRangeQuery(
    {
      startDate: moment(selectedYear, 'YYYY').startOf('year').toDate(),
      endDate: moment(selectedYear, 'YYYY').endOf('year').toDate(),
      currency: currency.name,
      userId,
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
          moment(transaction.date).utc().year().toString() === selectedYear,
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
  }, [savingsData, selectedYear]);

  type YearlyTopCategory = { name: string; amount: number; colorIdx: number };

  const yearlyTop5 = useMemo<YearlyTopCategory[]>(() => {
    const totals: Record<string, number> = {};

    (monthlyCategoriesData ?? []).forEach((row) => {
      Object.entries(row).forEach(([key, val]) => {
        if (key === 'date') return;
        const num = typeof val === 'number' ? val : Number(val);
        if (!Number.isNaN(num)) {
          totals[key] = (totals[key] ?? 0) + num;
        }
      });
    });

    return Object.entries(totals)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, amount], idx) => ({ name, amount, colorIdx: idx + 1 }));
  }, [monthlyCategoriesData]);

  const yearsArray = generateYearsArray(10);

  const handlePrevYear = () => {
    const newDate = moment(selectedYear).add(-1, 'years');

    setSelectedYear(moment(newDate).format('YYYY'));
  };

  const handleNextMonth = () => {
    const newDate = moment(selectedYear).add(1, 'years');

    setSelectedYear(moment(newDate).format('YYYY'));
  };

  const isLoading =
    isTransactionsDataFetching ||
    isSavingsDataFetching ||
    isMonthlyCategoriesDataFetching;

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
        <Button variant="ghost" size="icon" onClick={handlePrevYear}>
          <ChevronLeftIcon className="size-4" />
        </Button>

        <Select
          value={selectedYear}
          onValueChange={(value) => {
            if (value) {
              setSelectedYear(value);
            }
          }}
        >
          <SelectTrigger className="text-2xl font-bold">
            <SelectValue placeholder="Year..." />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>
                {yearsArray.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectLabel>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Button variant="ghost" size="icon" onClick={handleNextMonth}>
          <ChevronRightIcon className="size-4" />
        </Button>
      </div>

      {/* CHART A */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-center">
          <CardTitle>{t('Page.charts.yearly.incomeVsExpensesTitle')}</CardTitle>
        </CardHeader>
        <CardContent className="p-1">
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
                      const amount =
                        typeof value === 'number' ? value : Number(value ?? 0);

                      return formatCurrency({
                        value: amount,
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
        </CardContent>
      </Card>

      {/* CHART B */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-center">
          <CardTitle>
            {t('Page.charts.yearly.incomeAndExpensesTitle')}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-1">
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
              <Bar dataKey="income" fill="var(--chart-1)" />
              <Bar dataKey="expense" fill="var(--chart-2)" />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* CHART C - Savings */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-center">
          <CardTitle>{t('Page.charts.yearly.savingsTitle')}</CardTitle>
        </CardHeader>
        <CardContent className="p-1">
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
                        const amount =
                          typeof value === 'number'
                            ? value
                            : Number(value ?? 0);

                        return formatCurrency({
                          value: amount,
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
              <TypographyLead>{t('Common.label.noData')}</TypographyLead>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Top 5 Categories */}
      {yearlyTop5.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t('Page.charts.yearly.topCategoriesTitle')}</CardTitle>
            <CardDescription>
              {t('Page.charts.yearly.topCategoriesDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="flex flex-col gap-3">
              {yearlyTop5.map((item, index) => {
                const maxAmount = yearlyTop5[0]?.amount ?? 0;
                const pct = maxAmount > 0 ? (item.amount / maxAmount) * 100 : 0;
                const isTranslated = t.has(`Common.category.${item.name}`);
                const label = isTranslated
                  ? t(`Common.category.${item.name}`)
                  : item.name;
                const amountLabel = formatCurrency({
                  value: item.amount,
                  currency: currency.name,
                });
                const percentageLabel = `${Math.round(pct)}%`;

                return (
                  <li key={item.name}>
                    <Progress
                      value={pct}
                      style={
                        {
                          '--progress-color': `var(--chart-${item.colorIdx})`,
                        } as CSSProperties
                      }
                      className="border-border/50 bg-background/80 **:data-[slot=progress-track]:bg-muted w-full rounded-2xl border p-4 shadow-sm **:data-[slot=progress-indicator]:bg-(--progress-color) **:data-[slot=progress-track]:h-2.5"
                    >
                      <div className="flex w-full items-start justify-between gap-3 sm:items-center">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="bg-muted text-muted-foreground flex size-9 shrink-0 items-center justify-center rounded-full border text-xs font-semibold shadow-sm">
                            {index + 1}
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span
                                className="inline-flex size-2.5 shrink-0 rounded-full"
                                style={{
                                  backgroundColor: `var(--chart-${item.colorIdx})`,
                                }}
                              />
                              <ProgressLabel className="block truncate text-sm font-semibold sm:text-base">
                                {label}
                              </ProgressLabel>
                            </div>
                          </div>
                        </div>

                        <div className="shrink-0 text-right">
                          <span className="block text-base font-semibold tabular-nums">
                            {amountLabel}
                          </span>
                          <span className="text-muted-foreground text-xs">
                            {percentageLabel}
                          </span>
                        </div>
                      </div>
                    </Progress>
                  </li>
                );
              })}
            </ol>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default Charts;
