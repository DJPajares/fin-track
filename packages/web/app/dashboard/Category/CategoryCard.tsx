import { useTranslations } from 'next-intl';
import { Progress } from '@heroui/react';
import { Card } from '../../../components/ui/card';
import CardIcon from '../../../components/shared/CardIcon';
import { Label } from '../../../components/ui/label';

import { formatCurrency } from '@shared/utilities/formatCurrency';

import type { TransactionPaymentCategoryProps } from '../../../types/TransactionPayment';

type CategoryCardProps = {
  category: TransactionPaymentCategoryProps;
  currency: string;
  handleCardClick: (category: TransactionPaymentCategoryProps) => void;
};

const CategoryCard = ({
  category,
  currency,
  handleCardClick,
}: CategoryCardProps) => {
  const t = useTranslations('Page.dashboard.card');

  return (
    <Card
      onClick={() => handleCardClick(category)}
      className="flex h-44 cursor-pointer flex-col justify-between gap-2 p-5 sm:h-56 sm:p-8"
    >
      <div className="flex flex-col gap-3">
        <div className="flex flex-row items-center justify-between">
          <Label
            variant="caption"
            className="text-muted-foreground truncate tracking-wide hover:text-clip"
          >
            {category.name}
          </Label>

          {
            <CardIcon
              icon={category.icon}
              className="text-muted-foreground size-5 sm:h-6 sm:w-6"
            />
          }
        </div>

        <Label variant="title">
          {formatCurrency({
            value: category.totalAmount,
            currency,
          })}
        </Label>
      </div>

      <div className="flex flex-col justify-between gap-2">
        <Label variant="caption" className="text-muted-foreground">
          {t('settled')}
        </Label>

        <div className="flex flex-row items-center gap-2">
          <Label variant="caption">
            {Math.floor(
              (category.totalPaidAmount / category.totalAmount) * 100,
            )}
            %
          </Label>
          <Progress
            aria-label="Loading..."
            value={(category.totalPaidAmount / category.totalAmount) * 100}
            classNames={{
              indicator: 'bg-primary',
            }}
            size="sm"
          />
        </div>
      </div>
    </Card>
  );
};

export default CategoryCard;
