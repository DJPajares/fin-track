import { formatCurrency } from '@shared/utilities/formatCurrency';
import { TypographySectionTitle } from '@web/components/shared/Typography';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@web/components/ui/card';
import { Progress } from '@web/components/ui/progress';
import { useTranslations } from 'next-intl';

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
    <Card>
      <CardHeader>
        <CardTitle>{t('Page.home.cards.amountSettled.title')}</CardTitle>
        <CardTitle>
          <TypographySectionTitle>
            {formatCurrency({ value: totalPaidAmount, currency })}
          </TypographySectionTitle>
        </CardTitle>
        <CardDescription>
          {t('Page.home.cards.amountSettled.outOf', {
            amount: formatCurrency({ value: totalAmount, currency }),
          })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Progress
          aria-label={t('Page.home.cards.amountSettled.title')}
          value={Math.floor(paymentCompletionRate * 100) || 0}
        />
      </CardContent>
    </Card>
  );
};

export default AmountSettledCard;
