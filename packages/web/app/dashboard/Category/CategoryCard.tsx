import { Card } from '../../../components/ui/card';
import CardIcon from '../../../components/shared/CardIcon';
import { Progress } from '@heroui/react';

import { formatCurrency } from '@shared/utilities/formatCurrency';

import { useTranslations } from 'next-intl';

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
          <p className="text-muted-foreground truncate text-sm tracking-wide hover:text-clip">
            {category.name}
          </p>

          {
            <CardIcon
              icon={category.icon}
              className="text-muted-foreground size-5 sm:h-6 sm:w-6"
            />
          }
        </div>

        <h1 className="text-lg font-bold sm:text-xl sm:font-bold">
          {formatCurrency({
            value: category.totalAmount,
            currency,
          })}
        </h1>
      </div>

      <div className="flex flex-col justify-between gap-4">
        <span>
          <p className="text-muted-foreground text-xs">{t('settled')}</p>

          <div className="flex flex-row items-center pt-2">
            <p className="pr-2 text-xs">
              {Math.floor(
                (category.totalPaidAmount / category.totalAmount) * 100,
              )}
              %
            </p>
            <Progress
              aria-label="Loading..."
              value={(category.totalPaidAmount / category.totalAmount) * 100}
              classNames={{
                indicator: 'bg-primary',
              }}
              size="sm"
            />
          </div>
        </span>
      </div>
    </Card>
  );
};

export default CategoryCard;
