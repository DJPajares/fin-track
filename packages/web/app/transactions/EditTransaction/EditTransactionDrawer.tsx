import { ReactNode, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

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
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { z } from 'zod';
import updateTransaction from '@/providers/updateTransaction';
import { useTranslations } from 'next-intl';

type EditTransactionDrawerProps = {
  transaction: {
    _id: string;
    name: string;
    currencyId: string;
    currencyName: string;
    amount: number;
    description: string;
  };
  fetchTransactions: () => void;
  children: ReactNode;
};

const EditTransactionDrawer = ({
  transaction,
  fetchTransactions,
  children
}: EditTransactionDrawerProps) => {
  const t = useTranslations();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);

  const formSchema = z.object({
    name: z.string(),
    amount: z.number()
  });

  type FormDataProps = z.infer<typeof formSchema>;

  const form = useForm<FormDataProps>({
    defaultValues: {
      name: transaction.name,
      amount: transaction.amount
    }
  });

  const onSubmit = (data: FormDataProps) => {
    updateTransaction({
      id: transaction._id,
      data
    });

    fetchTransactions();
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

          <Controller
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
          />
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
