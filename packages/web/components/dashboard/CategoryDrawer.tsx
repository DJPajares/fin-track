import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import type { TransactionPaymentCategoryProps } from '../../../../shared/types/transactionPaymentTypes';
import CategoryDrawerContent from './CategoryDrawerContent';
import axios from 'axios';

type CategoryDrawerProps = {
  category: TransactionPaymentCategoryProps;
  currency: string;
  date: Date;
  isDialogOpen: boolean;
  setIsDialogOpen: Dispatch<SetStateAction<boolean>>;
};

type TransactionDataUpdateProps = {
  _id: any;
  paidAmount: number;
};

const paymentUrl = 'http://localhost:3001/api/v1/payments';

const CategoryDrawer = ({
  category,
  currency,
  date,
  isDialogOpen,
  setIsDialogOpen
}: CategoryDrawerProps) => {
  const [drawerCategory, setDrawerCategory] =
    useState<TransactionPaymentCategoryProps>({});

  useEffect(() => {
    if (isDialogOpen) {
      setDrawerCategory(category);
    }
  }, [isDialogOpen, category]);

  const handleTransactionDataUpdate = ({
    _id,
    paidAmount
  }: TransactionDataUpdateProps) => {
    const transactions = drawerCategory.transactions;

    const updatedTransactions = transactions.map((transaction) => {
      if (transaction._id === _id) {
        return {
          ...transaction,
          paidAmount
        };
      }

      return transaction;
    });

    setDrawerCategory({
      ...drawerCategory,
      transactions: updatedTransactions
    });
  };

  const updatePayment = async () => {
    const transactionArray = drawerCategory.transactions;

    const postData = transactionArray.map((transaction) => ({
      transaction: transaction._id,
      amount: transaction.paidAmount,
      date
    }));

    console.log(postData);

    const { status, data } = await axios.post(paymentUrl, postData);

    if (status === 200) return data.data;
  };

  return (
    <Drawer
      open={isDialogOpen}
      onOpenChange={setIsDialogOpen}
      shouldScaleBackground
    >
      <DrawerContent>
        <div className="mx-auto w-full max-w-lg">
          <DrawerHeader>
            <DrawerTitle>{drawerCategory.name}</DrawerTitle>
          </DrawerHeader>

          <CategoryDrawerContent
            category={drawerCategory}
            currency={currency}
            handleTransactionDataUpdate={handleTransactionDataUpdate}
          />

          <DrawerFooter>
            <Button onClick={updatePayment}>Confirm</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default CategoryDrawer;
