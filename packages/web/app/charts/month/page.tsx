'use client';

import { useEffect, useMemo, useState } from 'react';
import moment from 'moment';
import { useTranslations } from 'next-intl';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useAppSelector } from '../../../lib/hooks/use-redux';
import { useIsMobile } from '../../../lib/hooks/use-mobile';

import { Cell, Label as ChartLabel, Pie, PieChart } from 'recharts';
import { DatePicker } from '../../../components/shared/DatePicker';
import { Button } from '../../../components/ui/button';
import { Label } from '../../../components/ui/label';
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
import { SelectBox } from '../../../components/shared/SelectBox';

import {
  fetchTransactionsDateByCategory,
  TransactionsDateByCategoryProps,
} from '../../../services/fetchTransactions';

import { dateStringFormat } from '@shared/constants/dateStringFormat';
import { CHART_COLORS } from '../../../constants/chartColorPalettes';
import { formatCurrency } from '@shared/utilities/formatCurrency';

import type { ListProps } from '../../../types/List';

type TransactionByCategory = {
  category: string;
  amount: number;
};

const Charts = () => {
  const t = useTranslations();
  const isMobile = useIsMobile();

  const { types } = useAppSelector((state) => state.main);
  const { currency } = useAppSelector((state) => state.dashboard);
  const dashboardDateString = useAppSelector((state) => state.dashboard.date);

  const dashboardDate = useMemo(
    () => moment(dashboardDateString, dateStringFormat).toDate(),
    [dashboardDateString],
  );

  const [date, setDate] = useState(dashboardDate);
  const [chartData, setChartData] = useState<TransactionByCategory[]>([]);
  const [chartConfigData, setChartConfigData] = useState<ChartConfig>({});
  const [selectedType, setSelectedType] = useState<ListProps>({
    _id: '',
    name: '',
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
      type: selectedType._id,
    });
  }, [date, currency, selectedType]);

  const fetchData = async ({
    date,
    currency,
    type,
  }: TransactionsDateByCategoryProps) => {
    const transactions = await fetchTransactionsDateByCategory({
      date,
      currency,
      type,
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

  const chartConfig: ChartConfig = chartConfigData;

  return (
    <div className="space-y-6 sm:space-y-10">
      <div className="flex flex-row items-center justify-center">
        <Button variant="ghost" size="rounded-icon" onClick={handlePrevMonth}>
          <ChevronLeftIcon className="size-4" />
        </Button>

        <DatePicker date={date} onChange={setDate}>
          <Button variant="ghost" className="px-1">
            <Label
              variant="title-xl"
              className="hover:bg-background hover:underline"
            >
              {moment(date).format('MMM yyyy')}
            </Label>
          </Button>
        </DatePicker>

        <Button variant="ghost" size="rounded-icon" onClick={handleNextMonth}>
          <ChevronRightIcon className="size-4" />
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
          <Card>
            <CardHeader className="flex flex-row items-center justify-center">
              <CardTitle>{t('Page.charts.monthly.byCategoryTitle')}</CardTitle>
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

                    <ChartLabel
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
                                  currency: currency.name,
                                })}
                              </tspan>
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) + 24}
                                className="fill-muted-foreground"
                              >
                                {t('Page.charts.monthly.amountLabel')}
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
                        formatter={(value, name) => {
                          return (
                            <div className="flex flex-col justify-between">
                              <Label className="font-bold">{name}</Label>
                              <Label className="italic">
                                {formatCurrency({
                                  value: parseFloat(value.toString()),
                                  currency: currency.name,
                                })}
                              </Label>
                            </div>
                          );
                        }}
                        labelFormatter={(value) => {
                          return value;
                        }}
                      />
                    }
                  />
                  <ChartLegend
                    content={<ChartLegendContent />}
                    className="basis-1/4 flex-wrap justify-start gap-1"
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
