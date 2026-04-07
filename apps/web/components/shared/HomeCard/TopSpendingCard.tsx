import { formatCurrency } from '@shared/utilities/formatCurrency';
import CardIcon from '@web/components/shared/CardIcon';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@web/components/ui/card';
import { Progress } from '@web/components/ui/progress';
import type { TransactionPaymentCategoryProps } from '@web/types/TransactionPayment';
import { useTranslations } from 'next-intl';

import { TypographyLabel } from '../Typography';

type TopSpendingCardProps = {
  topSpendingCategories: TransactionPaymentCategoryProps[];
  currency: string;
};

const TopSpendingCard = ({
  topSpendingCategories,
  currency,
}: TopSpendingCardProps) => {
  const t = useTranslations();

  return (
    <Card className="relative flex flex-col">
      <CardHeader className="px-4">
        <CardDescription>
          {t('Page.home.cards.topSpending.title')}
        </CardDescription>
        <CardDescription>
          <TypographyLabel>
            {t('Page.home.cards.topSpending.description')}
          </TypographyLabel>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 px-4">
        {topSpendingCategories.map((category) => {
          const isTranslated = t.has(`Common.category.${category.id}`);
          return (
            <div key={category._id} className="flex flex-col gap-1">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 truncate">
                  <CardIcon icon={category.icon} />
                  <TypographyLabel className="truncate">
                    {isTranslated
                      ? t(`Common.category.${category.id}`)
                      : category.name}
                  </TypographyLabel>
                </div>
                <TypographyLabel className="shrink-0">
                  {formatCurrency({
                    value: category.totalAmount,
                    currency,
                  })}
                </TypographyLabel>
              </div>
              <Progress
                aria-label={
                  isTranslated
                    ? t(`Common.category.${category.id}`)
                    : category.name
                }
                value={category.paymentCompletionRate * 100}
              />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default TopSpendingCard;
