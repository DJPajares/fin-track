import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import axios from 'axios';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from '@/components/ui/drawer';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
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
import { Checkbox } from '@nextui-org/checkbox';
import { Select, SelectItem } from '@nextui-org/select';
import { MultiSelectBox } from '@/components/shared/MultiSelectBox';
import { CalendarIcon, ChevronsUpDownIcon } from 'lucide-react';
import { addMonths, differenceInMonths, format, setDate } from 'date-fns';
import categoriesData from '../../mockData/categories.json';
import type { DashboardSelectionItemsProps } from '../../../../shared/types/dashboardTypes';
import type { TransactionProps } from '../../../api/src/models/v1/transactionModel';
import { Tab, Tabs } from '@nextui-org/tabs';
import TransactionDrawerForm from './TransactionDrawerForm';

const useMockedData = process.env.NEXT_PUBLIC_USE_MOCKED_DATA === 'true';

const categoriesUrl = 'http://localhost:3001/api/v1/categories';

const transactionsUrl = 'http://localhost:3001/api/v1/transactions';

type TransactionDrawerProps = {
  currency: DashboardSelectionItemsProps;
  currencies: DashboardSelectionItemsProps[];
  isTransactionDrawerOpen: boolean;
  setIsTransactionDrawerOpen: Dispatch<SetStateAction<boolean>>;
};

type ExcludedDatesProps = {
  value: Date;
  label: string;
};

const types = [
  {
    _id: 'income',
    name: 'Income'
  },
  {
    _id: 'expense',
    name: 'Expense'
  }
];

const fetchCategories = async () => {
  try {
    if (useMockedData) {
      return categoriesData.expense;
    } else {
      const { status, data } = await axios.get(categoriesUrl);

      if (status === 200) return data.data;
    }
  } catch (error) {
    console.error('Fetch failed', error);
  }
};

const createTransaction = async (transactionData: TransactionProps) => {
  try {
    const { status, data } = await axios.post(transactionsUrl, transactionData);

    if (status === 200) return data.data;
  } catch (error) {
    console.error(error);
  }
};

const TransactionDrawer = ({
  currency,
  currencies,
  isTransactionDrawerOpen,
  setIsTransactionDrawerOpen
}: TransactionDrawerProps) => {
  const [categories, setCategories] = useState<DashboardSelectionItemsProps[]>(
    []
  );
  const [isCreateTransactionDialogOpen, setIsCreateTransactionDialogOpen] =
    useState(false);

  useEffect(() => {
    fetchCategoryData();
  }, []);

  const fetchCategoryData = async () => {
    // const { income, expense } = await fetchCategories();

    // setCategories(expense);

    const data = await fetchCategories();
    setCategories(data);
  };

  const handleAddingTransaction = async () => {
    // // no states
    // const description = '';
    // const excludedDates = [] as Date[];
    // const transactionData = {
    //   name: title,
    //   category: category._id,
    //   currency: transactionCurrency._id,
    //   amount: amount ? parseFloat(amount) : undefined,
    //   description,
    //   isRecurring,
    //   startDate,
    //   endDate: isRecurring ? endDate : undefined,
    //   excludedDates
    // };
    // console.log(transactionData);
    // const result = await createTransaction(transactionData);
    // // setIsCreateTransactionDialogOpen(true);
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
                <Tab key={type._id} title={type.name} className="px-4">
                  <Card className="bg-gray-100 dark:bg-gray-900">
                    <div className="flex flex-col justify-between p-4">
                      <TransactionDrawerForm
                        categories={categories}
                        currencies={currencies}
                        currency={currency}
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
