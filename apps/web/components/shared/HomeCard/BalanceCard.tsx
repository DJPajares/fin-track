import { Card } from '@heroui/react';
import { formatCurrency } from '@shared/utilities/formatCurrency';
import { Label } from '@web/components/shared/Typography';
import { useTranslations } from 'next-intl';

type BalanceCardProps = {
  balance: number;
  currency: string;
};

const BalanceCard = ({ balance, currency }: BalanceCardProps) => {
  const t = useTranslations();

  return (
    <Card className="relative flex flex-col">
      <Card.Header className="px-4">
        <Card.Description>
          {t('Page.home.cards.balance.title')}
        </Card.Description>
        <Card.Title>
          <Label
            variant="title-xl"
            className={balance >= 0 ? 'text-green-500' : 'text-destructive'}
          >
            {formatCurrency({ value: balance, currency })}
          </Label>
        </Card.Title>
        <Card.Description>
          <Label variant="caption">
            {t('Page.home.cards.balance.description')}
          </Label>
        </Card.Description>
      </Card.Header>
    </Card>
  );
};

export default BalanceCard;
