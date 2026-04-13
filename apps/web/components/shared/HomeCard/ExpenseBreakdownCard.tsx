import { formatCurrency } from '@shared/utilities/formatCurrency';
import { TypographyLabel } from '@web/components/shared/Typography';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
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
import { Cell, Pie, PieChart } from 'recharts';

type ExpenseBreakdownCardProps = {
  expensePieData: ExpensePieDataProps[];
  currency: string;
};

const ExpenseBreakdownCard = ({
  expensePieData,
  currency,
}: ExpenseBreakdownCardProps) => {
  const t = useTranslations();

  const expensePieChartConfig = useMemo((): ChartConfig => {
    return expensePieData.reduce((acc: ChartConfig, item) => {
      acc[item.id] = { label: item.name };
      return acc;
    }, {});
  }, [expensePieData]);

  return (
    <Card className="relative flex flex-col pb-0">
      <CardHeader className="px-4">
        <CardDescription>
          {t('Page.home.cards.expenseBreakdown.title')}
        </CardDescription>
        <CardDescription>
          <TypographyLabel>
            {t('Page.home.cards.expenseBreakdown.description')}
          </TypographyLabel>
        </CardDescription>
      </CardHeader>
      <CardContent className="relative mt-auto flex-1 p-0">
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
              data={expensePieData}
              dataKey="amount"
              nameKey="id"
              innerRadius={30}
              outerRadius={55}
              strokeWidth={3}
              paddingAngle={expensePieData.length > 1 ? 2 : 0}
            >
              {expensePieData.map((_entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={`var(--chart-${(index % 15) + 1})`}
                />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default ExpenseBreakdownCard;
