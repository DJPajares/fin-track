import {
  Dispatch,
  SetStateAction,
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

import { SelectBox } from '../../../components/shared/SelectBox';
import TransactionDrawerForm, {
  type SubmitTransactionProps,
} from '../../../components/Form/TransactionDrawerForm';
import CustomDrawer from '../../../components/shared/CustomDrawer';

import { dateStringFormat } from '@shared/constants/dateStringFormat';

import type { ListProps } from '../../../types/List';
import type { TransactionFormProps } from '../../../lib/schemas/transaction';

type TransactionDrawerProps = {
  isDrawerOpen: boolean;
  setIsDrawerOpen: Dispatch<SetStateAction<boolean>>;
  defaultDate?: Date;
};

const TransactionDrawer = ({
  isDrawerOpen,
  setIsDrawerOpen,
  defaultDate,
}: TransactionDrawerProps) => {
  const t = useTranslations();

  const { user } = useAppSelector((state) => state.auth);
  const userId = user?.id || '';
  const { types, categories, currencies } = useAppSelector(
    (state) => state.main,
  );
  const dashboard = useAppSelector((state) => state.dashboard);

  const [type, setType] = useState<ListProps>({
    _id: '',
    name: '',
  });

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

  const defaultValues: TransactionFormProps = {
    category: '',
    name: '',
    currency: dashboard.currency._id,
    amount: 0,
    isRecurring: false,
    startDate: date,
    endDate: date,
    excludedDates: [],
  };

  useEffect(() => {
    if (types && types.length > 0) {
      setType(types[0]);
    }
  }, [types]);

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

  const handleSubmit = async () => {
    if (formRef.current) {
      formRef.current.requestSubmit();
    }
  };

  const submitTransaction = async (postData: SubmitTransactionProps) => {
    try {
      const response = await createTransaction(postData).unwrap();

      if (response) {
        await fetchDashboardData({
          date,
          currency: dashboard.currency.name,
          userId,
        });

        setIsDrawerOpen(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <CustomDrawer
      open={isDrawerOpen}
      onOpenChange={setIsDrawerOpen}
      handleSubmit={handleSubmit}
      title={t('Page.dashboard.transactionDrawer.title').toLocaleUpperCase()}
      description={t('Page.dashboard.transactionDrawer.description')}
    >
      <div className="space-y-2 px-4">
        <div className="flex flex-row justify-end">
          <SelectBox
            variant="ghost"
            items={newTypes}
            selectedItem={type}
            setSelectedItem={setType}
            placeholder={t('Common.label.selectPlaceholder')}
            className="w-fit p-0 text-base font-semibold"
          />
        </div>

        <TransactionDrawerForm
          type={type}
          categories={categories}
          currencies={currencies}
          defaultValues={defaultValues}
          submitTransaction={submitTransaction}
          setIsTransactionDrawerOpen={setIsDrawerOpen}
          formRef={formRef}
        />
      </div>
    </CustomDrawer>
  );
};

export default TransactionDrawer;
