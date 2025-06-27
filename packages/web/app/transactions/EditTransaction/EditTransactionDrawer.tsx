import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useTranslations } from 'next-intl';

import CustomDrawer from '../../../components/shared/CustomDrawer';
import { SelectBox } from '../../../components/shared/SelectBox';
import TransactionDrawerForm, {
  type SubmitTransactionProps,
} from '../../../components/Form/TransactionDrawerForm';

import { useAppSelector } from '../../../lib/hooks/use-redux';
import {
  useLazyGetTransactionsQuery,
  useUpdateTransactionMutation,
} from '@web/lib/redux/services/transactions';

import type { TransactionFormProps } from '../../../lib/schemas/transaction';
import type { TransactionProps } from '../../../types/Transaction';
import type { ListProps } from '../../../types/List';

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
  const [lazyGetTransactions] = useLazyGetTransactionsQuery();

  const formRef = useRef<HTMLFormElement>(null);

  const defaultValues: TransactionFormProps = {
    category: transaction.categoryId,
    name: transaction.name,
    currency: transaction.currencyId,
    amount: transaction.amount,
    isRecurring: transaction.isRecurring || false,
    startDate: new Date(transaction.startDate),
    endDate: new Date(transaction.endDate),
    excludedDates:
      transaction.excludedDates?.map((date) => ({
        value: date.toDateString(),
        label: date.toDateString(),
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
          body: { type: type._id, date: date.toISOString() },
        });

        setIsDrawerOpen(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async () => {
    if (formRef.current) formRef.current.requestSubmit();
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

export default EditTransactionDrawer;
