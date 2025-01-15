import axios from 'axios';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import moment from 'moment';
import { useAppSelector } from '../../../lib/hooks/use-redux';
import { useTranslations } from 'next-intl';

import { ScrollShadow } from '@nextui-org/react';
import { Separator } from '../../../components/ui/separator';
import { Switch } from '../../../components/ui/switch';
import { Label } from '../../../components/ui/label';
import CategoryContent from './CategoryContent';
import CustomDrawer from '../../../components/shared/CustomDrawer';

import fetchTransactionPayments from '../../../services/fetchTransactionPayments';
import { dateStringFormat } from '@shared/constants/dateStringFormat';
import { formatCurrency } from '@shared/utilities/formatCurrency';

import type {
  TransactionDataUpdateProps,
  TransactionPaymentCategoryProps
} from '../../../types/TransactionPayment';
import type { DashboardDataResult } from '../../../types/Dashboard';

type CategoryDrawerProps = {
  category: TransactionPaymentCategoryProps;
  setDashboardData: Dispatch<SetStateAction<DashboardDataResult>>;
  isDialogOpen: boolean;
  setIsDialogOpen: Dispatch<SetStateAction<boolean>>;
};

const paymentUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/payments`;

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
  setDashboardData,
  isDialogOpen,
  setIsDialogOpen
}: CategoryDrawerProps) => {
  const t = useTranslations();

  const dashboard = useAppSelector((state) => state.dashboard);

  const date = moment.utc(dashboard.date, dateStringFormat);

  const currency = dashboard.currency;

  const [isLocalCurrency, setIsLocalCurrency] = useState(false);
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
        _id: transaction.paymentId,
        transaction: transaction._id,
        currency: currency._id,
        amount: transaction.paidAmount,
        date
      }));

    // Create or update (upsert) payments
    const { status } = await axios.put(paymentUrl, postData);

    // Fetch the updated transaction payments
    if (status === 200) {
      const result = await fetchTransactionPayments({
        date: date.toDate(),
        currency: currency.name
      });

      setDashboardData(result);

      setIsDialogOpen(false);
    }
  };

  return (
    <CustomDrawer
      open={isDialogOpen}
      onOpenChange={setIsDialogOpen}
      handleSubmit={createUpdatePayment}
      title={drawerCategory.name}
      description={t('Page.dashboard.cardDrawer.description', {
        category: drawerCategory.name.toLowerCase()
      })}
    >
      <div className="flex flex-col justify-between px-2 space-y-6">
        <span className="flex flex-col justify-center items-end">
          <span className="flex flex-row items-center space-x-2">
            <Label>{t('Page.dashboard.cardDrawer.showLocalCurrency')}</Label>

            <Switch
              checked={isLocalCurrency}
              onCheckedChange={() => setIsLocalCurrency(!isLocalCurrency)}
            />
          </span>
        </span>

        <ScrollShadow className="max-h-[50vh] sm:max-h-[90vh] space-y-3">
          {Object.keys(drawerCategory).length > 0 &&
            drawerCategory.transactions.map((transaction) => (
              <div key={transaction._id}>
                <CategoryContent
                  _id={transaction._id}
                  name={transaction.name}
                  label={formatCurrency({
                    value: isLocalCurrency
                      ? transaction.localAmount.amount
                      : transaction.amount,
                    currency: isLocalCurrency
                      ? transaction.localAmount.currency.name
                      : currency.name,
                    decimal: 2
                  })}
                  amount={transaction.amount}
                  paidAmount={transaction.paidAmount}
                  currency={currency}
                  handleTransactionDataUpdate={handleTransactionDataUpdate}
                />
              </div>
            ))}
        </ScrollShadow>

        <Separator />

        <CategoryContent
          _id={drawerCategory._id}
          name={t('Page.dashboard.cardDrawer.totalLabel').toLocaleUpperCase()}
          label={formatCurrency({
            value: drawerCategory.totalAmount,
            currency: currency.name,
            decimal: 2
          })}
          amount={drawerCategory.totalAmount}
          paidAmount={drawerCategory.totalPaidAmount}
          currency={currency}
          handleTransactionDataUpdate={handleCategoryDataUpdate}
          isTotal
        />
      </div>
    </CustomDrawer>
  );
};

export default CategoryDrawer;
