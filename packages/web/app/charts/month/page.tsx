'use client';

import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import moment from 'moment';
import { useAppSelector } from '../../../lib/hooks';
import { useIsMobile } from '../../../hooks/use-mobile';

import { DatePicker } from '../../../components/shared/DatePicker';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent
} from '../../../components/ui/chart';
import {
  fetchTransactionsDateByCategory,
  TransactionsDateByCategoryProps
} from '../../../providers/fetchTransactions';
import { Tab, Tabs } from '@nextui-org/react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { Cell, Label, Pie, PieChart } from 'recharts';

import { iconMap } from '../../../components/shared/CardIcon';

import { CHART_COLORS } from '../../../constants/chartColorPalettes';
import { formatCurrency } from '@shared/utilities/formatCurrency';

type TransactionByCategory = {
  category: string;
  amount: number;
};

const Charts = () => {
  const isMobile = useIsMobile();
  const { currency } = useAppSelector((state) => state.dashboard);
  const { types } = useAppSelector((state) => state.main);

  const [date, setDate] = useState(new Date());
  const [chartData, setChartData] = useState<TransactionByCategory[]>([]);
  const [chartConfigData, setChartConfigData] = useState<ChartConfig>({});
  const [selectedType, setSelectedType] = useState('');

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

    setChartData(transactions.data);
    setChartConfigData(transactions.chartConfig);
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

  // Replace label color as icon
  // const chartConfig = Object.fromEntries(
  //   Object.entries(chartConfigData).map(([key, value]) => [
  //     key,
  //     {
  //       ...value,
  //       icon: iconMap[value.icon]
  //     }
  //   ])
  // );

  const chartConfig: ChartConfig = chartConfigData;

  return (
    <div className="space-y-8 sm:space-y-12">
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

      <Tabs
        variant="bordered"
        radius="full"
        size="lg"
        color="primary"
        className="flex flex-col items-center"
        classNames={{
          tabContent:
            'group-data-[selected=true]:text-primary-foreground text-sm font-bold uppercase'
        }}
        selectedKey={selectedType}
        onSelectionChange={(key) => setSelectedType(key as string)}
      >
        {types.map((type) => (
          <Tab key={type._id.toString()} title={type.name}>
            <div className="space-y-2">
              {/* CHART */}
              <Card className="py-3 px-1 bg-accent/70">
                <ChartContainer
                  config={chartConfig}
                  className="mx-auto aspect-square max-h-[600px]"
                >
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="amount"
                      nameKey="serializedCategory"
                      innerRadius={isMobile ? 70 : 90}
                      strokeWidth={5}
                      activeIndex={0}
                      paddingAngle={chartData.length > 1 ? 2 : 0}
                    >
                      {chartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={CHART_COLORS[index % CHART_COLORS.length]}
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
                                  className="fill-foreground text-2xl font-semibold"
                                >
                                  {formatCurrency({
                                    value: totalAmount,
                                    currency: currency.name
                                  })}
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
                    <ChartTooltip
                      cursor={false}
                      content={
                        <ChartTooltipContent
                          nameKey="serializedCategory"
                          hideLabel
                        />
                      }
                    />
                    <ChartLegend
                      content={<ChartLegendContent />}
                      className="-translate-y-2 flex-wrap gap-2 basis-1/4 justify-center"
                    />
                    {/* <ChartLegend content={<ChartLegendContent />} /> */}
                    {/* <ChartLegend
                      content={
                        <ChartLegendContent nameKey="serializedCategory" />
                      }
                      className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
                    /> */}
                  </PieChart>
                </ChartContainer>
              </Card>
            </div>
          </Tab>
        ))}
      </Tabs>
    </div>
  );
};

export default Charts;
