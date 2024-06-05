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
import { CalendarIcon, ChevronsUpDownIcon } from 'lucide-react';
import { format } from 'date-fns';
import categoriesData from '../../mockData/categories.json';
import type { DashboardSelectionItemsProps } from '../../../../shared/types/dashboardTypes';
import type { TransactionProps } from '../../../api/src/models/v1/transactionModel';

const useMockedData = process.env.NEXT_PUBLIC_USE_MOCKED_DATA === 'true';

const categoriesUrl = 'http://localhost:3001/api/v1/categories';

const transactionsUrl = 'http://localhost:3001/api/v1/transactions';

type TransactionDrawerProps = {
  currency: DashboardSelectionItemsProps;
  currencies: DashboardSelectionItemsProps[];
  isTransactionDrawerOpen: boolean;
  setIsTransactionDrawerOpen: Dispatch<SetStateAction<boolean>>;
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
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [transactionCurrency, setTransactionCurrency] =
    useState<DashboardSelectionItemsProps>({});
  const [categories, setCategories] = useState<DashboardSelectionItemsProps[]>(
    []
  );
  const [category, setCategory] = useState<DashboardSelectionItemsProps>({});
  const [isCategoryPopoverOpen, setIsCategoryPopoverOpen] = useState(false);
  const [isCurrencyPopoverOpen, setIsCurrencyPopoverOpen] = useState(false);
  const [isStartDatePopoverOpen, setIsStartDatePopoverOpen] = useState(false);
  const [isEndDatePopoverOpen, setIsEndDatePopoverOpen] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);
  const [isCreateTransactionDialogOpen, setIsCreateTransactionDialogOpen] =
    useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    fetchCategoryData();
  }, []);

  // useEffect(() => {
  //   if (categories.length > 0) setCategory(categories[0]);
  // }, [categories]);

  useEffect(() => {
    setTransactionCurrency(currency);
  }, [currency]);

  useEffect(() => {
    if (startDate && endDate) {
      if (endDate < startDate) {
        setEndDate(startDate);
      }
    }
  }, [startDate, endDate]);

  const fetchCategoryData = async () => {
    const { income, expense } = await fetchCategories();

    setCategories(expense);
  };

  const handleCategorySelection = ({
    selectedCategory
  }: {
    selectedCategory: DashboardSelectionItemsProps;
  }) => {
    const { _id, name } = selectedCategory;

    setCategory({
      _id,
      name
    });
    setIsCategoryPopoverOpen(false);
  };

  const handleCurrencySelection = ({
    selectedCurrency
  }: {
    selectedCurrency: DashboardSelectionItemsProps;
  }) => {
    const { _id, name } = selectedCurrency;

    setTransactionCurrency({
      _id,
      name
    });
    setIsCurrencyPopoverOpen(false);
  };

  const handleStartDateSelection = (date: Date | undefined) => {
    setStartDate(date);
    setIsStartDatePopoverOpen(false);
  };

  const handleEndDateSelection = (date: Date | undefined) => {
    setEndDate(date);
    setIsEndDatePopoverOpen(false);
  };

  const handleAddingTransaction = async () => {
    // no states
    const description = '';
    const excludedDates = [] as Date[];

    const transactionData = {
      name: title,
      category,
      currency: transactionCurrency,
      amount: amount ? parseFloat(amount) : undefined,
      description,
      isRecurring,
      startDate,
      endDate: isRecurring ? endDate : undefined,
      excludedDates
    };

    console.log(transactionData);

    const result = await createTransaction(transactionData);

    // setIsCreateTransactionDialogOpen(true);
  };

  return (
    <>
      <Drawer
        open={isTransactionDrawerOpen}
        onOpenChange={setIsTransactionDrawerOpen}
        shouldScaleBackground
      >
        <DrawerContent>
          <div className="mx-auto w-full max-w-lg">
            <DrawerHeader className="my-2">
              <DrawerTitle>Transaction</DrawerTitle>
            </DrawerHeader>

            <Separator />

            <div className="flex flex-col justify-between px-4 py-2">
              <div className="flex flex-row items-center justify-end pt-2 pb-7">
                {/* START DATE */}
                <div className="pr-2">
                  <Popover
                    open={isStartDatePopoverOpen}
                    onOpenChange={setIsStartDatePopoverOpen}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="text-left font-normal"
                      >
                        <p className="pr-2">
                          {startDate ? (
                            format(startDate, 'MMM yyyy')
                          ) : (
                            <span>{isRecurring ? 'Start date' : 'Date'}</span>
                          )}
                        </p>
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        defaultMonth={startDate}
                        selected={startDate}
                        onSelect={handleStartDateSelection}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* END DATE */}
                {isRecurring && (
                  <div>
                    <Popover
                      open={isEndDatePopoverOpen}
                      onOpenChange={setIsEndDatePopoverOpen}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="text-left font-normal"
                        >
                          <p className="pr-2">
                            {endDate ? (
                              format(endDate, 'MMM yyyy')
                            ) : (
                              <span>End date</span>
                            )}
                          </p>
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          defaultMonth={endDate}
                          selected={endDate}
                          onSelect={handleEndDateSelection}
                          disabled={(date) =>
                            startDate ? date < startDate : false
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                )}
              </div>

              <div className="flex flex-row items-center py-2">
                {/* CATEGORY */}
                <div className="mr-2">
                  <Popover
                    open={isCategoryPopoverOpen}
                    onOpenChange={setIsCategoryPopoverOpen}
                  >
                    <PopoverTrigger asChild>
                      <Button variant="outline" role="combobox">
                        {category.name ? category.name : 'Category'}
                        <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput
                          placeholder="Search category..."
                          className="h-9"
                        />
                        <CommandEmpty>No categories found</CommandEmpty>
                        <CommandGroup>
                          <CommandList>
                            {categories.map((category) => (
                              <CommandItem
                                key={category._id}
                                value={category.name}
                                onSelect={() =>
                                  handleCategorySelection({
                                    selectedCategory: category
                                  })
                                }
                              >
                                {category.name}
                              </CommandItem>
                            ))}
                          </CommandList>
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* TITLE */}
                <Input
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {/* AMOUNT */}
              <div className="flex flex-row items-center py-2">
                <div className="mr-2">
                  <Popover
                    open={isCurrencyPopoverOpen}
                    onOpenChange={setIsCurrencyPopoverOpen}
                  >
                    <PopoverTrigger asChild>
                      <Button variant="outline" role="combobox">
                        {transactionCurrency.name
                          ? transactionCurrency.name
                          : 'Currency'}
                        <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput
                          placeholder="Search currency..."
                          className="h-9"
                        />
                        <CommandEmpty>No currencies found</CommandEmpty>
                        <CommandGroup>
                          <CommandList>
                            {currencies.map((currency) => (
                              <CommandItem
                                key={currency._id}
                                value={currency.name}
                                onSelect={() =>
                                  handleCurrencySelection({
                                    selectedCurrency: currency
                                  })
                                }
                              >
                                {currency.name}
                              </CommandItem>
                            ))}
                          </CommandList>
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                <Input
                  type="number"
                  placeholder="Amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              {/* RECURRING */}
              <div className="flex flex-row items-center justify-end py-2 pt-6">
                <Checkbox
                  isSelected={isRecurring}
                  onValueChange={setIsRecurring}
                >
                  Recurring?
                </Checkbox>
              </div>
            </div>

            <Separator />

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
