import { formatCurrency } from '@shared/utilities/formatCurrency';
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
  ChartTooltip,
  ChartTooltipContent,
} from '@web/components/ui/chart';
import type { ExpensePieDataProps } from '@web/types/HomeCard';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { Pie, PieChart } from 'recharts';

type ExpenseBreakdownCardProps = {
  expensePieData: ExpensePieDataProps[];
  currency: string;
};

const ExpenseBreakdownCard = ({
  expensePieData,
  currency,
}: ExpenseBreakdownCardProps) => {
  const t = useTranslations();

  const pieDataWithColors = useMemo(() => {
    return expensePieData.map((item, index) => ({
      ...item,
      fill: `var(--chart-${(index % 15) + 1})`,
    }));
  }, [expensePieData]);

  const expensePieChartConfig = useMemo((): ChartConfig => {
    return pieDataWithColors.reduce((acc: ChartConfig, item) => {
      acc[item.id] = { label: item.name };
      return acc;
    }, {});
  }, [pieDataWithColors]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('Page.home.cards.expenseBreakdown.title')}</CardTitle>
        <CardDescription>
          {t('Page.home.cards.expenseBreakdown.description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={expensePieChartConfig}
          className="mx-auto aspect-square max-h-40"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  formatter={(value, name) => {
                    const isTranslated = t.has(
                      `Common.category.${String(name)}`,
                    );
                    const label = isTranslated
                      ? t(`Common.category.${String(name)}`)
                      : String(name);
                    return `${label}: ${formatCurrency({
                      value: Number(value),
                      currency,
                    })}`;
                  }}
                  hideIndicator
                />
              }
            />
            <Pie
              data={pieDataWithColors}
              dataKey="amount"
              nameKey="id"
              innerRadius={30}
              outerRadius={55}
              strokeWidth={3}
              paddingAngle={pieDataWithColors.length > 1 ? 2 : 0}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default ExpenseBreakdownCard;
