'use client';

import { dateStringFormat } from '@shared/constants/dateStringFormat';
import { formatCurrency } from '@shared/utilities/formatCurrency';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import moment from 'moment';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { Cell, Label as ChartLabel, Pie, PieChart } from 'recharts';

import type { IconProps } from '../../../components/shared/CardIcon';
import { DatePicker } from '../../../components/shared/DatePicker';
import Loader from '../../../components/shared/Loader';
import { SelectBox } from '../../../components/shared/SelectBox';
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
import { Label } from '../../../components/ui/label';
import { useIsMobile } from '../../../lib/hooks/use-mobile';
import { useAppSelector } from '../../../lib/hooks/use-redux';
import { useGetTransactionsByCategoryQuery } from '../../../lib/redux/services/transactions';

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

  const { user } = useAppSelector((state) => state.auth);
  const userId = user?.id || '';
  const { types } = useAppSelector((state) => state.main);
  const { currency } = useAppSelector((state) => state.dashboard);
  const dashboardDateString = useAppSelector((state) => state.dashboard.date);

  const dashboardDate = useMemo(
    () => moment(dashboardDateString, dateStringFormat).toDate(),
    [dashboardDateString],
  );

  const [date, setDate] = useState(dashboardDate);
  const [selectedTypeId, setSelectedTypeId] = useState('');

  const newTypes = types.map((type) => {
    const isTranslated = t.has(`Common.type.${type.id}`);

    return {
      _id: type._id,
      name: isTranslated ? t(`Common.type.${type.id}`) : type.name,
    };
  });

  const selectedType = useMemo(() => {
    return (
      newTypes.find((type) => type._id === selectedTypeId) ??
      newTypes[0] ?? {
        _id: '',
        name: '',
      }
    );
  }, [newTypes, selectedTypeId]);

  const {
    data: transactionsByCategory,
    isFetching: isTransactionsByCategoryFetching,
  } = useGetTransactionsByCategoryQuery(
    {
      date,
      currency: currency.name,
      type: selectedType._id,
      userId,
    },
    {
      skip: !userId || !currency.name || !selectedType._id,
    },
  );

  const chartData = useMemo<TransactionByCategory[]>(() => {
    return transactionsByCategory ?? [];
  }, [transactionsByCategory]);

  const totalAmount = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.amount, 0);
  }, [chartData]);

  const handlePrevMonth = () => {
    const newDate = moment(date).add(-1, 'months');

    setDate(moment(newDate).toDate());
  };

  const handleNextMonth = () => {
    const newDate = moment(date).add(1, 'months');

    setDate(moment(newDate).toDate());
  };

  const isLoading = isTransactionsByCategoryFetching;

  const chartConfig: ChartConfig = chartData.reduce((acc, item) => {
    const isTranslated = t.has(`Common.category.${item.idSerialized}`);

    acc[item.idSerialized] = {
      label: isTranslated
        ? t(`Common.category.${item.idSerialized}`)
        : item.category,
    };
    return acc;
  }, {} as ChartConfig);

  if (isLoading || !currency.name) return <Loader />;

  return (
    <>
      <div className="flex flex-row items-center justify-center gap-1 sm:gap-4">
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
            setSelectedItem={(item) => setSelectedTypeId(item._id)}
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
                className="mx-auto aspect-square max-h-150"
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
    </>
  );
};

export default Charts;
