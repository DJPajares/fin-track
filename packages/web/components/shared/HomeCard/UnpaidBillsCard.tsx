import { useTranslations } from 'next-intl';
import { CheckCircle2Icon } from 'lucide-react';
import CardDialog from '@web/components/shared/CardDialog';
import CardIcon from '@web/components/shared/CardIcon';
import { Label } from '@web/components/ui/label';
import { Badge } from '@web/components/ui/badge';

import type { TransactionPaymentCategoryProps } from '@web/types/TransactionPayment';

type UnpaidBillsCardProps = {
  unpaidCategories: TransactionPaymentCategoryProps[];
};

const UnpaidBillsCard = ({ unpaidCategories }: UnpaidBillsCardProps) => {
  const t = useTranslations();

  return (
    <CardDialog
      className="flex flex-col"
      title={t('Page.home.cards.unpaidBills.title')}
      description={t('Page.home.cards.unpaidBills.description')}
      isExpandable
    >
      {unpaidCategories.length > 0 ? (
        <div className="flex flex-col gap-3">
          {unpaidCategories.map((category) => {
            const isTranslated = t.has(`Common.category.${category.id}`);
            return (
              <div
                key={category._id}
                className="flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2 truncate">
                  <CardIcon icon={category.icon} />
                  <Label variant="caption" className="truncate">
                    {isTranslated
                      ? t(`Common.category.${category.id}`)
                      : category.name}
                  </Label>
                </div>
                <Badge variant="destructive">
                  {Math.floor(category.paymentCompletionRate * 100)}%
                </Badge>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-2 py-4">
          <CheckCircle2Icon className="size-8 text-green-500" />
          <Label variant="caption" className="text-center">
            {t('Page.home.cards.unpaidBills.allSettled')}
          </Label>
        </div>
      )}
    </CardDialog>
  );
};

export default UnpaidBillsCard;
