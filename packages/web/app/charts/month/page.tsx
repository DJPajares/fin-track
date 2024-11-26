'use client';

import { DatePicker } from '@/components/shared/DatePicker';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import { useAppSelector } from '@/lib/hooks';
import { fetchTransactionsDateRangeByType } from '@/providers/fetchTransactions';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  TrendingDownIcon,
  TrendingUpIcon
} from 'lucide-react';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

const Charts = () => {
  const [date, setDate] = useState(new Date());
  const [chartData, setChartData] = useState([]);

  const { currency } = useAppSelector((state) => state.dashboard);

  // useEffect(() => {
  //   fetchData();
  // }, []);

  useEffect(() => {
    fetchData();
  }, [currency]);

  const fetchData = async () => {
    const transactions = await fetchTransactionsDateRangeByType({
      startDate: new Date('2025-01-01T16:00:00.000Z'),
      endDate: new Date('2025-12-01T16:00:00.000Z'),
      currency: currency.name
    });

    setChartData(transactions);
  };

  const handlePrevMonth = () => {
    const newDate = moment(date).add(-1, 'months');

    setDate(moment(newDate).toDate());
  };

  const handleNextMonth = () => {
    const newDate = moment(date).add(1, 'months');

    setDate(moment(newDate).toDate());
  };

  const chartConfig = {
    expense: {
      label: 'Expense',
      color: 'hsl(var(--chart-primary))',
      icon: TrendingDownIcon
    },
    income: {
      label: 'Income',
      color: 'hsl(var(--chart-secondary))',
      icon: TrendingUpIcon
    }
  } satisfies ChartConfig;

  return (
    <div className="space-y-4 sm:space-y-8">
      <div className="flex flex-row justify-center items-center">
        <Button variant="ghost" size="icon" onClick={handlePrevMonth}>
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>

        <DatePicker date={date} onChange={setDate}>
          <Button variant="ghost" className="px-0">
            <p className="text-3xl sm:text-5xl font-extrabold sm:font-black hover:underline hover:bg-background">
              {moment(date).format('MMM yyyy')}
            </p>
          </Button>
        </DatePicker>

        <Button variant="ghost" size="icon" onClick={handleNextMonth}>
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
      </div>

      {/* CHART */}
      <div>
        <Card className="py-3 px-1">
          <ChartContainer config={chartConfig}>
            <AreaChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12
              }}
            >
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
                content={<ChartTooltipContent indicator="line" />}
              />
              <Area
                dataKey="expense"
                type="natural"
                fill="var(--color-expense)"
                // fillOpacity={0.4}
                stroke="var(--color-expense)"
                stackId="a"
              />
              <Area
                dataKey="income"
                type="natural"
                fill="var(--color-income)"
                // fillOpacity={0.4}
                stroke="var(--color-income)"
                stackId="a"
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        </Card>
      </div>
    </div>
  );
};

export default Charts;
