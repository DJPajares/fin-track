import { formatCurrency } from '@shared/utilities/formatCurrency';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@web/components/ui/card';
import { useTranslations } from 'next-intl';

import { TypographyLabel, TypographyLead } from '../Typography';

type BalanceCardProps = {
  balance: number;
  currency: string;
};

const BalanceCard = ({ balance, currency }: BalanceCardProps) => {
  const t = useTranslations();

  return (
    <Card className="relative flex flex-col">
      <CardHeader className="px-4">
        <CardDescription>{t('Page.home.cards.balance.title')}</CardDescription>
        <CardTitle>
          <TypographyLead
            className={balance >= 0 ? 'text-green-500' : 'text-destructive'}
          >
            {formatCurrency({ value: balance, currency })}
          </TypographyLead>
        </CardTitle>
        <CardDescription>
          <TypographyLabel>
            {t('Page.home.cards.balance.description')}
          </TypographyLabel>
        </CardDescription>
      </CardHeader>
    </Card>
  );
};

export default BalanceCard;
