import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from 'apps/web/components/ui/card';
import { Label } from 'apps/web/components/ui/label';
import { useTranslations } from 'next-intl';
import { formatCurrency } from 'packages/shared/utilities/formatCurrency';

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
          <Label
            variant="title-xl"
            className={balance >= 0 ? 'text-green-500' : 'text-destructive'}
          >
            {formatCurrency({ value: balance, currency })}
          </Label>
        </CardTitle>
        <CardDescription>
          <Label variant="caption">
            {t('Page.home.cards.balance.description')}
          </Label>
        </CardDescription>
      </CardHeader>
    </Card>
  );
};

export default BalanceCard;
