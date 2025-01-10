import { Dispatch, ReactNode, SetStateAction, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

import CustomDrawer from '../../../components/shared/CustomDrawer';
import { SelectBox } from '../../../components/shared/SelectBox';
import TransactionDrawerForm, {
  SubmitTransactionProps
} from '../../../components/Form/TransactionDrawerForm';

import { useAppSelector } from '../../../lib/hooks/use-redux';
import updateTransaction from '../../../services/updateTransaction';
import {
  transactionSchema,
  type TransactionFormProps
} from '../../../lib/schemas/transaction';

import type { TransactionProps } from '../../../types/Transaction';
import type { ListProps } from '../../../types/List';
import axios from 'axios';

type EditTransactionDrawerProps = {
  transaction: TransactionProps;
  // fetchTransactions: () => void;
  isDrawerOpen: boolean;
  setIsDrawerOpen: Dispatch<SetStateAction<boolean>>;
  children: ReactNode;
};

const EditTransactionDrawer = ({
  transaction,
  // fetchTransactions,
  isDrawerOpen,
  setIsDrawerOpen,
  children
}: EditTransactionDrawerProps) => {
  const t = useTranslations();

  const { currencies, types, categories } = useAppSelector(
    (state) => state.main
  );

  const [type, setType] = useState<ListProps>({
    _id: transaction.typeId,
    name: transaction.typeName
  });

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
        label: date.toDateString()
      })) || []
  };

  const submitTransaction = async (postData: SubmitTransactionProps) => {
    try {
      const url = `${process.env.NEXT_PUBLIC_BASE_URL}/transactions/${transaction._id}`;

      const { status, data } = await axios.put(url, postData);

      if (status === 200) {
        console.log('Transaction updated', data);
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
      title={transaction.name}
      description={transaction.description}
      triggerChildren={children}
    >
      <div className="space-y-2">
        <div className="flex flex-row justify-end">
          <SelectBox
            variant="ghost"
            items={types}
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
