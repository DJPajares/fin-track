import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Progress } from '@nextui-org/progress';
import { formatCurrency } from '../../../../shared/utilities/formatCurrency';
import { CheckIcon } from 'lucide-react';
import type {
  TransactionDataUpdateProps,
  TransactionPaymentCategoryProps
} from '../../../../shared/types/transactionPaymentTypes';

type CategoryDrawerContentProps = {
  category: TransactionPaymentCategoryProps;
  currency: string;
  handleTransactionDataUpdate: (
    transactionData: TransactionDataUpdateProps
  ) => void;
};

const CategoryDrawerContent = ({
  category,
  currency,
  handleTransactionDataUpdate
}: CategoryDrawerContentProps) => (
  <div className="flex flex-col justify-between p-4">
    {Object.keys(category).length > 0 &&
      category.transactions.map((transaction) => (
        <div
          key={transaction._id}
          className="grid grid-cols-6 gap-2 items-center py-1"
        >
          <div className="col-span-2">
            <p className="text-sm sm:text-base sm:font-medium truncate hover:text-clip">
              {transaction.name}
            </p>
          </div>
          <div className="col-span-3">
            <Popover>
              <PopoverTrigger asChild>
                <div className="cursor-pointer">
                  <Progress
                    color="success"
                    label={formatCurrency({
                      value: transaction.amount,
                      currency
                    })}
                    value={Math.floor(
                      (transaction.paidAmount / transaction.amount) * 100
                    )}
                    size="sm"
                    radius="sm"
                    showValueLabel={true}
                  />
                </div>
              </PopoverTrigger>
              <PopoverContent>
                <div className="pb-2">
                  <p className="sm:text-lg font-semibold sm:font-bold">
                    {transaction.name}
                  </p>
                </div>
                <div className="flex flex-row items-end">
                  <div className="pr-2">
                    <Input
                      className="w-30"
                      type="number"
                      defaultValue={transaction.paidAmount.toFixed(2)}
                      max={transaction.amount}
                      onBlur={(e) =>
                        handleTransactionDataUpdate({
                          _id: transaction._id,
                          paidAmount: parseFloat(e.target.value)
                        })
                      }
                    />
                  </div>
                  <p className="text-sm font-medium">{`/ ${formatCurrency({
                    value: transaction.amount,
                    currency
                  })}`}</p>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex flex-row justify-end">
            {Math.floor(transaction.paidAmount / transaction.amount) === 1 ? (
              <Button
                variant="outline"
                size="sm_rounded_icon"
                className="bg-green-600"
              >
                <CheckIcon className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm_rounded_icon"
                onClick={() =>
                  handleTransactionDataUpdate({
                    _id: transaction._id,
                    paidAmount: transaction.amount
                  })
                }
              >
                <CheckIcon className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      ))}
  </div>
);

export default CategoryDrawerContent;
