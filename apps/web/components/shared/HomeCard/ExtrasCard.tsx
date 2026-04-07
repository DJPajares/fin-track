import { formatCurrency } from '@shared/utilities/formatCurrency';
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

import { TypographyLabel, TypographyLead } from '../Typography';

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
      <CardHeader className="px-4">
        <CardDescription>{t('Page.home.cards.extras.title')}</CardDescription>
        <CardTitle>
          <TypographyLead>
            {formatCurrency({
              value: accumulativeExtra,
              currency,
            })}
          </TypographyLead>
        </CardTitle>
        <CardDescription>
          <TypographyLabel>
            {t('Page.home.cards.extras.description')}
          </TypographyLabel>
        </CardDescription>
      </CardHeader>
      <CardContent className="relative mt-auto flex-1 p-0">
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
