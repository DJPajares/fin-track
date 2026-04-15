import { CircularProgress } from '@heroui/react';
import { formatCurrency } from '@shared/utilities/formatCurrency';
import { TypographyCaption } from '@web/components/shared/Typography';
import { Badge } from '@web/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@web/components/ui/card';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

type BudgetHealthCardProps = {
  budget: number;
  totalAmount: number;
  currency: string;
};

const BudgetHealthCard = ({
  budget,
  totalAmount,
  currency,
}: BudgetHealthCardProps) => {
  const t = useTranslations();

  const budgetUtilization = useMemo(() => {
    if (budget === 0) return 0;
    return Math.round((totalAmount / budget) * 100);
  }, [budget, totalAmount]);

  const budgetHealthColor = useMemo(() => {
    if (budgetUtilization > 100) return 'danger';
    if (budgetUtilization >= 80) return 'warning';
    return 'success';
  }, [budgetUtilization]);

  const budgetHealthLabel = useMemo(() => {
    if (budgetUtilization > 100) return t('Page.home.cards.budgetHealth.over');
    if (budgetUtilization >= 80)
      return t('Page.home.cards.budgetHealth.warning');
    return t('Page.home.cards.budgetHealth.good');
  }, [budgetUtilization, t]);

  const remaining = budget - totalAmount;

  const badgeVariant =
    budgetHealthColor === 'danger' ? 'destructive' : 'secondary';

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('Page.home.cards.budgetHealth.title')}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col items-center gap-2">
          <CircularProgress
            aria-label={t('Page.home.cards.budgetHealth.title')}
            classNames={{
              svg: 'size-16 drop-shadow-md',
              value: 'text-base font-semibold',
              indicator:
                budgetHealthColor === 'success'
                  ? 'stroke-green-500'
                  : budgetHealthColor === 'warning'
                    ? 'stroke-yellow-500'
                    : 'stroke-destructive',
            }}
            value={Math.min(budgetUtilization, 100)}
            strokeWidth={3}
            showValueLabel={true}
          />
          <Badge variant={badgeVariant} className="w-fit self-center">
            {budgetHealthLabel}
          </Badge>
        </div>
        <div className="flex flex-col gap-1">
          <TypographyCaption>
            {t('Page.home.cards.budgetHealth.used', {
              spent: formatCurrency({ value: totalAmount, currency }),
              budget: formatCurrency({ value: budget, currency }),
            })}
          </TypographyCaption>
          <TypographyCaption
            className={remaining >= 0 ? 'text-green-500' : 'text-destructive'}
          >
            {t('Page.home.cards.budgetHealth.remaining', {
              amount: formatCurrency({
                value: Math.abs(remaining),
                currency,
              }),
            })}
          </TypographyCaption>
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetHealthCard;
