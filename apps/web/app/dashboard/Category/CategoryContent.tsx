import {
  Button,
  Card,
  Checkbox,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalHeading,
  ProgressBar,
} from '@heroui/react';
import { formatCurrency } from '@shared/utilities/formatCurrency';
import { Label } from '@web/components/shared/Typography';
import { useTranslations } from 'next-intl';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';

import type { DashboardSelectionItemsProps } from '../../../types/Dashboard';
import type {
  TransactionDataUpdateProps,
  TransactionProps,
} from '../../../types/TransactionPayment';

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

  const paidAmountProgress = useMemo(() => {
    return customPaidAmount / amount;
  }, [customPaidAmount, amount]);

  const isCompleted = useMemo(() => {
    return Math.floor(paidAmountProgress) === 1;
  }, [paidAmountProgress]);

  const paidAmountPercentage = Math.floor(paidAmountProgress * 100);

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
      paidAmountPercentage: paidAmountProgress,
      isTotal,
    });

    setOpenDialog(false);
  };

  return (
    <>
      <div className="flex flex-row items-center justify-between gap-2">
        <Card
          className={`${isTotal && 'bg-accent'} ${isCompleted && 'border-primary/20'} shadow-small m-0 w-full p-4`}
        >
          <div className="flex flex-row items-center justify-center gap-2">
            <Checkbox
              aria-label="category_content"
              isSelected={isCompleted}
              onChange={() =>
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
                <Label
                  variant="title-sm"
                  className={`${isTotal && 'font-extrabold'}`}
                >
                  {name}
                </Label>

                <ProgressBar
                  aria-label={label}
                  value={paidAmountPercentage}
                  size="sm"
                />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* DIALOG */}
      <Modal isOpen={openDialog} onOpenChange={setOpenDialog}>
        <ModalBody className="max-w-xs gap-4 p-6">
          <ModalHeader>
            <ModalHeading>
              {t('Page.dashboard.cardDrawer.content.title')}
            </ModalHeading>
            <p className="text-muted-foreground text-sm">
              {t('Page.dashboard.cardDrawer.content.description')}
            </p>
          </ModalHeader>

          <div className="flex flex-col gap-2">
            <Label variant="title-sm">{name}</Label>

            <div className="flex flex-col gap-2">
              <Input
                type="number"
                inputMode="decimal"
                defaultValue={customPaidAmount.toFixed(2)}
                max={amount}
                onChange={handleChangeCustomPaidAmountInput}
              />

              <span className="flex flex-row justify-end">
                <Label variant="caption">
                  {t('Page.dashboard.cardDrawer.content.outOf', {
                    amount: formatCurrency({
                      value: amount,
                      currency: currency.name,
                      decimal: 2,
                    }),
                  })}
                </Label>
              </span>
            </div>
          </div>

          <ModalFooter>
            <Button type="submit" onClick={handleUpdateCustomPaidAmount}>
              {t('Common.button.update')}
            </Button>
          </ModalFooter>
        </ModalBody>
      </Modal>
    </>
  );
};

export default CategoryContent;
