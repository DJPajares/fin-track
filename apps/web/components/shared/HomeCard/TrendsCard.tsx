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
import type { TrendDataProps } from '@web/types/HomeCard';
import { useTranslations } from 'next-intl';
import { Area, AreaChart } from 'recharts';

type TrendsCardProps = {
  trendsData: TrendDataProps[];
  currency: string;
};

const trendsChartConfig = {
  income: {
    label: 'Income',
    color: 'var(--chart-1)',
  },
  expense: {
    label: 'Expense',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig;

const TrendsCard = ({ trendsData, currency }: TrendsCardProps) => {
  const t = useTranslations();

  return (
    <Card className="pb-0">
      <CardHeader>
        <CardTitle>{t('Page.home.cards.trends.title')}</CardTitle>
        <CardDescription>
          {t('Page.home.cards.trends.description')}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 px-0">
        <ChartContainer
          config={trendsChartConfig}
          className="relative size-full overflow-hidden rounded-xl"
        >
          <AreaChart data={trendsData} margin={{ top: 5 }} className="size-fit">
            <defs>
              <linearGradient id="fillIncome" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--chart-1)"
                  stopOpacity={0.3}
                />
                <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="fillExpense" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--chart-2)"
                  stopOpacity={0.3}
                />
                <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  formatter={(value) =>
                    formatCurrency({
                      value: Number(value),
                      currency,
                    })
                  }
                />
              }
            />
            <Area
              dataKey="income"
              fill="url(#fillIncome)"
              fillOpacity={1}
              stroke="var(--chart-1)"
              strokeWidth={2}
              type="monotone"
              baseValue="dataMin"
            />
            <Area
              dataKey="expense"
              fill="url(#fillExpense)"
              fillOpacity={1}
              stroke="var(--chart-2)"
              strokeWidth={2}
              type="monotone"
              baseValue="dataMin"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default TrendsCard;
