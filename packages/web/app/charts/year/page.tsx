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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
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
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

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
  const [date, setDate] = useState(new Date());
  const [selectedYear, setSelectedYear] = useState<string>(
    new Date().getFullYear().toString()
  );
  const [chartData, setChartData] = useState([]);

  const { currency } = useAppSelector((state) => state.dashboard);

  useEffect(() => {
    fetchData();
  }, [currency]);

  useEffect(() => {
    fetchData();
  }, [selectedYear]);

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
        <Button variant="ghost" size="icon" onClick={handlePrevYear}>
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>

        <Select
          value={selectedYear}
          onValueChange={(value) => {
            setSelectedYear(value);
          }}
        >
          <SelectTrigger className="w-24">
            <SelectValue placeholder="Select a year"></SelectValue>
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
              {/* <CartesianGrid vertical={false} /> */}
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                // tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <YAxis />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Area
                dataKey="expense"
                type="natural"
                fill="var(--color-expense)"
                fillOpacity={0.4}
                stroke="var(--color-expense)"
                stackId="a"
                dot={{
                  fill: 'var(--color-expense)'
                }}
              />
              <Area
                dataKey="income"
                type="natural"
                fill="var(--color-income)"
                fillOpacity={0.4}
                stroke="var(--color-income)"
                stackId="a"
                dot={{
                  fill: 'var(--color-income)'
                }}
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
