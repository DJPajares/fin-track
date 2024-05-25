import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { formatCurrency } from '../../../../shared/utilities/formatCurrency';
import { Progress } from '@nextui-org/progress';
import { TransactionPaymentCategoryProps } from '../../../../shared/types/transactionPaymentTypes';

type CategoryCardProps = {
  categories: any;
  currency: string;
  handleCardClick: (category: TransactionPaymentCategoryProps) => void;
};

const CategoryCard = ({
  categories,
  currency,
  handleCardClick
}: CategoryCardProps) =>
  categories.map((category: TransactionPaymentCategoryProps) => (
    <div className="p-5" key={category._id}>
      <Card
        onClick={() => handleCardClick(category)}
        className="cursor-pointer"
      >
        <CardHeader>
          <CardDescription>{category.name}</CardDescription>
          <CardTitle>
            {formatCurrency({
              value: category.totalAmount,
              currency
            })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-gray-500">Settled</p>

          <div className="flex flex-row items-center pt-2">
            <p className="text-xs pr-2">
              {Math.floor(
                (category.totalPaidAmount / category.totalAmount) * 100
              )}
              %
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
    </div>
  ));

export default CategoryCard;
