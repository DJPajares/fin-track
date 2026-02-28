import { useTranslations } from 'next-intl';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@web/components/ui/card';
import { Label } from '@web/components/ui/label';
import { Progress } from '@web/components/ui/progress';

import { formatCurrency } from '@shared/utilities/formatCurrency';

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
          <Label variant="title-xl">
            {formatCurrency({ value: totalPaidAmount, currency })}
          </Label>
        </CardTitle>
        <CardDescription>
          <Label variant="caption">
            {t('Page.home.cards.amountSettled.outOf', {
              amount: formatCurrency({ value: totalAmount, currency }),
            })}
          </Label>
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4">
        <Progress value={Math.floor(paymentCompletionRate * 100) || 0} />
      </CardContent>
    </Card>
  );
};

export default AmountSettledCard;
