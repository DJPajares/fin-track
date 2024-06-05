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
import { CalendarIcon, ChevronsUpDownIcon } from 'lucide-react';
import { formatDate } from '../../../../shared/utilities/formatDate';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import categoriesData from '../../mockData/categories.json';
import type { DashboardSelectionItemsProps } from '../../../../shared/types/dashboardTypes';

const useMockedData = process.env.NEXT_PUBLIC_USE_MOCKED_DATA === 'true';

const categoriesUrl = 'http://localhost:3001/api/v1/categories';

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

const TransactionDrawer = ({
  currency,
  currencies,
  isTransactionDrawerOpen,
  setIsTransactionDrawerOpen
}: TransactionDrawerProps) => {
  const [date, setDate] = useState(new Date());
  const [transactionCurrency, setTransactionCurrency] =
    useState<DashboardSelectionItemsProps>({});
  const [categories, setCategories] = useState<DashboardSelectionItemsProps[]>(
    []
  );
  const [category, setCategory] = useState<DashboardSelectionItemsProps>({});
  const [isCategoryPopoverOpen, setIsCategoryPopoverOpen] = useState(false);
  const [isCurrencyPopoverOpen, setIsCurrencyPopoverOpen] = useState(false);
  const [isDatePopoverOpen, setIsDatePopoverOpen] = useState(false);

  useEffect(() => {
    fetchCategoryData();
  }, []);

  // useEffect(() => {
  //   if (categories.length > 0) setCategory(categories[0]);
  // }, [categories]);

  useEffect(() => {
    setTransactionCurrency(currency);
  }, [currency]);

  const fetchCategoryData = async () => {
    const { income, expense } = await fetchCategories();

    setCategories(expense);
  };

  const changeDate = (newDate: any) => {
    setDate(newDate);
    setIsDatePopoverOpen(false);
  };

  const handleCategorySelection = ({
    selectedCategory
  }: {
    selectedCategory: DashboardSelectionItemsProps;
  }) => {
    setCategory({
      _id: selectedCategory._id,
      name: selectedCategory.name
    });
    setIsCategoryPopoverOpen(false);
  };

  const handleCurrencySelection = ({
    selectedCurrency
  }: {
    selectedCurrency: DashboardSelectionItemsProps;
  }) => {
    setTransactionCurrency({
      _id: selectedCurrency._id,
      name: selectedCurrency.name
    });
    setIsCurrencyPopoverOpen(false);
  };

  return (
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
            {/* DATE */}
            <div className="flex flex-row items-center justify-end pt-2 pb-7">
              <Popover
                open={isDatePopoverOpen}
                onOpenChange={setIsDatePopoverOpen}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-[240px] pl-3 text-left font-normal',
                      !date && 'text-muted-foreground'
                    )}
                  >
                    {date ? format(date, 'PPP') : <span>Pick a date</span>}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={changeDate}
                    defaultMonth={date} // >>> to-do: doesn't work, should open the calendar based on the date selected
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
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
              <Input placeholder="Title" />
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

              <Input type="number" placeholder="Amount" />
            </div>
          </div>

          <Separator />

          <DrawerFooter className="my-2">
            <Button>Add</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default TransactionDrawer;
