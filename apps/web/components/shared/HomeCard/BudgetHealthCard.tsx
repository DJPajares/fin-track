import { CircularProgress } from '@heroui/react';
import { Badge } from 'apps/web/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from 'apps/web/components/ui/card';
import { Label } from 'apps/web/components/ui/label';
import { useTranslations } from 'next-intl';
import { formatCurrency } from 'packages/shared/utilities/formatCurrency';
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
    <Card className="relative flex flex-col">
      <CardHeader className="px-4">
        <CardDescription>
          {t('Page.home.cards.budgetHealth.title')}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-3 px-4">
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
        <div className="flex w-full flex-col gap-4">
          <Badge variant={badgeVariant} className="w-fit self-center">
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
      </CardContent>
    </Card>
  );
};

export default BudgetHealthCard;
