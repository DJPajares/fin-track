import { excludedDateStringFormat } from '@shared/constants/dateStringFormat';
import TransactionDrawerForm, {
  type SubmitTransactionProps,
} from '@web/components/Form/TransactionDrawerForm';
import CustomDrawer from '@web/components/shared/CustomDrawer';
import { useAppDispatch, useAppSelector } from '@web/lib/hooks/use-redux';
import { dashboardApi } from '@web/lib/redux/services/dashboard';
import {
  useDeleteTransactionMutation,
  useLazyGetTransactionsQuery,
  useUpdateTransactionMutation,
} from '@web/lib/redux/services/transactions';
import type { TransactionFormProps } from '@web/lib/schemas/transaction';
import type { ListProps } from '@web/types/List';
import type { TransactionProps } from '@web/types/Transaction';
import moment from 'moment';
import { useTranslations } from 'next-intl';
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';

type EditTransactionDrawerProps = {
  date: Date;
  transaction: TransactionProps;
  isDrawerOpen: boolean;
  setIsDrawerOpen: Dispatch<SetStateAction<boolean>>;
  children: ReactNode;
};

const EditTransactionDrawer = ({
  date,
  transaction,
  isDrawerOpen,
  setIsDrawerOpen,
  children,
}: EditTransactionDrawerProps) => {
  const t = useTranslations();
  const dispatch = useAppDispatch();

  const { user } = useAppSelector((state) => state.auth);
  const userId = user?.id || '';
  const { currencies, types, categories } = useAppSelector(
    (state) => state.main,
  );

  const [type, setType] = useState<ListProps>({
    _id: transaction.typeId,
    name: transaction.typeName,
  });

  const newTypes = types.map((type) => {
    const isTranslated = t.has(`Common.type.${type.id}`);

    return {
      _id: type._id,
      name: isTranslated ? t(`Common.type.${type.id}`) : type.name,
    };
  });

  const [updateTransaction] = useUpdateTransactionMutation();
  const [deleteTransaction] = useDeleteTransactionMutation();
  const [lazyGetTransactions] = useLazyGetTransactionsQuery();

  const formRef = useRef<HTMLFormElement>(null);
  const submissionResolverRef = useRef<(() => void) | null>(null);

  const defaultValues: TransactionFormProps = {
    id: transaction._id,
    category: transaction.categoryId,
    name: transaction.name,
    currency: transaction.currencyId,
    amount: transaction.amount,
    description: transaction.description ?? '',
    isRecurring: transaction.isRecurring || false,
    startDate: new Date(transaction.startDate),
    endDate: new Date(transaction.endDate),
    excludedDates:
      transaction.excludedDates?.map((date) => ({
        value: new Date(date).toDateString(),
        label: moment(date).format(excludedDateStringFormat),
      })) || [],
  };

  useEffect(() => {
    if (type._id && newTypes.length > 0) {
      const updatedType = newTypes.find((t) => t._id === type._id);
      if (updatedType && updatedType.name !== type.name) {
        setType(updatedType);
      }
    }
  }, [newTypes, type._id, type.name]);

  const submitTransaction = async (postData: SubmitTransactionProps) => {
    try {
      const response = await updateTransaction({
        transactionId: transaction._id,
        postData,
      }).unwrap();

      if (response) {
        await lazyGetTransactions({
          page: 1,
          limit: 8,
          body: { type: type._id, date: date.toISOString(), userId },
        });

        // Invalidate dashboard cache to refresh data
        dispatch(dashboardApi.util.invalidateTags(['Dashboard']));

        setIsDrawerOpen(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      submissionResolverRef.current?.();
    }
  };

  const handleValidationError = () => {
    // Called when form validation fails
    // Resolve the promise so loading state can be reset
    submissionResolverRef.current?.();
  };

  const handleDeleteTransaction = async (transactionId: string) => {
    try {
      await deleteTransaction(transactionId).unwrap();

      await lazyGetTransactions({
        page: 1,
        limit: 8,
        body: { type: type._id, date: date.toISOString(), userId },
      });

      // Invalidate dashboard cache to refresh data
      dispatch(dashboardApi.util.invalidateTags(['Dashboard']));

      setIsDrawerOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = () => {
    return new Promise<void>((resolve) => {
      submissionResolverRef.current = resolve;
      if (formRef.current) {
        formRef.current.requestSubmit();
      }
    });
  };

  return (
    <CustomDrawer
      open={isDrawerOpen}
      onOpenChange={setIsDrawerOpen}
      handleSubmit={handleSubmit}
      title={t('Page.dashboard.transactionDrawer.title').toLocaleUpperCase()}
      description={t(
        'Page.dashboard.transactionDrawer.description',
      ).toLocaleUpperCase()}
      triggerChildren={children}
    >
      <TransactionDrawerForm
        key={`${type._id || 'type'}-${defaultValues.id || 'edit'}-${defaultValues.startDate.toISOString()}-${defaultValues.endDate?.toISOString() || defaultValues.startDate.toISOString()}-${defaultValues.currency}-${defaultValues.category}-${defaultValues.amount}`}
        type={type}
        typeOptions={newTypes}
        onTypeChange={setType}
        categories={categories}
        currencies={currencies}
        defaultValues={defaultValues}
        submitTransaction={submitTransaction}
        deleteTransaction={handleDeleteTransaction}
        onValidationError={handleValidationError}
        setIsTransactionDrawerOpen={setIsDrawerOpen}
        formRef={formRef}
      />
    </CustomDrawer>
  );
};

export default EditTransactionDrawer;
