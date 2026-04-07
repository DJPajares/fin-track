import { formatCurrency } from '@shared/utilities/formatCurrency';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@web/components/ui/card';
import { Progress } from '@web/components/ui/progress';
import { useTranslations } from 'next-intl';

import { TypographyLabel, TypographyLead } from '../Typography';

type AmountSettledCardProps = {
  totalPaidAmount: number;
  totalAmount: number;
  paymentCompletionRate: number;
  currency: string;
};

const AmountSettledCard = ({
  totalPaidAmount,
  totalAmount,
  paymentCompletionRate,
  currency,
}: AmountSettledCardProps) => {
  const t = useTranslations();

  return (
    <Card className="relative flex flex-col">
      <CardHeader className="px-4">
        <CardDescription>
          {t('Page.home.cards.amountSettled.title')}
        </CardDescription>
        <CardTitle>
          <TypographyLead>
            {formatCurrency({ value: totalPaidAmount, currency })}
          </TypographyLead>
        </CardTitle>
        <CardDescription>
          <TypographyLabel>
            {t('Page.home.cards.amountSettled.outOf', {
              amount: formatCurrency({ value: totalAmount, currency }),
            })}
          </TypographyLabel>
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4">
        <Progress
          aria-label={t('Page.home.cards.amountSettled.title')}
          value={Math.floor(paymentCompletionRate * 100) || 0}
        />
      </CardContent>
    </Card>
  );
};

export default AmountSettledCard;
