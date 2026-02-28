import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { CircularProgress } from '@heroui/react';
import CardDialog from '@web/components/shared/CardDialog';
import { Label } from '@web/components/ui/label';

import { formatCurrency } from '@shared/utilities/formatCurrency';

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

  return (
    <CardDialog
      className="flex flex-col items-center justify-center"
      isExpandable
    >
      <div className="flex flex-col items-center gap-1">
        <CircularProgress
          classNames={{
            svg: 'size-24 drop-shadow-md',
            value: 'text-2xl font-semibold',
            indicator:
              budgetHealthColor === 'success'
                ? 'stroke-green-500'
                : budgetHealthColor === 'warning'
                  ? 'stroke-yellow-500'
                  : 'stroke-destructive',
            label: 'text-center font-extralight tracking-wider',
          }}
          label={t('Page.home.cards.budgetHealth.title')}
          value={Math.min(budgetUtilization, 100)}
          strokeWidth={3}
          showValueLabel={true}
        />
        <Label variant="caption" className="block text-center">
          {budgetHealthLabel}
        </Label>
        <Label
          variant="caption"
          className="text-muted-foreground block text-center"
        >
          {t('Page.home.cards.budgetHealth.description')}
        </Label>
        <Label
          variant="caption"
          className="text-muted-foreground block text-center"
        >
          {t('Page.home.cards.budgetHealth.used', {
            spent: formatCurrency({ value: totalAmount, currency }),
            budget: formatCurrency({ value: budget, currency }),
          })}
        </Label>
        <Label
          variant="caption"
          className={`block text-center ${remaining >= 0 ? 'text-green-500' : 'text-destructive'}`}
        >
          {t('Page.home.cards.budgetHealth.remaining', {
            amount: formatCurrency({
              value: Math.abs(remaining),
              currency,
            }),
          })}
        </Label>
      </div>
    </CardDialog>
  );
};

export default BudgetHealthCard;
