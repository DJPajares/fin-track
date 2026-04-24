import { dateStringFormat } from '@shared/constants/dateStringFormat';
import type { ListProps } from '@shared/types/List';
import TransactionDrawerForm, {
  type SubmitTransactionProps,
  type TransactionDrawerFormRef,
} from '@web/components/Form/TransactionDrawerForm';
import CustomDrawer from '@web/components/shared/CustomDrawer';
import { useAppSelector } from '@web/lib/hooks/use-redux';
import { useLazyGetDashboardDataQuery } from '@web/lib/redux/services/dashboard';
import { useCreateTransactionMutation } from '@web/lib/redux/services/transactions';
import type { TransactionFormProps } from '@web/lib/schemas/transaction';
import moment from 'moment';
import { useTranslations } from 'next-intl';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';

type TransactionDrawerProps = {
  isDrawerOpen: boolean;
  setIsDrawerOpen: Dispatch<SetStateAction<boolean>>;
  defaultDate?: Date;
  defaultType?: ListProps;
  onSuccess?: () => void | Promise<void>;
};

const TransactionDrawer = ({
  isDrawerOpen,
  setIsDrawerOpen,
  defaultDate,
  defaultType,
  onSuccess,
}: TransactionDrawerProps) => {
  const t = useTranslations();

  const userId = useAppSelector((state) => state.auth.user)?.id || '';
  const { types, categories, currencies } = useAppSelector(
    (state) => state.main,
  );
  const dashboard = useAppSelector((state) => state.dashboard);

  const [selectedTypeId, setSelectedTypeId] = useState<string | null>(null);
  const [storedFormValues, setStoredFormValues] =
    useState<TransactionFormProps | null>(null);

  const date = useMemo(() => {
    if (defaultDate) {
      return defaultDate;
    }
    const convertedDate = moment(dashboard.date, dateStringFormat).toDate();

    return convertedDate;
  }, [dashboard.date, defaultDate]);

  const newTypes = types.map((type) => {
    const isTranslated = t.has(`Common.type.${type.id}`);

    return {
      _id: type._id,
      name: isTranslated ? t(`Common.type.${type.id}`) : type.name,
    };
  });

  const [createTransaction] = useCreateTransactionMutation();

  const [fetchDashboardData] = useLazyGetDashboardDataQuery();

  const defaultValues: TransactionFormProps = useMemo(
    () =>
      storedFormValues || {
        category: '',
        name: '',
        currency: dashboard.currency._id,
        amount: 0,
        description: '',
        isRecurring: false,
        startDate: date,
        endDate: date,
        excludedDates: [],
      },
    [storedFormValues, dashboard.currency._id, date],
  );

  const fallbackType = useMemo<ListProps>(
    () =>
      (defaultType && defaultType._id ? defaultType : newTypes[0]) || {
        _id: '',
        name: '',
      },
    [defaultType, newTypes],
  );

  const type = useMemo<ListProps>(() => {
    const activeTypeId = selectedTypeId || fallbackType._id;
    return (
      newTypes.find((item) => item._id === activeTypeId) ||
      fallbackType || {
        _id: '',
        name: '',
      }
    );
  }, [fallbackType, newTypes, selectedTypeId]);

  const handleTypeChange = useCallback((nextType: ListProps) => {
    setSelectedTypeId(nextType._id);
  }, []);

  const formRef = useRef<HTMLFormElement>(null);
  const resetFormRef = useRef<TransactionDrawerFormRef>(null);
  const submissionResolverRef = useRef<(() => void) | null>(null);

  const handleSubmit = () => {
    return new Promise<void>((resolve) => {
      submissionResolverRef.current = resolve;
      if (formRef.current) {
        formRef.current.requestSubmit();
      }
    });
  };

  const submitTransaction = async (postData: SubmitTransactionProps) => {
    try {
      const response = await createTransaction(postData).unwrap();

      if (response) {
        if (onSuccess) {
          await onSuccess();
        } else {
          await fetchDashboardData({
            date,
            currency: dashboard.currency.name,
            userId,
          });
        }

        setStoredFormValues(null);
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

  const handleDrawerChange = (open: boolean | ((prev: boolean) => boolean)) => {
    const nextOpen = typeof open === 'function' ? open(isDrawerOpen) : open;
    setIsDrawerOpen(nextOpen);
    if (!nextOpen) {
      // Store form values will be called by the form component
    }
  };

  const handleStoreFormValues = useCallback((values: TransactionFormProps) => {
    setStoredFormValues(values);
  }, []);

  const handleCancel = () => {
    setStoredFormValues(null);
    resetFormRef.current?.resetForm();
  };

  return (
    <CustomDrawer
      open={isDrawerOpen}
      onOpenChange={handleDrawerChange}
      handleSubmit={handleSubmit}
      onCancel={handleCancel}
      title={t('Page.dashboard.transactionDrawer.title').toLocaleUpperCase()}
      description={t('Page.dashboard.transactionDrawer.description')}
    >
      <TransactionDrawerForm
        key={`${type._id || 'type'}-${defaultValues.id || 'new'}-${defaultValues.startDate.toISOString()}-${defaultValues.endDate?.toISOString() || defaultValues.startDate.toISOString()}-${defaultValues.currency}-${defaultValues.category}-${defaultValues.amount}`}
        type={type}
        typeOptions={newTypes}
        onTypeChange={handleTypeChange}
        categories={categories}
        currencies={currencies}
        defaultValues={defaultValues}
        submitTransaction={submitTransaction}
        onValidationError={handleValidationError}
        setIsTransactionDrawerOpen={setIsDrawerOpen}
        onStoreFormValues={handleStoreFormValues}
        formRef={formRef}
        resetFormRef={resetFormRef}
      />
    </CustomDrawer>
  );
};

export default TransactionDrawer;
