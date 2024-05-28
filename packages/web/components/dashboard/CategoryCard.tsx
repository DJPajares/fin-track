import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { formatCurrency } from '../../../../shared/utilities/formatCurrency';
import { Progress } from '@nextui-org/progress';
import type { TransactionPaymentCategoryProps } from '../../../../shared/types/transactionPaymentTypes';

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
  <Card onClick={() => handleCardClick(category)} className="cursor-pointer">
    <CardHeader>
      <CardDescription>{category.name}</CardDescription>
      {/* <CardTitle>
        {formatCurrency({
          value: category.totalAmount,
          currency
        })}
      </CardTitle> */}
      {/* <p className="text-sm">{category.name}</p> */}
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
