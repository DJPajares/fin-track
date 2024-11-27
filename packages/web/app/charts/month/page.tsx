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
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectLabel,
//   SelectTrigger,
//   SelectValue
// } from '@/components/ui/select';
import { useAppSelector } from '@/lib/hooks';
import {
  fetchTransactionsDateByCategory,
  TransactionsDateByCategoryProps
} from '@/providers/fetchTransactions';
import { Select, SelectItem } from '@nextui-org/react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import moment from 'moment';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { Cell, Label, LabelList, Pie, PieChart, Sector } from 'recharts';
import { PieSectorDataItem } from 'recharts/types/polar/Pie';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Charts = () => {
  const [date, setDate] = useState(new Date());
  const [selectedType, setSelectedType] = useState<string>();
  const [chartData, setChartData] = useState([]);

  const { currency } = useAppSelector((state) => state.dashboard);
  const { types } = useAppSelector((state) => state.main);

  const totalAmount = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.amount, 0);
  }, [chartData]);

  useEffect(() => {
    fetchData({
      date,
      currency: currency.name,
      type: selectedType
    });
  }, [date, currency, selectedType]);

  const fetchData = async ({
    date,
    currency,
    type
  }: TransactionsDateByCategoryProps) => {
    const transactions = await fetchTransactionsDateByCategory({
      date,
      currency,
      type
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

  const handleSelectionChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedType(e.target.value);
  };

  const chartConfig = {
    amount: {
      label: 'Amount'
    }
  } satisfies ChartConfig;

  return (
    <div className="space-y-4 sm:space-y-8">
      <div className="flex flex-col items-center space-y-4">
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

        {/* <Select
        value={selectedType}
        onValueChange={(value) => {
          console.log(value);
          // setSelectedType(value);
        }}
      >
        <SelectTrigger className="w-24">
          <SelectValue placeholder="Select a year"></SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>
              {types.map((type) => (
                <SelectItem
                  key={type._id}
                  value={type.toString()}
                  defaultValue={selectedType}
                >
                  {type.name}
                </SelectItem>
              ))}
            </SelectLabel>
          </SelectGroup>
        </SelectContent>
      </Select> */}

        <Select
          items={types}
          label="Type"
          placeholder="Select type"
          className="max-w-52"
          selectedKeys={[selectedType]}
          onChange={handleSelectionChange}
        >
          {(type) => <SelectItem key={type._id}>{type.name}</SelectItem>}
        </Select>
      </div>

      {/* CHART */}
      <div>
        <Card className="py-3 px-1">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px]"
          >
            {/* <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie data={chartData} dataKey="amount" nameKey="category">
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart> */}

            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent nameKey="category" hideLabel />}
              />
              {/* <ChartLegend
                content={<ChartLegendContent nameKey="category" />}
              /> */}
              <Pie
                data={chartData}
                dataKey="amount"
                nameKey="category"
                innerRadius={60}
                strokeWidth={5}
                activeIndex={0}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}

                <Label
                  content={({ viewBox }) => {
                    if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {totalAmount.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Amount
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        </Card>
      </div>
    </div>
  );
};

export default Charts;
