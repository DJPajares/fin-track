'use client';

import { useEffect, useState } from 'react';
import moment from 'moment';

import { useAppSelector } from '../../../lib/hooks';
import { useIsMobile } from '../../../hooks/use-mobile';

import {
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  XAxis,
  YAxis
} from 'recharts';
import { Button } from '../../../components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '../../../components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent
} from '../../../components/ui/chart';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '../../../components/ui/select';

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  TrendingDownIcon,
  TrendingUpIcon
} from 'lucide-react';

import { fetchTransactionsDateRangeByType } from '../../../providers/fetchTransactions';

import { formatCurrency } from '@shared/utilities/formatCurrency';

type ChartDataProps = {
  date: string;
  expense: number;
  income: number;
};

type ChartDataPropsA = {
  date: string;
  incomeVsExpenses: number;
};

const generateYearsArray = (range: number): number[] => {
  const currentYear = new Date().getFullYear();
  const startYear = currentYear - range;
  const endYear = currentYear + range;

  return Array.from(
    { length: endYear - startYear + 1 },
    (_, index) => startYear + index
  );
};

const Charts = () => {
  const isMobile = useIsMobile();

  const [date, setDate] = useState(new Date());
  const [selectedYear, setSelectedYear] = useState<string>(
    new Date().getFullYear().toString()
  );
  const [chartData, setChartData] = useState<ChartDataProps[]>([]);
  const [chartDataA, setChartDataA] = useState<ChartDataPropsA[]>([]);

  const { currency } = useAppSelector((state) => state.dashboard);

  useEffect(() => {
    fetchData();
  }, [currency]);

  useEffect(() => {
    fetchData();
  }, [selectedYear]);

  useEffect(() => {
    const data = chartData.map((data) => ({
      ...data,
      incomeVsExpenses: (data.income || 0) - (data.expense || 0)
    }));

    setChartDataA(data);
  }, [chartData]);

  const yearsArray = generateYearsArray(10);

  const fetchData = async () => {
    const transactions = await fetchTransactionsDateRangeByType({
      startDate: new Date(parseInt(selectedYear), 0, 1),
      endDate: new Date(parseInt(selectedYear), 11, 31),
      currency: currency.name
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
      icon: TrendingUpIcon
    },
    expense: {
      label: 'Expense',
      color: 'hsl(var(--secondary))',
      icon: TrendingDownIcon
    },
    incomeVsExpenses: {
      label: 'Income Vs Expenses',
      color: 'hsl(var(--primary))',
      icon: TrendingUpIcon
    }
  } satisfies ChartConfig;

  return (
    <div className="space-y-4 sm:space-y-8">
      <div className="flex flex-row justify-center items-center">
        <Button variant="ghost" size="sm_rounded_icon" onClick={handlePrevYear}>
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>

        <Select
          value={selectedYear}
          onValueChange={(value) => {
            setSelectedYear(value);
          }}
        >
          {/* <SelectTrigger className="w-24">
            <SelectValue placeholder="Select a year"></SelectValue>
          </SelectTrigger> */}
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
      <Card className="py-3 px-1 bg-accent/70">
        <CardHeader className="flex flex-row items-center justify-center">
          <CardTitle>Income Vs Expenses</CardTitle>
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
                        currency: currency.name
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
      <Card className="py-3 px-1 bg-accent/70">
        <CardHeader className="flex flex-row items-center justify-center">
          <CardTitle>Income and Expenses</CardTitle>
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
    </div>
  );
};

export default Charts;
