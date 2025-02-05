import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import moment from 'moment';
import { useTranslations } from 'next-intl';

import { useAppSelector } from '../../../lib/hooks/use-redux';
import { useUpdateDashboardPaymentsMutation } from '../../../lib/redux/services/dashboard';

import { Card } from '../../../components/ui/card';
import { Separator } from '../../../components/ui/separator';
import { Switch } from '../../../components/ui/switch';
import { Label } from '../../../components/ui/label';
import CategoryContent from './CategoryContent';
import CustomDrawer from '../../../components/shared/CustomDrawer';

import { dateStringFormat } from '@shared/constants/dateStringFormat';
import { formatCurrency } from '@shared/utilities/formatCurrency';

import type {
  TransactionDataUpdateProps,
  TransactionPaymentCategoryProps,
} from '../../../types/TransactionPayment';

type CategoryDrawerProps = {
  category: TransactionPaymentCategoryProps;
  isDialogOpen: boolean;
  setIsDialogOpen: Dispatch<SetStateAction<boolean>>;
};

const initialTransactionPaymentCategory: TransactionPaymentCategoryProps = {
  _id: '',
  name: '',
  totalAmount: 0,
  totalPaidAmount: 0,
  paymentCompletionRate: 0,
  transactions: [],
};

const CategoryDrawer = ({
  category,
  isDialogOpen,
  setIsDialogOpen,
}: CategoryDrawerProps) => {
  const t = useTranslations();

  const dashboard = useAppSelector((state) => state.dashboard);

  const date = moment.utc(dashboard.date, dateStringFormat);

  const currency = dashboard.currency;

  const [isLocalCurrency, setIsLocalCurrency] = useState(false);
  const [drawerCategory, setDrawerCategory] = useState(
    initialTransactionPaymentCategory,
  );

  const [updateDashboardPayments] = useUpdateDashboardPaymentsMutation();

  const drawerCategoryLength = useMemo(() => {
    return Object.keys(drawerCategory.transactions).length;
  }, [drawerCategory]);

  useEffect(() => {
    if (isDialogOpen) {
      setDrawerCategory(category);
    }
  }, [isDialogOpen, category]);

  const handleTransactionDataUpdate = ({
    _id,
    paidAmount,
  }: TransactionDataUpdateProps) => {
    const transactions = drawerCategory.transactions;

    // update transaction data
    const updatedTransactions = transactions.map((transaction) => {
      if (transaction._id === _id) {
        return {
          ...transaction,
          paidAmount:
            paidAmount <= transaction.amount ? paidAmount : transaction.amount,
          isUpdated: true,
        };
      }

      return transaction;
    });

    // update category data
    let totalPaidAmount = 0;

    updatedTransactions.forEach(
      (transaction) => (totalPaidAmount += transaction.paidAmount),
    );

    // set final result
    setDrawerCategory({
      ...drawerCategory,
      totalPaidAmount,
      transactions: updatedTransactions,
    });
  };

  const handleCategoryDataUpdate = () => {
    const transactions = drawerCategory.transactions;
    const isTotalPaid =
      Math.floor(
        drawerCategory.totalPaidAmount / drawerCategory.totalAmount,
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
        isUpdated: true,
      };
    });

    // update category data
    let totalPaidAmount = 0;

    if (!isTotalPaid) {
      updatedTransactions.forEach(
        (transaction) => (totalPaidAmount += transaction.paidAmount),
      );
    }

    // set final result
    setDrawerCategory({
      ...drawerCategory,
      totalPaidAmount,
      transactions: updatedTransactions,
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
        date,
      }));

    try {
      // ✅ Use RTK Query mutation instead of axios.put
      await updateDashboardPayments(postData).unwrap();

      // ✅ No need to manually call fetch, cache is automatically refreshed
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Failed to update transaction payments:', error);
    }
  };

  return (
    <CustomDrawer
      open={isDialogOpen}
      onOpenChange={setIsDialogOpen}
      handleSubmit={createUpdatePayment}
      title={drawerCategory.name}
      description={t('Page.dashboard.cardDrawer.description', {
        category: drawerCategory.name.toLowerCase(),
      })}
    >
      <div className="space-y-4 overflow-y-scroll px-4">
        <span className="flex flex-col justify-center">
          <span className="flex flex-row items-center space-x-3">
            <Switch
              checked={isLocalCurrency}
              onCheckedChange={() => setIsLocalCurrency(!isLocalCurrency)}
            />
            <Label>{t('Page.dashboard.cardDrawer.showLocalCurrency')}</Label>
          </span>
        </span>

        <Card className="bg-accent p-4">
          <CategoryContent
            _id={drawerCategory._id}
            name={t('Page.dashboard.cardDrawer.totalLabel').toLocaleUpperCase()}
            label={formatCurrency({
              value: drawerCategory.totalAmount,
              currency: currency.name,
              decimal: 2,
            })}
            amount={drawerCategory.totalAmount}
            paidAmount={drawerCategory.totalPaidAmount}
            currency={currency}
            handleTransactionDataUpdate={handleCategoryDataUpdate}
            isTotal
          />
        </Card>

        <div>
          <Separator />
        </div>

        <Card className="bg-accent/50 space-y-4 p-4">
          {drawerCategoryLength > 0 &&
            drawerCategory.transactions.map((transaction) => (
              <div key={transaction._id} className="space-y-2">
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
                    decimal: 2,
                  })}
                  amount={transaction.amount}
                  paidAmount={transaction.paidAmount}
                  currency={currency}
                  handleTransactionDataUpdate={handleTransactionDataUpdate}
                />
              </div>
            ))}
        </Card>
      </div>
    </CustomDrawer>
  );
};

export default CategoryDrawer;
