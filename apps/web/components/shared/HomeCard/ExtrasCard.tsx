import { Card } from '@heroui/react';
import { formatCurrency } from '@shared/utilities/formatCurrency';
import { Label } from '@web/components/shared/Typography';
import { ChartConfig, ChartContainer } from '@web/components/ui/chart';
import type { UpcomingExtraProps } from '@web/types/HomeCard';
import { TrendingUpIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Area, AreaChart } from 'recharts';

type ExtrasCardProps = {
  accumulativeExtra: number;
  upcomingExtras: UpcomingExtraProps[];
  currency: string;
};

const upcomingExtraChartConfig = {
  extra: {
    label: 'Extra',
    color: 'var(--chart-1)',
    icon: TrendingUpIcon,
  },
} satisfies ChartConfig;

const ExtrasCard = ({
  accumulativeExtra,
  upcomingExtras,
  currency,
}: ExtrasCardProps) => {
  const t = useTranslations();

  return (
    <Card className="relative flex flex-col pb-0">
      <Card.Header className="px-4">
        <Card.Description>{t('Page.home.cards.extras.title')}</Card.Description>
        <Card.Title>
          <Label variant="title-xl">
            {formatCurrency({
              value: accumulativeExtra,
              currency,
            })}
          </Label>
        </Card.Title>
        <Card.Description>
          <Label variant="caption">
            {t('Page.home.cards.extras.description')}
          </Label>
        </Card.Description>
      </Card.Header>
      <Card.Content className="relative mt-auto flex-1 p-0">
        <ChartContainer
          config={upcomingExtraChartConfig}
          className="relative size-full overflow-hidden rounded-xl"
        >
          <AreaChart
            data={upcomingExtras}
            margin={{ top: 5 }}
            className="size-fit"
          >
            <Area
              dataKey="extra"
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

export default ExtrasCard;
