import { dateStringFormat } from '@shared/constants/dateStringFormat';
import { formatCurrency } from '@shared/utilities/formatCurrency';
import CustomDrawer from '@web/components/shared/CustomDrawer';
import { TypographyLabel } from '@web/components/shared/Typography';
import { Separator } from '@web/components/ui/separator';
import { Switch } from '@web/components/ui/switch';
import { useAppSelector } from '@web/lib/hooks/use-redux';
import {
  UpdateDashboardPaymentsDataProps,
  UpdateDashboardPaymentsProps,
  useUpdateDashboardPaymentsMutation,
} from '@web/lib/redux/services/dashboard';
import type {
  TransactionDataUpdateProps,
  TransactionPaymentCategoryProps,
} from '@web/types/TransactionPayment';
import moment from 'moment';
import { useTranslations } from 'next-intl';
import { Dispatch, SetStateAction, useMemo, useState } from 'react';

import CategoryContent from './CategoryContent';

type CategoryDrawerProps = {
  category: TransactionPaymentCategoryProps;
  isDrawerOpen: boolean;
  setIsDrawerOpen: Dispatch<SetStateAction<boolean>>;
};

const CategoryDrawer = ({
  category,
  isDrawerOpen,
  setIsDrawerOpen,
}: CategoryDrawerProps) => {
  const t = useTranslations();

  const { user } = useAppSelector((state) => state.auth);
  const userId = user?.id || '';
  const dashboard = useAppSelector((state) => state.dashboard);

  const date = moment.utc(dashboard.date, dateStringFormat);

  const currency = dashboard.currency;

  const [isLocalCurrency, setIsLocalCurrency] = useState(false);
  const [drawerCategory, setDrawerCategory] = useState(category);

  const [updateDashboardPayments] = useUpdateDashboardPaymentsMutation();

  const drawerCategoryLength = useMemo(() => {
    return Object.keys(drawerCategory.transactions).length;
  }, [drawerCategory]);
  const handleTransactionDataUpdate = ({
    _id,
    paidAmountPercentage,
    isTotal = false,
  }: TransactionDataUpdateProps) => {
    const transactions = drawerCategory.transactions;

    let updatedDrawerCategory;

    if (isTotal) {
      const isTotalPaid =
        Math.floor(
          drawerCategory.totalPaidAmount / drawerCategory.totalAmount,
        ) === 1;

      // update transaction data
      const updatedTransactions = transactions.map((transaction) => {
        // Get the paidAmount based on the paidAmountPercentage
        const paidAmount = transaction.amount * paidAmountPercentage;
        const localPaidAmount =
          transaction.localAmount.amount * paidAmountPercentage;

        return {
          ...transaction,
          paidAmount:
            paidAmount <= transaction.amount ? paidAmount : transaction.amount,
          localAmount: {
            ...transaction.localAmount,
            paidAmount:
              localPaidAmount <= transaction.localAmount.amount
                ? localPaidAmount
                : transaction.localAmount.amount,
          },
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

      updatedDrawerCategory = {
        ...drawerCategory,
        totalPaidAmount,
        transactions: updatedTransactions,
      };
    } else {
      // update transaction data
      const updatedTransactions = transactions.map((transaction) => {
        if (transaction._id === _id) {
          // Get the paidAmount based on the paidAmountPercentage
          const paidAmount = transaction.amount * paidAmountPercentage;
          const localPaidAmount =
            transaction.localAmount.amount * paidAmountPercentage;

          return {
            ...transaction,
            paidAmount:
              paidAmount <= transaction.amount
                ? paidAmount
                : transaction.amount,
            localAmount: {
              ...transaction.localAmount,
              paidAmount:
                localPaidAmount <= transaction.localAmount.amount
                  ? localPaidAmount
                  : transaction.localAmount.amount,
            },
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

      updatedDrawerCategory = {
        ...drawerCategory,
        totalPaidAmount,
        transactions: updatedTransactions,
      };
    }

    // set final result
    setDrawerCategory(updatedDrawerCategory);
  };

  const createUpdatePayment = async () => {
    const transactionArray = drawerCategory.transactions;

    const payments: UpdateDashboardPaymentsDataProps[] = transactionArray
      .filter((transaction) => transaction.isUpdated)
      .map((transaction) => ({
        _id: transaction.paymentId,
        transaction: transaction._id,
        currency: transaction.localAmount.currency.value,
        amount: transaction.localAmount.paidAmount,
        date,
      }));

    const body: UpdateDashboardPaymentsProps = {
      payments,
      userId,
    };

    try {
      // Use RTK Query mutation instead of axios.put
      await updateDashboardPayments(body).unwrap();

      // No need to manually call fetch, cache is automatically refreshed
      setIsDrawerOpen(false);
    } catch (error) {
      console.error('Failed to update transaction payments:', error);
    }
  };

  const isTranslated = t.has(`Common.category.${drawerCategory.id}`);

  return (
    <CustomDrawer
      open={isDrawerOpen}
      onOpenChange={setIsDrawerOpen}
      handleSubmit={createUpdatePayment}
      title={
        isTranslated
          ? t(`Common.category.${drawerCategory.id}`)
          : drawerCategory.name
      }
      description={t('Page.dashboard.cardDrawer.description', {
        category: drawerCategory.name.toLowerCase(),
      })}
    >
      <div className="flex flex-col gap-4">
        <span className="flex flex-row items-center gap-3">
          <Switch
            checked={isLocalCurrency}
            onCheckedChange={() => setIsLocalCurrency(!isLocalCurrency)}
          />
          <TypographyLabel>
            {t('Page.dashboard.cardDrawer.showLocalCurrency')}
          </TypographyLabel>
        </span>

        <CategoryContent
          _id={drawerCategory._id}
          name={t('Page.dashboard.cardDrawer.totalLabel').toLocaleUpperCase()}
          label={formatCurrency({
            value: drawerCategory.totalAmount,
            currency: currency.label,
            decimal: 2,
          })}
          amount={drawerCategory.totalAmount}
          paidAmount={drawerCategory.totalPaidAmount}
          currency={currency}
          handleTransactionDataUpdate={handleTransactionDataUpdate}
          isTotal
        />

        <Separator />

        <div className="flex flex-col gap-4">
          {drawerCategoryLength > 0 &&
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
                      ? transaction.localAmount.currency.label
                      : currency.label,
                    decimal: 2,
                  })}
                  amount={
                    isLocalCurrency
                      ? transaction.localAmount.amount
                      : transaction.amount
                  }
                  paidAmount={
                    isLocalCurrency
                      ? transaction.localAmount.paidAmount
                      : transaction.paidAmount
                  }
                  currency={
                    isLocalCurrency
                      ? transaction.localAmount.currency
                      : currency
                  }
                  handleTransactionDataUpdate={handleTransactionDataUpdate}
                />
              </div>
            ))}
        </div>
      </div>
    </CustomDrawer>
  );
};

export default CategoryDrawer;
