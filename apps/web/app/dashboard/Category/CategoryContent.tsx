import { formatCurrency } from '@shared/utilities/formatCurrency';
import {
  TypographyLabel,
  TypographyMuted,
} from '@web/components/shared/Typography';
import { Button } from '@web/components/ui/button';
import { Card } from '@web/components/ui/card';
import { Checkbox } from '@web/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@web/components/ui/dialog';
import { Input } from '@web/components/ui/input';
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from '@web/components/ui/progress';
import type { DashboardSelectionItemsProps } from '@web/types/Dashboard';
import type {
  TransactionDataUpdateProps,
  TransactionProps,
} from '@web/types/TransactionPayment';
import { useTranslations } from 'next-intl';
import { ChangeEvent, useMemo, useState } from 'react';

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

  const [customPaidAmount, setCustomPaidAmount] = useState(
    paidAmount.toFixed(2),
  );
  const [openDialog, setOpenDialog] = useState(false);

  const currentPaidAmount = useMemo(() => {
    return paidAmount <= amount ? paidAmount : amount;
  }, [amount, paidAmount]);

  const paidAmountProgress = useMemo(() => {
    if (amount <= 0) return 0;
    return Math.min(currentPaidAmount / amount, 1);
  }, [amount, currentPaidAmount]);

  const isCompleted = useMemo(() => {
    return amount > 0 && currentPaidAmount >= amount;
  }, [amount, currentPaidAmount]);

  const paidAmountPercentage = isCompleted
    ? 100
    : Math.floor(paidAmountProgress * 100);

  const customPaidAmountProgress = useMemo(() => {
    const parsed = Number.parseFloat(customPaidAmount);

    if (Number.isNaN(parsed) || amount <= 0) {
      return 0;
    }

    if (parsed < 0) {
      return 0;
    }

    return Math.min(parsed / amount, 1);
  }, [amount, customPaidAmount]);

  const handleChangeCustomPaidAmountInput = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    setCustomPaidAmount(event.target.value);
  };

  const handleUpdateCustomPaidAmount = () => {
    handleTransactionDataUpdate({
      _id,
      paidAmountPercentage: customPaidAmountProgress,
      isTotal,
    });

    setOpenDialog(false);
  };

  return (
    <>
      <div className="flex flex-row items-center justify-between gap-2">
        <Card
          className={`${isTotal && 'bg-secondary/40'} ${isCompleted && 'border-primary/20'} shadow-small m-0 w-full p-4`}
        >
          <div className="flex flex-row items-center justify-center gap-4">
            <Checkbox
              checked={isCompleted}
              onCheckedChange={(checked) =>
                handleTransactionDataUpdate({
                  _id,
                  paidAmountPercentage: checked === true ? 1 : 0,
                  isTotal,
                })
              }
            />

            <div
              className={`${!isTotal && 'cursor-pointer'} flex w-full justify-between`}
              onClick={() => {
                if (!isTotal) {
                  setCustomPaidAmount(paidAmount.toFixed(2));
                  setOpenDialog(true);
                }
              }}
            >
              <div className="flex-1 space-y-1">
                <TypographyLabel className={`${isTotal && 'font-extrabold'}`}>
                  {name}
                </TypographyLabel>
                <Progress value={paidAmountPercentage}>
                  <ProgressLabel>{label}</ProgressLabel>
                  <ProgressValue />
                </Progress>
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

          <div className="flex flex-col gap-2">
            <TypographyLabel>{name}</TypographyLabel>

            <div className="flex flex-col gap-2">
              <Input
                type="number"
                inputMode="decimal"
                value={customPaidAmount}
                max={amount}
                onChange={handleChangeCustomPaidAmountInput}
              />

              <span className="flex flex-row justify-end">
                <TypographyMuted>
                  {t('Page.dashboard.cardDrawer.content.outOf', {
                    amount: formatCurrency({
                      value: amount,
                      currency: currency.name,
                      decimal: 2,
                    }),
                  })}
                </TypographyMuted>
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
