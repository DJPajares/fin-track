import { Card, ProgressBar } from '@heroui/react';
import { formatCurrency } from '@shared/utilities/formatCurrency';
import { Label } from '@web/components/shared/Typography';
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
    <Card className="relative flex flex-col">
      <Card.Header className="px-4">
        <Card.Description>
          {t('Page.home.cards.amountSettled.title')}
        </Card.Description>
        <Card.Title>
          <Label variant="title-xl">
            {formatCurrency({ value: totalPaidAmount, currency })}
          </Label>
        </Card.Title>
        <Card.Description>
          <Label variant="caption">
            {t('Page.home.cards.amountSettled.outOf', {
              amount: formatCurrency({ value: totalAmount, currency }),
            })}
          </Label>
        </Card.Description>
      </Card.Header>
      <Card.Content className="px-4">
        <ProgressBar
          className="w-full"
          aria-label={t('Page.home.cards.amountSettled.title')}
          value={Math.floor(paymentCompletionRate * 100) || 0}
        />
      </Card.Content>
    </Card>
  );
};

export default AmountSettledCard;
