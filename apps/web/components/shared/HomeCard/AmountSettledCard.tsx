import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from 'apps/web/components/ui/card';
import { Label } from 'apps/web/components/ui/label';
import { Progress } from 'apps/web/components/ui/progress';
import { useTranslations } from 'next-intl';
import { formatCurrency } from 'packages/shared/utilities/formatCurrency';

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
        <Progress
          aria-label={t('Page.home.cards.amountSettled.title')}
          value={Math.floor(paymentCompletionRate * 100) || 0}
        />
      </CardContent>
    </Card>
  );
};

export default AmountSettledCard;
