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
                <Label className="font-semibold">Name</Label>
                <Input defaultValue={field.value} onChange={field.onChange} />
              </div>
            )}
          />

          <Controller
            name="amount"
            control={form.control}
            render={({ field }) => (
              <div className="space-y-1">
                <Label className="font-semibold">Amount</Label>

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
              <Button>Update</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This cannot be undone
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleConfirmSubmit}>
                  Ok
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default EditTransactionDrawer;
