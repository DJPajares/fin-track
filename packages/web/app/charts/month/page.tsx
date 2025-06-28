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
import { formatCurrency } from '@shared/utilities/formatCurrency';

import type { ListProps } from '../../../types/List';
import type { IconProps } from '@web/components/shared/CardIcon';

type TransactionByCategory = {
  id: string;
  idSerialized: string;
  serializedCategory: string;
  category: string;
  icon: IconProps;
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
  const [selectedType, setSelectedType] = useState<ListProps>({
    _id: '',
    name: '',
  });

  const newTypes = types.map((type) => {
    const isTranslated = t.has(`Common.type.${type.id}`);

    return {
      _id: type._id,
      name: isTranslated ? t(`Common.type.${type.id}`) : type.name,
    };
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

  useEffect(() => {
    if (selectedType._id && newTypes.length > 0) {
      const updatedType = newTypes.find((t) => t._id === selectedType._id);
      if (updatedType && updatedType.name !== selectedType.name) {
        setSelectedType(updatedType);
      }
    }
  }, [newTypes, selectedType._id, selectedType.name]);

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
  };

  const handlePrevMonth = () => {
    const newDate = moment(date).add(-1, 'months');

    setDate(moment(newDate).toDate());
  };

  const handleNextMonth = () => {
    const newDate = moment(date).add(1, 'months');

    setDate(moment(newDate).toDate());
  };

  const chartConfig: ChartConfig = chartData.reduce((acc, item) => {
    const isTranslated = t.has(`Common.category.${item.idSerialized}`);

    acc[item.idSerialized] = {
      label: isTranslated
        ? t(`Common.category.${item.idSerialized}`)
        : item.category,
    };
    return acc;
  }, {} as ChartConfig);

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
            items={newTypes}
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
                    nameKey="idSerialized"
                    innerRadius={isMobile ? 70 : 90}
                    strokeWidth={5}
                    activeIndex={0}
                    paddingAngle={chartData.length > 1 ? 2 : 0}
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={`var(--chart-${(index % 15) + 1})`}
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
                        formatter={(value, name, item) => {
                          const { idSerialized, category } = item.payload;
                          const isTranslated = t.has(
                            `Common.category.${idSerialized}`,
                          );

                          return (
                            <div className="flex flex-col justify-between">
                              <Label className="font-bold">
                                {isTranslated
                                  ? t(`Common.category.${idSerialized}`)
                                  : category}
                              </Label>
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
