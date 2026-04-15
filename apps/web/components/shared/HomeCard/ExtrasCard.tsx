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
    <Card className="pb-0">
      <CardHeader>
        <CardTitle>{t('Page.home.cards.extras.title')}</CardTitle>
        <CardTitle>
          <TypographySectionTitle>
            {formatCurrency({
              value: accumulativeExtra,
              currency,
            })}
          </TypographySectionTitle>
        </CardTitle>
        <CardDescription>
          {t('Page.home.cards.extras.description')}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 px-0">
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
      </CardContent>
    </Card>
  );
};

export default ExtrasCard;
