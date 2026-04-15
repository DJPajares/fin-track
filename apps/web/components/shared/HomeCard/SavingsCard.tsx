import { formatCurrency } from '@shared/utilities/formatCurrency';
import { TypographySectionTitle } from '@web/components/shared/Typography';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@web/components/ui/card';
import { ChartConfig, ChartContainer } from '@web/components/ui/chart';
import type { PreviousSavingsProps } from '@web/types/HomeCard';
import { useTranslations } from 'next-intl';
import { Area, AreaChart } from 'recharts';

type SavingsCardProps = {
  accumulativeSavings: number;
  previousSavings: PreviousSavingsProps[];
  currency: string;
};

const previousSavingsChartConfig = {
  amount: {
    label: 'Amount',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig;

const SavingsCard = ({
  accumulativeSavings,
  previousSavings,
  currency,
}: SavingsCardProps) => {
  const t = useTranslations();

  return (
    <Card className="pb-0">
      <CardHeader>
        <CardTitle>{t('Page.home.cards.savings.title')}</CardTitle>
        <CardTitle>
          <TypographySectionTitle>
            {formatCurrency({
              value: accumulativeSavings,
              currency,
            })}
          </TypographySectionTitle>
        </CardTitle>
        <CardDescription>
          {t('Page.home.cards.savings.description')}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 px-0">
        <ChartContainer
          config={previousSavingsChartConfig}
          className="relative size-full overflow-hidden rounded-xl"
        >
          <AreaChart
            data={previousSavings}
            margin={{ top: 5 }}
            className="size-fit"
          >
            <defs>
              <linearGradient id="fillAmount" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--chart-1)"
                  stopOpacity={0.3}
                />
                <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              dataKey="amount"
              fill="url(#fillAmount)"
              fillOpacity={1}
              stroke="var(--chart-1)"
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

export default SavingsCard;
