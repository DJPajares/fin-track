import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useTranslations } from 'next-intl';
import moment from 'moment';

import { useAppSelector } from '../../../lib/hooks/use-redux';
import { useCreateTransactionMutation } from '../../../lib/redux/services/transactions';
import { useLazyGetDashboardDataQuery } from '../../../lib/redux/services/dashboard';

import TransactionDrawerForm, {
  type SubmitTransactionProps,
  type TransactionDrawerFormRef,
} from '../../../components/Form/TransactionDrawerForm';
import CustomDrawer from '../../../components/shared/CustomDrawer';

import { dateStringFormat } from '@shared/constants/dateStringFormat';

import type { ListProps } from '../../../types/List';
import type { TransactionFormProps } from '../../../lib/schemas/transaction';

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

  const [type, setType] = useState<ListProps>({
    _id: '',
    name: '',
  });
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

  useEffect(() => {
    if (types && types.length > 0) {
      if (defaultType && defaultType._id) {
        setType(defaultType);
      } else {
        setType(types[0]);
      }
    }
  }, [types, defaultType]);

  // Update type name when translations change
  useEffect(() => {
    if (type._id && newTypes.length > 0) {
      const updatedType = newTypes.find((t) => t._id === type._id);
      if (updatedType && updatedType.name !== type.name) {
        setType(updatedType);
      }
    }
  }, [newTypes, type._id, type.name]);

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
        type={type}
        typeOptions={newTypes}
        onTypeChange={setType}
        categories={categories}
        currencies={currencies}
        defaultValues={defaultValues}
        submitTransaction={submitTransaction}
        setIsTransactionDrawerOpen={setIsDrawerOpen}
        onStoreFormValues={handleStoreFormValues}
        formRef={formRef}
        resetFormRef={resetFormRef}
      />
    </CustomDrawer>
  );
};

export default TransactionDrawer;
