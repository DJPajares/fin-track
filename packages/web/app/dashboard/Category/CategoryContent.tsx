import { KeyboardEvent, useState } from 'react';
import { useTranslations } from 'next-intl';

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
import { Separator } from '@web/components/ui/separator';

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
  const t = useTranslations('Page.dashboard.cardDrawer');

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
    <div className="flex flex-row justify-between items-center space-x-4">
      <div className="flex-1 space-y-1">
        <p
          className={`${
            isTotal
              ? 'text-lg sm:text-xl font-bold sm:font-extrabold'
              : 'text-base sm:text-lg font-semibold sm:font-bold'
          }`}
        >
          {name}
        </p>

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
                  label: `${
                    isTotal && 'text-base font-bold truncate hover:text-clip'
                  }`,
                  value: `${isTotal && 'text-base font-bold'}`,
                  indicator: 'bg-primary'
                }}
              />
            </div>
          </PopoverTrigger>
          <PopoverContent className="space-y-4">
            <p className="sm:text-lg font-semibold sm:font-bold">{name}</p>

            <div className="space-y-2">
              <span className="flex flex-row justify-end">
                <p className="text-xs">{`(${t('settleLabel')})`}</p>
              </span>

              <Input
                type="number"
                inputMode="decimal"
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

              <span className="flex flex-row justify-end">
                <p className="text-sm font-medium">
                  {t('outOf', {
                    amount: formatCurrency({
                      value: amount,
                      currency: currency.name,
                      decimal: 2
                    })
                  })}
                </p>
              </span>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div>
        <Separator />
      </div>

      <div>
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
    </div>
  );
};

export default CategoryContent;
