'use client';

import { useEffect, useMemo, useState } from 'react';
import moment from 'moment';
import { useTranslations } from 'next-intl';

import { useAppSelector } from '../../../lib/hooks/use-redux';
import { useIsMobile } from '../../../lib/hooks/use-mobile';

import {
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  XAxis,
  YAxis,
} from 'recharts';
import { Button } from '../../../components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '../../../components/ui/chart';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  TrendingDownIcon,
  TrendingUpIcon,
} from 'lucide-react';

import { useGetTransactionPaymentsByCategoryQuery } from '../../../lib/redux/services/dashboard';
import { fetchTransactionsDateRangeByType } from '../../../services/fetchTransactions';

import { formatCurrency } from '@shared/utilities/formatCurrency';
import { dateStringFormat } from '@shared/constants/dateStringFormat';
import { Label } from '@web/components/ui/label';

type ChartDataProps = {
  date: string;
  expense: number;
  income: number;
};

type ChartDataPropsA = {
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

  const dashboardDateString = useAppSelector((state) => state.dashboard.date);

  const dashboardDate = useMemo(
    () => moment(dashboardDateString, dateStringFormat).toDate(),
    [dashboardDateString],
  );

  const [selectedYear, setSelectedYear] = useState<string>(
    dashboardDate.getFullYear().toString(),
  );
  const [chartData, setChartData] = useState<ChartDataProps[]>([]);
  const [chartDataA, setChartDataA] = useState<ChartDataPropsA[]>([]);
  const [savingsChartData, setSavingsChartData] = useState<SavingsDataProps[]>(
    [],
  );

  const { currency } = useAppSelector((state) => state.dashboard);

  const { data: savingsData } = useGetTransactionPaymentsByCategoryQuery({
    startDate: new Date(parseInt(selectedYear), 0, 1),
    endDate: new Date(parseInt(selectedYear), 11, 31),
    currency: currency.name,
    category: 'savings',
  });

  useEffect(() => {
    fetchData();
  }, [currency]);

  useEffect(() => {
    fetchData();
  }, [selectedYear]);

  useEffect(() => {
    const data = chartData.map((data) => ({
      ...data,
      incomeVsExpenses: (data.income || 0) - (data.expense || 0),
    }));

    setChartDataA(data);
  }, [chartData]);

  useEffect(() => {
    // if (savingsData) {
    //   const formattedData = savingsData.map((transaction) => {

    //     return {
    //       month: transaction.month,
    //       yearMonth: `${ transaction.year }-${ transaction.month }`,
    //       amount: Number(transaction.paidAmount)
    //     };
    //   });

    //   setChartDataSavings(formattedData);
    // }

    setSavingsChartData(
      savingsData
        ? savingsData.map((transaction) => {
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
  }, [savingsData]);

  const yearsArray = generateYearsArray(10);

  const fetchData = async () => {
    const transactions = await fetchTransactionsDateRangeByType({
      startDate: new Date(parseInt(selectedYear), 0, 1),
      endDate: new Date(parseInt(selectedYear), 11, 31),
      currency: currency.name,
    });

    setChartData(transactions);
  };

  const handlePrevYear = () => {
    const newDate = moment(selectedYear).add(-1, 'years');

    setSelectedYear(moment(newDate).format('YYYY'));
  };

  const handleNextMonth = () => {
    const newDate = moment(selectedYear).add(1, 'years');

    setSelectedYear(moment(newDate).format('YYYY'));
  };

  const chartConfig = {
    income: {
      label: 'Income',
      color: 'hsl(var(--primary))',
      icon: TrendingUpIcon,
    },
    expense: {
      label: 'Expense',
      color: 'hsl(var(--secondary))',
      icon: TrendingDownIcon,
    },
    incomeVsExpenses: {
      label: 'Income Vs Expenses',
      color: 'hsl(var(--primary))',
      icon: TrendingUpIcon,
    },
    savings: {
      label: 'Savings',
      color: 'hsl(var(--accent))',
      icon: TrendingUpIcon,
    },
  } satisfies ChartConfig;

  const savingsChartConfig = {
    amount: {
      label: 'Amount',
      color: 'hsl(var(--chart-1))',
    },
  } satisfies ChartConfig;

  return (
    <div className="space-y-4 sm:space-y-8">
      <div className="flex flex-row items-center justify-center">
        <Button variant="ghost" size="sm_rounded_icon" onClick={handlePrevYear}>
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>

        <Select
          value={selectedYear}
          onValueChange={(value) => {
            setSelectedYear(value);
          }}
        >
          <SelectTrigger
            variant="ghost-clean"
            className="w-fit text-2xl font-bold"
          >
            <SelectValue placeholder="Year..."></SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>
                {yearsArray.map((year) => (
                  <SelectItem
                    key={year}
                    value={year.toString()}
                    defaultValue={selectedYear}
                  >
                    {year}
                  </SelectItem>
                ))}
              </SelectLabel>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Button
          variant="ghost"
          size="sm_rounded_icon"
          onClick={handleNextMonth}
        >
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
      </div>

      {/* CHART A */}
      <Card className="bg-accent/70 px-1 py-3">
        <CardHeader className="flex flex-row items-center justify-center">
          <CardTitle>{t('Page.charts.yearly.incomeVsExpensesTitle')}</CardTitle>
        </CardHeader>
        <CardContent className="p-1">
          <ChartContainer config={chartConfig}>
            <BarChart data={chartDataA}>
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
                fill="var(--color-incomeVsExpenses)"
                radius={2}
              />
              {/* <ReferenceLine y={0} stroke="hsl(var(--primary))" /> */}
              <ReferenceLine y={0} stroke="#808080" />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* CHART B */}
      <Card className="bg-accent/70 px-1 py-3">
        <CardHeader className="flex flex-row items-center justify-center">
          <CardTitle>
            {t('Page.charts.yearly.incomeAndExpensesTitle')}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-1">
          <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer data={chartData}>
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
              <Bar dataKey="income" fill="var(--color-income)" radius={2} />
              <Bar dataKey="expense" fill="var(--color-expense)" radius={2} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* CHART C - Savings */}
      <Card className="bg-accent/70 px-1 py-3">
        <CardHeader className="flex flex-row items-center justify-center">
          <CardTitle>Savings</CardTitle>
        </CardHeader>
        <CardContent className="p-1">
          {savingsData?.length ? (
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
                <Bar dataKey="amount" fill="hsl(var(--primary))" />
              </BarChart>
              {/* <BarChart
                accessibilityLayer
                data={ savingsChartData }
                layout="vertical"
                margin={ {
                  right: 40,
                } }
              >
                <CartesianGrid horizontal={ false } />
                <YAxis dataKey="month" type="category" hide />
                <XAxis dataKey="amount" type="number" hide />
                <ChartTooltip
                  cursor={ false }
                  content={
                    <ChartTooltipContent
                      formatter={ (value) => {
                        return (
                          <span className="flex flex-col justify-between">
                            <p
                              className={ `${ parseFloat(value.toString()) < 0 && 'text-destructive' } 'font-semibold'` }
                            >
                              { formatCurrency({
                                value: parseFloat(value.toString()),
                                currency: currency.name,
                              }) }
                            </p>
                          </span>
                        );
                      } }
                    />
                  }
                />
                <Bar
                  dataKey="amount"
                  layout="vertical"
                  fill="hsl(var(--primary))"
                >
                  <LabelList
                    dataKey="month"
                    position="insideLeft"
                    className="fill-primary-foreground tracking-tighter"
                  />
                  <LabelList
                    dataKey="amount"
                    position="right"
                    className="fill-foreground"
                    fontSize={ 9 }
                    formatter={ (value: number) =>
                      formatCurrency({ value, currency: currency.name })
                    }
                  />
                </Bar>
              </BarChart> */}
            </ChartContainer>
          ) : (
            <Label variant="subtitle">No data available</Label>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Charts;
