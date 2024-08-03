import axios from 'axios';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { Separator } from '@/components/ui/separator';
import CategoryDrawerContent from './CategoryDrawerContent';
import type {
  TransactionDataUpdateProps,
  TransactionPaymentCategoryProps
} from '../../types/transactionPaymentTypes';
import type {
  DashboardSelectionItemsProps,
  DashboardDataProps
} from '../../types/dashboardTypes';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/feature/rootSlice';

type CategoryDrawerProps = {
  category: TransactionPaymentCategoryProps;
  isDialogOpen: boolean;
  setIsDialogOpen: Dispatch<SetStateAction<boolean>>;
};

const paymentUrl = 'http://localhost:3001/api/v1/payments';

const initialTransactionPaymentCategory: TransactionPaymentCategoryProps = {
  _id: '',
  name: '',
  totalAmount: 0,
  totalPaidAmount: 0,
  paymentCompletionRate: 0,
  transactions: []
};

const CategoryDrawer = ({
  category,
  isDialogOpen,
  setIsDialogOpen
}: CategoryDrawerProps) => {
  const { date, currency } = useSelector((state: RootState) => state.dashboard);

  const [drawerCategory, setDrawerCategory] = useState(
    initialTransactionPaymentCategory
  );

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

    // update transaction data
    const updatedTransactions = transactions.map((transaction) => {
      if (transaction._id === _id) {
        return {
          ...transaction,
          paidAmount:
            paidAmount <= transaction.amount ? paidAmount : transaction.amount,
          isUpdated: true
        };
      }

      return transaction;
    });

    // update category data
    let totalPaidAmount = 0;

    updatedTransactions.forEach(
      (transaction) => (totalPaidAmount += transaction.paidAmount)
    );

    // set final result
    setDrawerCategory({
      ...drawerCategory,
      totalPaidAmount,
      transactions: updatedTransactions
    });
  };

  const handleCategoryDataUpdate = () => {
    const transactions = drawerCategory.transactions;
    const isTotalPaid =
      Math.floor(
        drawerCategory.totalPaidAmount / drawerCategory.totalAmount
      ) === 1;

    // update transaction data
    const updatedTransactions = transactions.map((transaction) => {
      let paidAmount = 0;

      if (!isTotalPaid) {
        paidAmount = transaction.amount;
      }

      return {
        ...transaction,
        paidAmount,
        isUpdated: true
      };
    });

    // update category data
    let totalPaidAmount = 0;

    if (!isTotalPaid) {
      updatedTransactions.forEach(
        (transaction) => (totalPaidAmount += transaction.paidAmount)
      );
    }

    // set final result
    setDrawerCategory({
      ...drawerCategory,
      totalPaidAmount,
      transactions: updatedTransactions
    });
  };

  const createUpdatePayment = async () => {
    const transactionArray = drawerCategory.transactions;

    const postData = transactionArray
      .filter((transaction) => transaction.isUpdated)
      .map((transaction) => ({
        transaction: transaction._id,
        currency: currency._id,
        amount: transaction.paidAmount,
        date
      }));

    const { status } = await axios.post(paymentUrl, postData);

    if (status === 200) {
      // fetchDashboardData({ date, currencyId: currency._id });
      setIsDialogOpen(false);
    }
  };

  return (
    <Drawer
      open={isDialogOpen}
      onOpenChange={setIsDialogOpen}
      shouldScaleBackground
    >
      <DrawerContent>
        <div className="mx-auto w-full max-w-lg">
          <DrawerHeader className="my-2">
            <DrawerTitle>{drawerCategory.name}</DrawerTitle>
          </DrawerHeader>

          <Separator />

          <div className="flex flex-col justify-between px-4 py-2">
            {Object.keys(drawerCategory).length > 0 &&
              drawerCategory.transactions.map((transaction) => (
                <div
                  key={transaction._id}
                  className="grid grid-cols-6 gap-2 items-center py-1"
                >
                  <CategoryDrawerContent
                    _id={transaction._id}
                    name={transaction.name}
                    amount={transaction.amount}
                    paidAmount={transaction.paidAmount}
                    currency={currency}
                    handleTransactionDataUpdate={handleTransactionDataUpdate}
                  />
                </div>
              ))}

            <div className="pt-2">
              <Separator />
            </div>

            <div className="grid grid-cols-6 gap-2 items-center py-2">
              <CategoryDrawerContent
                _id={drawerCategory._id}
                name="TOTAL"
                amount={drawerCategory.totalAmount}
                paidAmount={drawerCategory.totalPaidAmount}
                currency={currency}
                handleTransactionDataUpdate={handleCategoryDataUpdate}
                isTotal
              />
            </div>
          </div>

          <Separator />

          <DrawerFooter className="my-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button>Update</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={createUpdatePayment}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
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
