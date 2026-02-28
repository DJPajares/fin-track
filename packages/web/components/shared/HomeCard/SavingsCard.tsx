import { useTranslations } from 'next-intl';
import { Area, AreaChart } from 'recharts';
import { ChartConfig, ChartContainer } from '@web/components/ui/chart';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@web/components/ui/card';
import { Label } from '@web/components/ui/label';

import { formatCurrency } from '@shared/utilities/formatCurrency';

import type { PreviousSavingsProps } from '@web/types/HomeCard';

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
    <Card className="relative flex flex-col pb-0">
      <CardHeader className="px-4">
        <CardDescription>{t('Page.home.cards.savings.title')}</CardDescription>
        <CardTitle>
          <Label variant="title-xl">
            {formatCurrency({
              value: accumulativeSavings,
              currency,
            })}
          </Label>
        </CardTitle>
        <CardDescription>
          <Label variant="caption">
            {t('Page.home.cards.savings.description')}
          </Label>
        </CardDescription>
      </CardHeader>
      <CardContent className="relative mt-auto flex-1 p-0">
        <ChartContainer
          config={previousSavingsChartConfig}
          className="relative size-full overflow-hidden rounded-xl"
        >
          <AreaChart
            data={previousSavings}
            margin={{ top: 5 }}
            className="size-fit"
          >
            <Area
              dataKey="amount"
              fill="var(--chart-1)"
              fillOpacity={0.1}
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
