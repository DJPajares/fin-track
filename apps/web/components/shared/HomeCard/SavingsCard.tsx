import { Card } from '@heroui/react';
import { formatCurrency } from '@shared/utilities/formatCurrency';
import { Label } from '@web/components/shared/Typography';
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
    <Card className="relative flex flex-col pb-0">
      <Card.Header className="px-4">
        <Card.Description>
          {t('Page.home.cards.savings.title')}
        </Card.Description>
        <Card.Title>
          <Label variant="title-xl">
            {formatCurrency({
              value: accumulativeSavings,
              currency,
            })}
          </Label>
        </Card.Title>
        <Card.Description>
          <Label variant="caption">
            {t('Page.home.cards.savings.description')}
          </Label>
        </Card.Description>
      </Card.Header>
      <Card.Content className="relative mt-auto flex-1 p-0">
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
      </Card.Content>
    </Card>
  );
};

export default SavingsCard;
