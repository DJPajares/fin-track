'use client';

import { useEffect, useMemo, useState } from 'react';
import moment from 'moment';
import { useTranslations } from 'next-intl';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useAppSelector } from '../../../lib/hooks/use-redux';
import { useIsMobile } from '../../../lib/hooks/use-mobile';

import { Cell, Label, Pie, PieChart } from 'recharts';
import { DatePicker } from '../../../components/shared/DatePicker';
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
import { SelectBox } from '../../../components/shared/SelectBox';
import { iconMap } from '../../../components/shared/CardIcon';

import {
  fetchTransactionsDateByCategory,
  TransactionsDateByCategoryProps
} from '../../../services/fetchTransactions';

import { CHART_COLORS } from '../../../constants/chartColorPalettes';
import { formatCurrency } from '@shared/utilities/formatCurrency';

import type { ListProps } from '../../../types/List';
import { dateStringFormat } from '@shared/constants/dateStringFormat';

type TransactionByCategory = {
  category: string;
  amount: number;
};

type CustomTooltipProps = {
  payload?: any;
  label?: string;
  active?: string;
};

const Charts = () => {
  const t = useTranslations();
  const isMobile = useIsMobile();

  const { types } = useAppSelector((state) => state.main);
  const { currency } = useAppSelector((state) => state.dashboard);
  const dashboardDateString = useAppSelector((state) => state.dashboard.date);

  const dashboardDate = useMemo(
    () => moment(dashboardDateString, dateStringFormat).toDate(),
    [dashboardDateString]
  );

  const [date, setDate] = useState(dashboardDate);
  const [chartData, setChartData] = useState<TransactionByCategory[]>([]);
  const [chartConfigData, setChartConfigData] = useState<ChartConfig>({});
  const [selectedType, setSelectedType] = useState<ListProps>({
    _id: '',
    name: ''
  });

  useEffect(() => {
    if (types && types.length > 0) {
      setSelectedType(types[0]);
    }
  }, [types]);

  const totalAmount = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.amount, 0);
  }, [chartData]);

  useEffect(() => {
    fetchData({
      date,
      currency: currency.name,
      type: selectedType._id
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

  const CustomTooltip = ({ payload, label, active }: CustomTooltipProps) => {
    if (active) {
      const title = payload[0].payload.category;
      const value = payload[0].value;

      return (
        <div className="bg-background p-3 rounded-md">
          <p className="text-xs font-semibold">{title}</p>
          <p className="text-xs">
            {formatCurrency({
              value,
              currency: currency.name
            })}
          </p>
          {/* <p className="desc">Anything you want can be displayed here.</p> */}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="space-y-6 sm:space-y-10">
      <div className="flex flex-row justify-center items-center">
        <Button
          variant="ghost"
          size="sm_rounded_icon"
          onClick={handlePrevMonth}
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>

        <DatePicker date={date} onChange={setDate}>
          <Button variant="ghost" className="px-1">
            <p className="text-3xl sm:text-5xl font-extrabold sm:font-black hover:underline hover:bg-background">
              {moment(date).format('MMM yyyy')}
            </p>
          </Button>
        </DatePicker>

        <Button
          variant="ghost"
          size="sm_rounded_icon"
          onClick={handleNextMonth}
        >
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-2">
        <div className="flex flex-row justify-end">
          <SelectBox
            variant="ghost"
            items={types}
            selectedItem={selectedType}
            setSelectedItem={setSelectedType}
            placeholder={t('Common.label.selectPlaceholder')}
            className="w-fit p-0 text-base font-semibold"
          />
        </div>

        {/* CHARTS */}
        <div>
          <Card className="py-3 px-1 bg-accent/70">
            <CardHeader className="flex flex-row items-center justify-center">
              <CardTitle>By Category</CardTitle>
            </CardHeader>
            <CardContent>
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
                    // content={
                    //   <ChartTooltipContent
                    //     nameKey="serializedCategory"
                    //     hideLabel
                    //   />
                    // }
                    content={<CustomTooltip />}
                  />
                  <ChartLegend
                    content={<ChartLegendContent />}
                    className="flex-wrap gap-1 basis-1/4 justify-end"
                  />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Charts;
