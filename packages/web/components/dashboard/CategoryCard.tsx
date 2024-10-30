import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Progress } from '@nextui-org/react';
import CardIcon from '@/components/shared/CardIcon';

import { formatCurrency } from '../../../../shared/utilities/formatCurrency';

import type { TransactionPaymentCategoryProps } from '@/types/TransactionPayment';

type CategoryCardProps = {
  category: TransactionPaymentCategoryProps;
  currency: string;
  handleCardClick: (category: TransactionPaymentCategoryProps) => void;
};

const CategoryCard = ({
  category,
  currency,
  handleCardClick
}: CategoryCardProps) => (
  <Card
    onClick={() => handleCardClick(category)}
    className="bg-gray-100 dark:bg-gray-900 cursor-pointer"
  >
    <CardHeader>
      {/* <CardDescription>{category.name}</CardDescription> */}
      <div className="flex flex-row items-center justify-between gap-4">
        <p className="text-sm text-slate-500 dark:text-slate-400 truncate hover:text-clip">
          {category.name}
        </p>

        {<CardIcon icon={category.icon} />}
      </div>
      <h1 className="text-lg font-bold sm:text-xl sm:font-bold">
        {formatCurrency({
          value: category.totalAmount,
          currency
        })}
      </h1>
    </CardHeader>
    <CardContent>
      <p className="text-xs text-gray-500">Settled</p>

      <div className="flex flex-row items-center pt-2">
        <p className="text-xs pr-2">
          {Math.floor((category.totalPaidAmount / category.totalAmount) * 100)}%
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

export default CategoryCard;
