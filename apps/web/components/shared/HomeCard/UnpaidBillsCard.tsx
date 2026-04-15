import CardDialog from '@web/components/shared/CardDialog';
import CardIcon from '@web/components/shared/CardIcon';
import { TypographyLabel } from '@web/components/shared/Typography';
import { Badge } from '@web/components/ui/badge';
import type { TransactionPaymentCategoryProps } from '@web/types/TransactionPayment';
import { CheckCircle2Icon } from 'lucide-react';
import { useTranslations } from 'next-intl';

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
                <div className="flex min-w-0 flex-row items-center gap-2">
                  <CardIcon className="shrink-0" icon={category.icon} />
                  <TypographyLabel className="truncate">
                    {isTranslated
                      ? t(`Common.category.${category.id}`)
                      : category.name}
                  </TypographyLabel>
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
          <TypographyLabel className="text-center">
            {t('Page.home.cards.unpaidBills.allSettled')}
          </TypographyLabel>
        </div>
      )}
    </CardDialog>
  );
};

export default UnpaidBillsCard;
