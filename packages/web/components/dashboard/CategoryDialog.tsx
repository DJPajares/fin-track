import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import { useAppSelector } from '@/lib/hooks';

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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import CategoryContent from './CategoryContent';

import fetchTransactionPayments from '@/providers/fetchTransactionPayments';
import { dateStringFormat } from '../../../../shared/constants/dateStringFormat';

import type { DashboardDataResult } from '@/types/Dashboard';
import type {
  TransactionDataUpdateProps,
  TransactionPaymentCategoryProps
} from '@/types/TransactionPayment';

type CategoryDrawerProps = {
  category: TransactionPaymentCategoryProps;
  setDashboardData: Dispatch<SetStateAction<DashboardDataResult>>;
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

const CategoryDialog = ({
  category,
  setDashboardData,
  isDialogOpen,
  setIsDialogOpen
}: CategoryDrawerProps) => {
  const { date, currency } = useAppSelector((state) => state.dashboard);

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
      const result = await fetchTransactionPayments({
        date: moment(date, dateStringFormat).toDate(),
        currency: currency.name
      });

      setDashboardData(result);

      setIsDialogOpen(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="max-w-[400px]">
        <DialogHeader>
          <DialogTitle>{drawerCategory.name.toUpperCase()}</DialogTitle>
          <DialogDescription>Sub-categories</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {Object.keys(drawerCategory).length > 0 &&
            drawerCategory.transactions.map((transaction) => (
              <div
                key={transaction._id}
                className="grid grid-cols-6 gap-2 items-center py-1"
              >
                <CategoryContent
                  _id={transaction._id}
                  name={transaction.name}
                  amount={transaction.amount}
                  paidAmount={transaction.paidAmount}
                  currency={currency}
                  handleTransactionDataUpdate={handleTransactionDataUpdate}
                />
              </div>
            ))}

          <div className="space-y-2">
            <Separator />
          </div>

          <div className="grid grid-cols-6 gap-2 items-center py-1">
            <CategoryContent
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

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>

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
        </DialogFooter>
      </DialogContent>
    </Dialog>

    // <Drawer
    //   open={isDialogOpen}
    //   onOpenChange={setIsDialogOpen}
    //   shouldScaleBackground
    // >
    //   <DrawerContent>
    //     <div className="mx-auto w-full max-w-lg">
    //       <DrawerHeader className="my-2">
    //         <DrawerTitle>{drawerCategory.name}</DrawerTitle>
    //       </DrawerHeader>

    //       <Separator />

    //       <div className="flex flex-col justify-between px-4 py-2">
    //         {Object.keys(drawerCategory).length > 0 &&
    //           drawerCategory.transactions.map((transaction) => (
    //             <div
    //               key={transaction._id}
    //               className="grid grid-cols-6 gap-2 items-center py-1"
    //             >
    //               <CategoryContent
    //                 _id={transaction._id}
    //                 name={transaction.name}
    //                 amount={transaction.amount}
    //                 paidAmount={transaction.paidAmount}
    //                 currency={currency}
    //                 handleTransactionDataUpdate={handleTransactionDataUpdate}
    //               />
    //             </div>
    //           ))}

    //         <div className="pt-2">
    //           <Separator />
    //         </div>

    //         <div className="grid grid-cols-6 gap-2 items-center py-2">
    //           <CategoryContent
    //             _id={drawerCategory._id}
    //             name="TOTAL"
    //             amount={drawerCategory.totalAmount}
    //             paidAmount={drawerCategory.totalPaidAmount}
    //             currency={currency}
    //             handleTransactionDataUpdate={handleCategoryDataUpdate}
    //             isTotal
    //           />
    //         </div>
    //       </div>

    //       <Separator />

    //       <DrawerFooter className="my-2">
    //         <AlertDialog>
    //           <AlertDialogTrigger asChild>
    //             <Button>Update</Button>
    //           </AlertDialogTrigger>
    //           <AlertDialogContent>
    //             <AlertDialogHeader>
    //               <AlertDialogTitle>Are you sure?</AlertDialogTitle>
    //             </AlertDialogHeader>
    //             <AlertDialogFooter>
    //               <AlertDialogCancel>Cancel</AlertDialogCancel>
    //               <AlertDialogAction onClick={createUpdatePayment}>
    //                 Continue
    //               </AlertDialogAction>
    //             </AlertDialogFooter>
    //           </AlertDialogContent>
    //         </AlertDialog>
    //         <DrawerClose asChild>
    //           <Button variant="outline">Cancel</Button>
    //         </DrawerClose>
    //       </DrawerFooter>
    //     </div>
    //   </DrawerContent>
    // </Drawer>
  );
};

export default CategoryDialog;
