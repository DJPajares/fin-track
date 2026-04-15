import { formatCurrency } from '@shared/utilities/formatCurrency';
import { TypographySectionTitle } from '@web/components/shared/Typography';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@web/components/ui/card';
import { useTranslations } from 'next-intl';

type BalanceCardProps = {
  balance: number;
  currency: string;
};

const BalanceCard = ({ balance, currency }: BalanceCardProps) => {
  const t = useTranslations();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('Page.home.cards.balance.title')}</CardTitle>
        <CardTitle>
          <TypographySectionTitle
            className={balance >= 0 ? 'text-green-500' : 'text-destructive'}
          >
            {formatCurrency({ value: balance, currency })}
          </TypographySectionTitle>
        </CardTitle>
        <CardDescription>
          {t('Page.home.cards.balance.description')}
        </CardDescription>
      </CardHeader>
    </Card>
  );
};

export default BalanceCard;
