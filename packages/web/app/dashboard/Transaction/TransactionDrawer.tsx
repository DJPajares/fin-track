import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useAppSelector } from '../../../lib/hooks/use-redux';

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from '../../../components/ui/drawer';
import { Button } from '../../../components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '../../../components/ui/alert-dialog';
import { SelectBox } from '../../../components/shared/SelectBox';
import TransactionDrawerForm from './TransactionDrawerForm';

import type {
  DashboardDataResult,
  DashboardSelectionItemsProps
} from '../../../types/Dashboard';
import type { ListProps } from '../../../types/List';

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
  const t = useTranslations();

  const { types, categories } = useAppSelector((state) => state.main);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isNoticeOpen, setIsNoticeOpen] = useState(false);
  const [type, setType] = useState<ListProps>({
    _id: '',
    name: ''
  });

  useEffect(() => {
    if (types && types.length > 0) {
      setType(types[0]);
    }
  }, [types]);

  const formRef = useRef<HTMLFormElement>(null);

  const handleAddingTransaction = async () => {
    // Request submit to the child component
    if (formRef.current) {
      formRef.current.requestSubmit();
      setIsNoticeOpen(true);
    }
  };

  return (
    <>
      <Drawer
        open={isTransactionDrawerOpen}
        onOpenChange={setIsTransactionDrawerOpen}
      >
        <DrawerContent>
          <div className="mx-auto w-full max-w-lg overflow-y-auto max-h-screen">
            <DrawerHeader>
              <DrawerTitle>
                {t(
                  'Page.dashboard.transactionDrawer.title'
                ).toLocaleUpperCase()}
              </DrawerTitle>
              <DrawerDescription>
                {t('Page.dashboard.transactionDrawer.description')}
              </DrawerDescription>
            </DrawerHeader>

            <div className="py-1 px-8 space-y-2">
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

              <div>
                <TransactionDrawerForm
                  type={type}
                  categories={categories}
                  currencies={currencies}
                  setDashboardData={setDashboardData}
                  setIsTransactionDrawerOpen={setIsTransactionDrawerOpen}
                  formRef={formRef}
                />
              </div>
            </div>

            <DrawerFooter className="my-2">
              <Button onClick={() => setIsDialogOpen(true)}>
                {t('Common.button.add')}
              </Button>
              <DrawerClose asChild>
                <Button variant="outline">{t('Common.button.cancel')}</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>

      {/* CONFIRMATION */}
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('Common.alertDialog.title')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('Common.alertDialog.description')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('Common.button.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleAddingTransaction}>
              {t('Common.alertDialog.okButton')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* NOTICE */}
      <AlertDialog open={isNoticeOpen} onOpenChange={setIsNoticeOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Success</AlertDialogTitle>
            <AlertDialogDescription>
              Transaction added successfully!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>
              {t('Common.alertDialog.okButton')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TransactionDrawer;
