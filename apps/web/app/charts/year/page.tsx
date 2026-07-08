'use client';

import { dateStringFormat } from '@shared/constants/dateStringFormat';
import { formatCurrency } from '@shared/utilities/formatCurrency';
import { serializeText } from '@shared/utilities/serializeText';
import Loader from '@web/components/shared/Loader';
import {
  TypographyLead,
  TypographyPageTitle,
} from '@web/components/shared/Typography';
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
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from '@web/components/ui/dropdown-menu';
import { Progress, ProgressLabel } from '@web/components/ui/progress';
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
import { type CSSProperties, useEffect, useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Line,
  XAxis,
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

type SavingsDataProps = {
  month: string;
  yearMonth: string;
  amount: number;
  paidAmount?: number;
};
type YearlyTopCategory = { name: string; amount: number; colorIdx: number };

const generateYearsArray = (range: number): number[] => {
  const currentYear = new Date().getFullYear();
  const startYear = currentYear - range;
  const endYear = currentYear + range;

  return Array.from(
    { length: endYear - startYear + 1 },
    (_, index) => startYear + index,
  );
};

const buildYearlyTop5 = (
  rows: Array<Record<string, number | string>> | undefined,
): YearlyTopCategory[] => {
  const totals: Record<string, number> = {};

  (rows ?? []).forEach((row) => {
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
};

const formatFallbackLabel = (value: string) => {
  return value
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const Charts = () => {
  const t = useTranslations();

  const { user } = useAppSelector((state) => state.auth);
  const userId = user?.id || '';
  const { types } = useAppSelector((state) => state.main);
  const dashboardDateString = useAppSelector((state) => state.dashboard.date);

  const dashboardDate = useMemo(
    () => moment(dashboardDateString, dateStringFormat).toDate(),
    [dashboardDateString],
  );

  const [selectedYear, setSelectedYear] = useState<string>(
    dashboardDate.getFullYear().toString(),
  );
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);

  useEffect(() => {
    if (!isYearDropdownOpen) return;

    const frameId = requestAnimationFrame(() => {
      const selectedYearItem = document.querySelector<HTMLElement>(
        `[data-year-dropdown="true"] [data-year-item="${selectedYear}"]`,
      );

      selectedYearItem?.scrollIntoView({ block: 'center' });
    });

    return () => cancelAnimationFrame(frameId);
  }, [isYearDropdownOpen, selectedYear]);

  const { currency } = useAppSelector((state) => state.dashboard);

  const isCurrentSelectedYear = selectedYear === moment().format('YYYY');
  const incomeTopEndDate = isCurrentSelectedYear
    ? new Date()
    : moment(selectedYear, 'YYYY').endOf('year').toDate();

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

  const expenseTypeId = useMemo(() => {
    return types.find((type) => type.id === 'expense')?._id ?? '';
  }, [types]);

  const incomeTypeId = useMemo(() => {
    return types.find((type) => type.id === 'income')?._id ?? '';
  }, [types]);

  const {
    data: expenseCategoriesData,
    isFetching: isExpenseCategoriesFetching,
  } = useGetTransactionsMonthlyCategoriesByDateRangeQuery(
    {
      startDate: moment(selectedYear, 'YYYY').startOf('year').toDate(),
      endDate: moment(selectedYear, 'YYYY').endOf('year').toDate(),
      currency: currency.name,
      type: expenseTypeId,
      aggregateBy: 'paidAmount',
      userId,
    },
    {
      skip: !userId || !currency.name || !expenseTypeId,
    },
  );

  const { data: incomeCategoriesData, isFetching: isIncomeCategoriesFetching } =
    useGetTransactionsMonthlyCategoriesByDateRangeQuery(
      {
        startDate: moment(selectedYear, 'YYYY').startOf('year').toDate(),
        endDate: incomeTopEndDate,
        currency: currency.name,
        type: incomeTypeId,
        userId,
      },
      {
        skip: !userId || !currency.name || !incomeTypeId,
      },
    );

  const { data: savingsGoalData, isFetching: isSavingsGoalDataFetching } =
    useGetTransactionsMonthlyCategoriesByDateRangeQuery(
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

  const chartDataB = useMemo<ChartDataPropsA[]>(() => {
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

  const chartDataA = useMemo<ChartDataPropsB[]>(() => {
    return chartDataB.map((data) => ({
      ...data,
      incomeVsExpenses: (data.income || 0) - (data.expense || 0),
    }));
  }, [chartDataB]);

  const savingsChartData = useMemo<SavingsDataProps[]>(() => {
    const savingsActualByMonth = new Map(
      (savingsData ?? [])
        .filter(
          (transaction) =>
            moment(transaction.date).utc().year().toString() === selectedYear,
        )
        .map((transaction) => [
          moment(transaction.date).utc().format('YYYYMM'),
          transaction.paidAmount,
        ]),
    );

    return (savingsGoalData ?? [])
      .filter(
        (row) => moment(row.date).utc().year().toString() === selectedYear,
      )
      .map((row) => {
        const transactionMonth = moment(row.date).utc();
        const yearMonth = transactionMonth.format('YYYYMM');
        const month = transactionMonth.format('MMM');
        const amount = Number(row.savings ?? 0);
        const paidAmount = transactionMonth.isAfter(moment().utc(), 'month')
          ? undefined
          : savingsActualByMonth.get(yearMonth);

        return {
          yearMonth,
          month,
          amount,
          paidAmount,
        };
      })
      .filter((row) => row.amount > 0 || (row.paidAmount ?? 0) > 0);
  }, [savingsData, savingsGoalData, selectedYear]);

  const yearlyTopExpenses = useMemo<YearlyTopCategory[]>(() => {
    return buildYearlyTop5(expenseCategoriesData);
  }, [expenseCategoriesData]);

  const yearlyTopIncome = useMemo<YearlyTopCategory[]>(() => {
    return buildYearlyTop5(incomeCategoriesData);
  }, [incomeCategoriesData]);

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
    isSavingsGoalDataFetching ||
    isExpenseCategoriesFetching ||
    isIncomeCategoriesFetching;

  const getCategoryLabel = (rawName: string) => {
    const serializedName = serializeText(rawName);

    return t.has(`Common.category.${serializedName}`)
      ? t(`Common.category.${serializedName}`)
      : formatFallbackLabel(rawName);
  };

  const renderTop5Card = (
    items: YearlyTopCategory[],
    title: string,
    description: string,
  ) => {
    if (!items.length) return null;

    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="flex flex-col gap-3">
            {items.map((item, index) => {
              const maxAmount = items[0]?.amount ?? 0;
              const pct = maxAmount > 0 ? (item.amount / maxAmount) * 100 : 0;
              const label = getCategoryLabel(item.name);
              const amountLabel = formatCurrency({
                value: item.amount,
                currency: currency.name,
              });
              const percentageLabel = `${Math.round(pct)}%`;

              return (
                <li key={`${title}-${item.name}`}>
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
    );
  };

  const chartConfig = {
    income: {
      label: t('Common.type.income'),
      color: 'var(--chart-2)',
      icon: TrendingUpIcon,
    },
    expense: {
      label: t('Common.type.expense'),
      color: 'var(--chart-1)',
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
      label: 'Goal',
      color: 'var(--chart-2)',
    },
    paidAmount: {
      label: 'Actual',
      color: 'var(--chart-1)',
    },
  } satisfies ChartConfig;

  const formatChartCurrency = (value: unknown) => {
    const amount = typeof value === 'number' ? value : Number(value ?? 0);

    return formatCurrency({
      value: amount,
      currency: currency.name,
    });
  };

  if (isLoading || !currency.name) return <Loader />;

  return (
    <>
      <div className="flex flex-row items-center justify-center">
        <Button variant="ghost" size="icon" onClick={handlePrevYear}>
          <ChevronLeftIcon className="size-4" />
        </Button>

        <DropdownMenu
          open={isYearDropdownOpen}
          onOpenChange={setIsYearDropdownOpen}
        >
          <DropdownMenuTrigger render={<Button variant="ghost" />}>
            <TypographyPageTitle>{selectedYear}</TypographyPageTitle>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="center"
            className="max-h-72"
            data-year-dropdown="true"
          >
            <DropdownMenuGroup>
              {yearsArray.map((year) => (
                <DropdownMenuCheckboxItem
                  key={year}
                  data-year-item={year.toString()}
                  checked={selectedYear === year.toString()}
                  onClick={() => {
                    setSelectedYear(year.toString());
                    setIsYearDropdownOpen(false);
                  }}
                  className={`${selectedYear === year.toString() && 'font-extrabold'}`}
                >
                  {year}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

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
            <BarChart
              accessibilityLayer
              data={chartDataA}
              margin={{
                top: 12,
                bottom: 12,
              }}
            >
              <CartesianGrid vertical={false} />
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
              <Bar dataKey="incomeVsExpenses" radius={4}>
                <LabelList
                  position="top"
                  dataKey="month"
                  className="fill-muted-foreground"
                  fillOpacity={1}
                  fontSize={11}
                />
                {chartDataA.map((item, index) => (
                  <Cell
                    key={index}
                    fill={
                      item.incomeVsExpenses > 0
                        ? 'var(--chart-1)'
                        : 'var(--chart-2)'
                    }
                  />
                ))}
              </Bar>
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
            <AreaChart data={chartDataB}>
              <defs>
                <linearGradient id="fillIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-income)"
                    stopOpacity={0.35}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-income)"
                    stopOpacity={0.05}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => value.slice(0, 3)}
              />
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
              <Area
                dataKey="income"
                type="monotone"
                fill="url(#fillIncome)"
                stroke="var(--color-income)"
                strokeDasharray="4 4"
                strokeWidth={2}
              />
              <Line
                dataKey="expense"
                type="monotone"
                stroke="var(--color-expense)"
                strokeWidth={3}
                dot={false}
              />
              <ChartLegend content={<ChartLegendContent hideIcon />} />
            </AreaChart>
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
              <AreaChart
                accessibilityLayer
                data={savingsChartData}
                margin={{
                  left: 12,
                  right: 12,
                  top: 12,
                  bottom: 12,
                }}
              >
                <defs>
                  <linearGradient
                    id="fillSavingsGoal"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="var(--color-amount)"
                      stopOpacity={0.35}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-amount)"
                      stopOpacity={0.05}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      labelFormatter={(_value, payload) => {
                        return payload[0]?.payload?.month;
                      }}
                      formatter={(value, name, item) => {
                        const key = String(name);
                        const label =
                          savingsChartConfig[
                            key as keyof typeof savingsChartConfig
                          ]?.label ?? key;

                        return (
                          <>
                            <span
                              className="size-2.5 shrink-0 rounded-xs"
                              style={{ backgroundColor: item.color }}
                            />
                            <span className="text-muted-foreground">
                              {label}
                            </span>
                            <span className="text-foreground ml-auto font-mono font-medium tabular-nums">
                              {formatChartCurrency(value)}
                            </span>
                          </>
                        );
                      }}
                    />
                  }
                />
                <Area
                  dataKey="amount"
                  type="monotone"
                  fill="url(#fillSavingsGoal)"
                  stroke="var(--color-amount)"
                  strokeDasharray="4 4"
                  strokeWidth={2}
                />
                <Line
                  dataKey="paidAmount"
                  type="monotone"
                  stroke="var(--color-paidAmount)"
                  strokeWidth={3}
                  dot={false}
                />
                <ChartLegend content={<ChartLegendContent />} />
              </AreaChart>
            </ChartContainer>
          ) : (
            <div className="flex items-center justify-center">
              <TypographyLead>{t('Common.label.noData')}</TypographyLead>
            </div>
          )}
        </CardContent>
      </Card>
      {/* Top 5 by type */}
      {(yearlyTopExpenses.length > 0 || yearlyTopIncome.length > 0) && (
        <div className="grid gap-4 xl:grid-cols-2">
          {renderTop5Card(
            yearlyTopExpenses,
            t('Page.charts.yearly.topCategoriesTitle'),
            t('Page.charts.yearly.topCategoriesDescription'),
          )}
          {renderTop5Card(
            yearlyTopIncome,
            t.has('Page.charts.yearly.topIncomeSourcesTitle')
              ? t('Page.charts.yearly.topIncomeSourcesTitle')
              : 'Top 5 Income Sources',
            t.has('Page.charts.yearly.topIncomeSourcesDescription')
              ? t('Page.charts.yearly.topIncomeSourcesDescription')
              : 'Largest income sources this year',
          )}
        </div>
      )}{' '}
    </>
  );
};

export default Charts;
