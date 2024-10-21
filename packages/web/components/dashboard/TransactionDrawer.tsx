import { Dispatch, SetStateAction, useRef, useState } from 'react';
import { useAppSelector } from '@/lib/hooks';

import { Tab, Tabs } from '@nextui-org/react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import TransactionDrawerForm from './TransactionDrawerForm';

import type {
  DashboardDataResult,
  DashboardSelectionItemsProps
} from '@/types/Dashboard';

type TransactionDrawerProps = {
  currencies: DashboardSelectionItemsProps[];
  setDashboardData: Dispatch<SetStateAction<DashboardDataResult>>;
  isTransactionDrawerOpen: boolean;
  setIsTransactionDrawerOpen: Dispatch<SetStateAction<boolean>>;
};

const TransactionDrawer = ({
  currencies,
  setDashboardData,
  isTransactionDrawerOpen,
  setIsTransactionDrawerOpen
}: TransactionDrawerProps) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { types, categories } = useAppSelector((state) => state.main);

  const formRef = useRef<HTMLFormElement>();

  const handleAddingTransaction = async () => {
    // Request submit to the child component
    if (formRef.current) formRef.current.requestSubmit();
  };

  return (
    <>
      <Drawer
        open={isTransactionDrawerOpen}
        onOpenChange={setIsTransactionDrawerOpen}
        shouldScaleBackground
      >
        <DrawerContent className="">
          <div className="mx-auto w-full max-w-lg overflow-y-scroll max-h-screen">
            <DrawerHeader>
              <DrawerTitle>TRANSACTION</DrawerTitle>
            </DrawerHeader>

            <Tabs
              variant="bordered"
              radius="full"
              color="secondary"
              className="flex flex-col items-center"
            >
              {types.map((type) => (
                <Tab
                  key={type._id.toString()}
                  title={type.name}
                  className="px-4"
                >
                  <div className="flex flex-col justify-between p-4">
                    <TransactionDrawerForm
                      type={type}
                      categories={categories[type._id]}
                      currencies={currencies}
                      setDashboardData={setDashboardData}
                      setIsTransactionDrawerOpen={setIsTransactionDrawerOpen}
                      formRef={formRef}
                    />
                  </div>
                </Tab>
              ))}
            </Tabs>

            <DrawerFooter className="my-2">
              <Button onClick={() => setIsDrawerOpen(true)}>Add</Button>
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>

      <AlertDialog open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleAddingTransaction}>
              Ok
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TransactionDrawer;
