import { KeyboardEvent, useState } from 'react';
import { Button } from '../../../components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '../../../components/ui/popover';
import { Input } from '../../../components/ui/input';
import { Progress } from '@nextui-org/react';
import { CheckIcon } from 'lucide-react';

import { formatCurrency } from '@shared/utilities/formatCurrency';

import type {
  TransactionDataUpdateProps,
  TransactionProps
} from '../../../types/TransactionPayment';
import type { DashboardSelectionItemsProps } from '../../../types/Dashboard';

type PartialTransactionProps = Pick<
  TransactionProps,
  '_id' | 'name' | 'amount' | 'paidAmount'
>;

type CategoryContentProps = PartialTransactionProps & {
  label: string;
  currency: DashboardSelectionItemsProps;
  handleTransactionDataUpdate: (
    transactionData: TransactionDataUpdateProps
  ) => void;
  isTotal?: boolean;
};

const CategoryContent = ({
  _id,
  name,
  label,
  amount,
  paidAmount,
  currency,
  handleTransactionDataUpdate,
  isTotal
}: CategoryContentProps) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const isCompleted = Math.floor(paidAmount / amount) === 1;

  const handleKeyboardEvent = (event: KeyboardEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;

    if (event.key === 'Enter' || event.keyCode === 13) {
      handleTransactionDataUpdate({
        _id,
        paidAmount: parseFloat(target.value)
      });

      setIsPopoverOpen(false);
    }
  };

  return (
    <>
      <span className="col-span-2">
        <p
          className={`${
            isTotal
              ? 'text-base sm:text-lg font-semibold sm:font-bold'
              : 'text-sm sm:text-base sm:font-medium'
          } truncate hover:text-clip`}
        >
          {name}
        </p>
      </span>

      <div className="col-span-3">
        <Popover
          open={!isTotal && isPopoverOpen}
          onOpenChange={setIsPopoverOpen}
        >
          <PopoverTrigger asChild>
            <div className="cursor-pointer">
              <Progress
                label={label}
                value={Math.floor((paidAmount / amount) * 100)}
                size="sm"
                radius="sm"
                showValueLabel={true}
                classNames={{
                  label: `${isTotal && 'text-base font-bold'}`,
                  value: `${isTotal && 'text-base font-bold'}`,
                  indicator: 'bg-primary'
                }}
              />
            </div>
          </PopoverTrigger>
          <PopoverContent>
            <span className="pb-2">
              <p className="sm:text-lg font-semibold sm:font-bold">{name}</p>
            </span>
            <div className="flex flex-row items-end">
              <div className="pr-2">
                <Input
                  className="w-30"
                  type="number"
                  defaultValue={paidAmount.toFixed(2)}
                  max={amount}
                  onBlur={(event) =>
                    handleTransactionDataUpdate({
                      _id,
                      paidAmount: parseFloat(event.target.value)
                    })
                  }
                  onKeyDown={(event) => handleKeyboardEvent(event)}
                />
              </div>
              <p className="text-sm font-medium">{`/ ${formatCurrency({
                value: amount,
                currency: currency.name,
                decimal: 2
              })}`}</p>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex flex-row justify-end">
        <Button
          variant="outline"
          size="xs_rounded_icon"
          className={`${isCompleted && 'bg-primary text-primary-foreground'}`}
          onClick={() =>
            handleTransactionDataUpdate({
              _id,
              paidAmount: isCompleted ? 0 : amount
            })
          }
        >
          <CheckIcon className="h-4 w-4" />
        </Button>
      </div>
    </>
  );
};

export default CategoryContent;
