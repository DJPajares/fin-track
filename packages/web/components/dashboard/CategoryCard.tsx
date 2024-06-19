import {
  Card,
  CardContent,
  CardDescription,
  CardHeader
} from '@/components/ui/card';
import { Progress } from '@nextui-org/progress';
import { formatCurrency } from '../../../../shared/utilities/formatCurrency';
import type { TransactionPaymentCategoryProps } from '../../../../shared/types/transactionPaymentTypes';
import CardIcon from '../shared/CardIcon';

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
      <div className="flex flex-row items-center justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">
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
          color="success"
          aria-label="Loading..."
          value={(category.totalPaidAmount / category.totalAmount) * 100}
          size="sm"
        />
      </div>
    </CardContent>
  </Card>
);

export default CategoryCard;
