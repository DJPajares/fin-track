import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
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
import { Tab, Tabs } from '@nextui-org/react';
import TransactionDrawerForm from './TransactionDrawerForm';
import { MultiSelectBox } from '@/components/shared/MultiSelectBox';
import categoriesData from '../../../../shared/mockData/categories.json';
import typesData from '../../../../shared/mockData/types.json';
import type { DashboardSelectionItemsProps } from '../../types/dashboardTypes';
import type { TypeProps } from '../../types/type';

const useMockedData = process.env.NEXT_PUBLIC_USE_MOCKED_DATA === 'true';

const categoriesUrl = 'http://localhost:3001/api/v1/categories/types';

const typesUrl = 'http://localhost:3001/api/v1/types';

type TransactionDrawerProps = {
  currency: DashboardSelectionItemsProps;
  currencies: DashboardSelectionItemsProps[];
  isTransactionDrawerOpen: boolean;
  setIsTransactionDrawerOpen: Dispatch<SetStateAction<boolean>>;
};

type CategoryProps = {
  [key: string]: DashboardSelectionItemsProps[];
};

const fetchTypes = async () => {
  try {
    if (useMockedData) {
      return typesData;
    } else {
      const { status, data } = await axios.get(typesUrl);

      if (status === 200) return data.data;
    }
  } catch (error) {
    console.error('Fetch failed', error);
  }
};

const fetchCategories = async () => {
  try {
    if (useMockedData) {
      return categoriesData;
    } else {
      const { status, data } = await axios.get(categoriesUrl);

      if (status === 200) return data.data;
    }
  } catch (error) {
    console.error('Fetch failed', error);
  }
};

const TransactionDrawer = ({
  currency,
  currencies,
  isTransactionDrawerOpen,
  setIsTransactionDrawerOpen
}: TransactionDrawerProps) => {
  const [types, setTypes] = useState<TypeProps[]>([]);
  const [categories, setCategories] = useState<CategoryProps>({});
  const [isCreateTransactionDialogOpen, setIsCreateTransactionDialogOpen] =
    useState(false);

  const formRef = useRef<HTMLFormElement>();

  useEffect(() => {
    fetchTypeData();
    fetchCategoryData();
  }, []);

  const fetchTypeData = async () => {
    const data = await fetchTypes();

    setTypes(data);
  };

  const fetchCategoryData = async () => {
    const data = await fetchCategories();

    setCategories(data);
  };

  const handleAddingTransaction = async () => {
    // Request submit to the child component
    if (formRef.current) formRef.current.requestSubmit();

    // setIsTransactionDrawerOpen(false);
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
            <DrawerHeader className="my-2">
              <DrawerTitle>TRANSACTION</DrawerTitle>
            </DrawerHeader>

            {/* <Separator /> */}

            <Tabs
              variant="underlined"
              className="flex flex-col items-center pt-3"
            >
              {types.map((type) => (
                <Tab
                  key={type._id.toString()}
                  title={type.name}
                  className="px-4"
                >
                  <Card className="bg-gray-100 dark:bg-gray-900">
                    <div className="flex flex-col justify-between p-4">
                      <TransactionDrawerForm
                        type={type}
                        categories={categories[type.name]}
                        currencies={currencies}
                        currency={currency}
                        formRef={formRef}
                      />
                    </div>
                  </Card>
                </Tab>
              ))}
            </Tabs>

            {/* <Separator /> */}

            <DrawerFooter className="my-2">
              <Button onClick={() => setIsCreateTransactionDialogOpen(true)}>
                Add
              </Button>
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>

      <AlertDialog
        open={isCreateTransactionDialogOpen}
        onOpenChange={setIsCreateTransactionDialogOpen}
      >
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
