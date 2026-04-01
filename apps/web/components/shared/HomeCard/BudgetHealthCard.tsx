import { Badge, Card, ProgressCircle } from '@heroui/react';
import { formatCurrency } from '@shared/utilities/formatCurrency';
import { Label } from '@web/components/shared/Typography';
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

  const badgeVariant = budgetHealthColor === 'danger' ? 'danger' : 'default';

  return (
    <Card className="relative flex flex-col">
      <Card.Header className="px-4">
        <Card.Description>
          {t('Page.home.cards.budgetHealth.title')}
        </Card.Description>
      </Card.Header>
      <Card.Content className="flex flex-col items-center gap-3 px-4">
        <ProgressCircle
          aria-label={t('Page.home.cards.budgetHealth.title')}
          className="size-16 drop-shadow-md"
          value={Math.min(budgetUtilization, 100)}
        />
        <div className="flex w-full flex-col gap-4">
          <Badge color={badgeVariant} className="w-fit self-center">
            {budgetHealthLabel}
          </Badge>

          <div className="flex w-full flex-col">
            <Label variant="caption" className="text-muted-foreground">
              {t('Page.home.cards.budgetHealth.used', {
                spent: formatCurrency({ value: totalAmount, currency }),
                budget: formatCurrency({ value: budget, currency }),
              })}
            </Label>
            <Label
              variant="caption"
              className={remaining >= 0 ? 'text-green-500' : 'text-destructive'}
            >
              {t('Page.home.cards.budgetHealth.remaining', {
                amount: formatCurrency({
                  value: Math.abs(remaining),
                  currency,
                }),
              })}
            </Label>
          </div>
        </div>
      </Card.Content>
    </Card>
  );
};

export default BudgetHealthCard;
