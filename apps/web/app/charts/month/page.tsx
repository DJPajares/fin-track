'use client';

import { dateStringFormat } from '@shared/constants/dateStringFormat';
import { formatCurrency } from '@shared/utilities/formatCurrency';
import type { IconProps } from '@web/components/shared/CardIcon';
import { DatePicker } from '@web/components/shared/DatePicker';
import Loader from '@web/components/shared/Loader';
import { SelectBox } from '@web/components/shared/SelectBox';
import {
  TypographyCardTitle,
  TypographyLabel,
} from '@web/components/shared/Typography';
import { Button } from '@web/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@web/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@web/components/ui/chart';
import { Progress, ProgressLabel } from '@web/components/ui/progress';
import { useIsMobile } from '@web/lib/hooks/use-mobile';
import { useAppSelector } from '@web/lib/hooks/use-redux';
import { useGetTransactionsByCategoryQuery } from '@web/lib/redux/services/transactions';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import moment from 'moment';
import { useTranslations } from 'next-intl';
import { type CSSProperties, useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  Cell,
  Label as ChartLabel,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from 'recharts';

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

  const sortedChartData = useMemo(() => {
    return [...chartData].sort((a, b) => b.amount - a.amount);
  }, [chartData]);

  const top5ChartData = useMemo(() => {
    return sortedChartData.slice(0, 5);
  }, [sortedChartData]);

  const top5MaxAmount = useMemo(() => {
    return top5ChartData[0]?.amount ?? 0;
  }, [top5ChartData]);

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
        <Button variant="ghost" size="icon" onClick={handlePrevMonth}>
          <ChevronLeftIcon className="size-4" />
        </Button>

        <DatePicker date={date} onChange={setDate}>
          <Button variant="ghost">
            <TypographyCardTitle>
              {moment(date).format('MMM yyyy')}
            </TypographyCardTitle>
          </Button>
        </DatePicker>

        <Button variant="ghost" size="icon" onClick={handleNextMonth}>
          <ChevronRightIcon className="size-4" />
        </Button>
      </div>

      <div className="flex flex-col gap-2">
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
        <div className="flex flex-col gap-4">
          {/* Categories Pie Chart */}
          <Card>
            <CardHeader className="justify-center">
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
                    defaultIndex={0}
                    content={
                      <ChartTooltipContent
                        formatter={(value, name, item) => {
                          const { idSerialized, category } = item.payload;
                          const isTranslated = t.has(
                            `Common.category.${idSerialized}`,
                          );
                          const amount =
                            typeof value === 'number'
                              ? value
                              : Number(value ?? 0);

                          return (
                            <div className="flex flex-col justify-between">
                              <TypographyLabel>
                                {isTranslated
                                  ? t(`Common.category.${idSerialized}`)
                                  : category}
                              </TypographyLabel>
                              <TypographyLabel className="italic">
                                {formatCurrency({
                                  value: amount,
                                  currency: currency.name,
                                })}
                              </TypographyLabel>
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
                    className="basis-1/4 flex-wrap justify-center gap-1"
                  />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Horizontal Bar Chart */}
          {sortedChartData.length > 0 && (
            <Card>
              <CardHeader className="justify-center">
                <CardTitle>
                  {t('Page.charts.monthly.horizontalBarTitle')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="w-full">
                  <BarChart layout="vertical" data={sortedChartData}>
                    <YAxis
                      type="category"
                      dataKey="idSerialized"
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(value: string) => {
                        const isTranslated = t.has(`Common.category.${value}`);
                        const raw = sortedChartData.find(
                          (d) => d.idSerialized === value,
                        )?.category;
                        return isTranslated
                          ? t(`Common.category.${value}`)
                          : (raw ?? value);
                      }}
                      tick={{ fontSize: 12 }}
                    />
                    <XAxis
                      type="number"
                      axisLine={false}
                      tickLine={false}
                      hide={isMobile}
                      tickFormatter={(value: number) =>
                        formatCurrency({ value, currency: currency.name })
                      }
                      tick={{ fontSize: 11 }}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={
                        <ChartTooltipContent
                          hideIndicator
                          formatter={(value, name, item) => {
                            const { idSerialized, category } = item.payload;
                            const isTranslated = t.has(
                              `Common.category.${idSerialized}`,
                            );
                            const amount =
                              typeof value === 'number'
                                ? value
                                : Number(value ?? 0);

                            return (
                              <div className="flex flex-col justify-between">
                                <TypographyLabel>
                                  {isTranslated
                                    ? t(`Common.category.${idSerialized}`)
                                    : category}
                                </TypographyLabel>
                                <TypographyLabel className="italic">
                                  {formatCurrency({
                                    value: amount,
                                    currency: currency.name,
                                  })}
                                </TypographyLabel>
                              </div>
                            );
                          }}
                          labelFormatter={(value) => value}
                        />
                      }
                    />
                    <Bar dataKey="amount" radius={4} isAnimationActive={false}>
                      {sortedChartData.map((entry, index) => (
                        <Cell
                          key={`bar-cell-${index}`}
                          fill={`var(--chart-${(chartData.indexOf(entry) % 15) + 1})`}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          )}

          {/* Top 5 Categories */}
          {top5ChartData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {t('Page.charts.monthly.topCategoriesTitle')}
                </CardTitle>
                <CardDescription>
                  {t('Page.charts.monthly.topCategoriesDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ol className="flex flex-col gap-3">
                  {top5ChartData.map((item, index) => {
                    const colorIdx = (chartData.indexOf(item) % 15) + 1;
                    const pct =
                      top5MaxAmount > 0
                        ? (item.amount / top5MaxAmount) * 100
                        : 0;
                    const isTranslated = t.has(
                      `Common.category.${item.idSerialized}`,
                    );
                    const label = isTranslated
                      ? t(`Common.category.${item.idSerialized}`)
                      : item.category;
                    const amountLabel = formatCurrency({
                      value: item.amount,
                      currency: currency.name,
                    });
                    const percentageLabel = `${Math.round(pct)}%`;

                    return (
                      <li key={item.id}>
                        <Progress
                          value={pct}
                          style={
                            {
                              '--progress-color': `var(--chart-${colorIdx})`,
                            } as CSSProperties
                          }
                          className="border-border/50 bg-background/80 **:data-[slot=progress-track]:bg-muted w-full rounded-2xl border p-4 shadow-sm **:data-[slot=progress-indicator]:bg-(--progress-color) **:data-[slot=progress-track]:h-2.5"
                        >
                          <div className="flex w-full items-start justify-between gap-3 sm:items-center">
                            <div className="flex min-w-0 items-center gap-3">
                              <div className="bg-muted text-muted-foreground flex size-9 shrink-0 items-center justify-center rounded-full border text-xs font-semibold shadow-sm">
                                {index + 1}
                              </div>

                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <span
                                    className="inline-flex size-2.5 shrink-0 rounded-full"
                                    style={{
                                      backgroundColor: `var(--chart-${colorIdx})`,
                                    }}
                                  />
                                  <ProgressLabel className="block truncate text-sm font-semibold sm:text-base">
                                    {label}
                                  </ProgressLabel>
                                </div>
                              </div>
                            </div>

                            <div className="shrink-0 text-right">
                              <span className="block text-base font-semibold tabular-nums">
                                {amountLabel}
                              </span>
                              <span className="text-muted-foreground text-xs">
                                {percentageLabel}
                              </span>
                            </div>
                          </div>
                        </Progress>
                      </li>
                    );
                  })}
                </ol>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
};

export default Charts;
