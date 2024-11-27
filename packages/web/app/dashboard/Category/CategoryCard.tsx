import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Progress } from '@nextui-org/react';
import CardIcon from '@/components/shared/CardIcon';

import { formatCurrency } from '../../../../../shared/utilities/formatCurrency';

import type { TransactionPaymentCategoryProps } from '@/types/TransactionPayment';
import { useTranslations } from 'next-intl';

type CategoryCardProps = {
  category: TransactionPaymentCategoryProps;
  currency: string;
  handleCardClick: (category: TransactionPaymentCategoryProps) => void;
};

const CategoryCard = ({
  category,
  currency,
  handleCardClick
}: CategoryCardProps) => {
  const t = useTranslations('Page.dashboard.card');

  return (
    <Card
      onClick={() => handleCardClick(category)}
      className="bg-accent/70 cursor-pointer"
    >
      <CardHeader>
        <div className="flex flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground truncate hover:text-clip">
            {category.name}
          </p>

          {
            <CardIcon
              icon={category.icon}
              className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground"
            />
          }
        </div>
        <h1 className="text-lg font-bold sm:text-xl sm:font-bold">
          {formatCurrency({
            value: category.totalAmount,
            currency
          })}
        </h1>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground">{t('settled')}</p>

        <div className="flex flex-row items-center pt-2">
          <p className="text-xs pr-2">
            {Math.floor(
              (category.totalPaidAmount / category.totalAmount) * 100
            )}
            %
          </p>
          <Progress
            aria-label="Loading..."
            value={(category.totalPaidAmount / category.totalAmount) * 100}
            classNames={{
              indicator: 'bg-primary'
            }}
            size="sm"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryCard;
