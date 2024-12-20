import { ReactNode, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';

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

import type { TransactionProps } from '../../../types/Transaction';
import {
  transactionSchema,
  type TransactionFormProps
} from '../../../lib/schemas/transaction';
import { zodResolver } from '@hookform/resolvers/zod';

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
    updateTransaction({
      id: transaction._id,
      data
    });

    // fetchTransactions();
  };

  const handleConfirmSubmit = () => {
    if (formRef.current) formRef.current.requestSubmit();

    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>

      <DrawerContent className="mx-auto w-full max-w-lg">
        <DrawerHeader>
          <DrawerTitle>{transaction.name}</DrawerTitle>
          <DrawerDescription>{transaction.description}</DrawerDescription>
        </DrawerHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col p-4 space-y-2 sm:space-y-4"
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

          {/* <Controller
            name="amount"
            control={form.control}
            render={({ field }) => (
              <div className="space-y-1">
                <Label className="font-semibold">
                  {t('Page.transactions.form.amount')}
                </Label>

                <div className="flex flex-row items-center">
                  <Input defaultValue={field.value} onChange={field.onChange} />
                </div>
              </div>
            )}
          /> */}

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

        <DrawerFooter>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button>{t('Common.alertDialog.triggerButton')}</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {t('Common.alertDialog.title')}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {t('Common.alertDialog.description')}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>
                  {t('Common.button.cancel')}
                </AlertDialogCancel>
                <AlertDialogAction onClick={handleConfirmSubmit}>
                  {t('Common.alertDialog.okButton')}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <DrawerClose asChild>
            <Button variant="outline">{t('Common.button.cancel')}</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default EditTransactionDrawer;
