import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';

import { Checkbox, Progress, Card } from '@heroui/react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';

import { formatCurrency } from '@shared/utilities/formatCurrency';

import type {
  TransactionDataUpdateProps,
  TransactionProps,
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
    transactionData: TransactionDataUpdateProps,
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
  isTotal,
}: CategoryContentProps) => {
  const t = useTranslations();

  const [customPaidAmount, setCustomPaidAmount] = useState(paidAmount);
  const [openDialog, setOpenDialog] = useState(false);

  const paidAmountPercentage = useMemo(() => {
    return customPaidAmount / amount;
  }, [customPaidAmount, amount]);

  const isCompleted = useMemo(() => {
    return Math.floor(paidAmountPercentage) === 1;
  }, [paidAmountPercentage]);

  useEffect(() => {
    setCustomPaidAmount(paidAmount);
  }, [paidAmount]);

  const handleChangeCustomPaidAmountInput = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    setCustomPaidAmount(parseFloat(event.target.value));
  };

  const handleUpdateCustomPaidAmount = () => {
    handleTransactionDataUpdate({
      _id,
      paidAmountPercentage,
      isTotal,
    });

    setOpenDialog(false);
  };

  return (
    <>
      <div className="flex flex-row items-center justify-between gap-2">
        <Card
          className={`${isTotal && 'bg-accent'} ${isCompleted && 'border-primary/20'} m-0 w-full p-4`}
        >
          <div className="flex flex-row items-center justify-center gap-2">
            <Checkbox
              aria-label="category_content"
              isSelected={isCompleted}
              onValueChange={() =>
                handleTransactionDataUpdate({
                  _id,
                  paidAmountPercentage: isCompleted ? 0 : 1,
                  isTotal,
                })
              }
            />

            <div
              className={`${!isTotal && 'cursor-pointer'} flex w-full justify-between`}
              onClick={() => setOpenDialog(!isTotal)}
            >
              <div className="flex-1 space-y-1">
                <p
                  className={`${
                    isTotal
                      ? 'text-lg font-extrabold sm:text-xl sm:font-extrabold'
                      : 'text-base font-bold sm:text-lg sm:font-bold'
                  }`}
                >
                  {name}
                </p>

                <Progress
                  label={label}
                  value={paidAmountPercentage * 100}
                  size="sm"
                  radius="sm"
                  showValueLabel={true}
                  classNames={{
                    label: `${
                      isTotal &&
                      'text-base font-semibold truncate hover:text-clip'
                    }`,
                    value: `${isTotal && 'text-base font-semibold'}`,
                    indicator: 'bg-primary',
                  }}
                />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* DIALOG */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-xs">
          <DialogHeader>
            <DialogTitle>
              {t('Page.dashboard.cardDrawer.content.title')}
            </DialogTitle>
            <DialogDescription>
              {t('Page.dashboard.cardDrawer.content.description')}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <p className="font-semibold sm:text-lg sm:font-bold">{name}</p>

            <div className="space-y-2">
              <Input
                type="number"
                inputMode="decimal"
                defaultValue={customPaidAmount.toFixed(2)}
                max={amount}
                onChange={handleChangeCustomPaidAmountInput}
              />

              <span className="flex flex-row justify-end">
                <p className="text-sm font-medium">
                  {t('Page.dashboard.cardDrawer.content.outOf', {
                    amount: formatCurrency({
                      value: amount,
                      currency: currency.name,
                      decimal: 2,
                    }),
                  })}
                </p>
              </span>
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" onClick={handleUpdateCustomPaidAmount}>
              {t('Common.button.update')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CategoryContent;
