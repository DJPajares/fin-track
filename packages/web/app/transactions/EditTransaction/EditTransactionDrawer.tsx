import { ReactNode, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { zodResolver } from '@hookform/resolvers/zod';
import { useIsMobile } from '../../../lib/hooks/use-mobile';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '../../../components/ui/alert-dialog';
import { Button } from '../../../components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '../../../components/ui/drawer';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../../../components/ui/form';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../../../components/ui/select';

import { useAppSelector } from '../../../lib/hooks/use-redux';
import updateTransaction from '../../../services/updateTransaction';
import {
  transactionSchema,
  type TransactionFormProps
} from '../../../lib/schemas/transaction';

import type { TransactionProps } from '../../../types/Transaction';
import CustomDrawer from '@web/components/shared/CustomDrawer';

type EditTransactionDrawerProps = {
  transaction: TransactionProps;
  // fetchTransactions: () => void;
  children: ReactNode;
};

const EditTransactionDrawer = ({
  transaction,
  // fetchTransactions,
  children
}: EditTransactionDrawerProps) => {
  const isMobile = useIsMobile();
  const t = useTranslations();

  const { currencies } = useAppSelector((state) => state.main);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);

  const { name, amount, startDate, endDate, isRecurring } = transaction;

  const form = useForm<TransactionFormProps>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      startDate,
      endDate,
      category: transaction.categoryId,
      name,
      currency: transaction.currencyId,
      amount,
      isRecurring
    }
  });

  const onSubmit = (data: TransactionFormProps) => {
    console.log(data);

    // updateTransaction({
    //   id: transaction._id,
    //   data
    // });

    // fetchTransactions();
  };

  const handleConfirmSubmit = () => {
    // if (formRef.current) formRef.current.requestSubmit();

    // setIsDrawerOpen(!isDrawerOpen);

    form.handleSubmit(
      (data) => {
        console.log('Form data submitted:', data);
        // Add your submission logic here
      },
      (errors) => {
        console.error('Validation errors:', errors);
      }
    )();
  };

  return (
    <CustomDrawer
      open={isDrawerOpen}
      onOpenChange={setIsDrawerOpen}
      handleSubmit={handleConfirmSubmit}
      title={transaction.name}
      description={transaction.description}
      triggerChildren={children}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
          ref={formRef}
        >
          <Controller
            name="name"
            control={form.control}
            render={({ field }) => (
              <div className="space-y-1">
                <Label className="font-semibold">
                  {t('Page.transactions.form.name')}
                </Label>
                <Input defaultValue={field.value} onChange={field.onChange} />
              </div>
            )}
          />

          <div className="flex flex-row items-center space-x-2">
            <div>
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>
                      {t(
                        'Page.dashboard.transactionDrawer.form.title.currency'
                      )}
                    </FormLabel>

                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t(
                            'Page.dashboard.transactionDrawer.form.placeholder.currency'
                          )}
                        />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectGroup>
                          {currencies.map((currency) => (
                            <SelectItem key={currency._id} value={currency._id}>
                              {currency.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex-1">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>
                      {t('Page.dashboard.transactionDrawer.form.title.amount')}
                    </FormLabel>

                    <FormControl>
                      <Input
                        type="number"
                        inputMode="decimal"
                        placeholder="0"
                        {...field}
                        value={field.value || ''}
                        onChange={field.onChange}
                        autoComplete="false"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </form>
      </Form>
    </CustomDrawer>
  );
};

export default EditTransactionDrawer;
