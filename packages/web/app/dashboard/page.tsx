'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollShadow, CircularProgress } from '@nextui-org/react';
import CategoryCard from '@/components/dashboard/CategoryCard';
import { formatCurrency } from '../../../../shared/utilities/formatCurrency';
import { formatDate } from '../../../../shared/utilities/formatDate';
import CategoryDrawer from '@/components/dashboard/CategoryDrawer';
import TransactionDrawer from '@/components/dashboard/TransactionDrawer';
import {
  type DashboardSelectionItemsProps,
  type DashboardDataProps,
  type DashboardDataCategoryResult,
  DashboardDataResult
} from '../../types/dashboardTypes';
import { format } from 'date-fns';
import fetchTransactionPayments from '@/providers/fetchTransactionPayments';
import fetchCurrencies from '@/providers/fetchCurrencies';
import { useDispatch } from 'react-redux';
import {
  setDashboardCurrency,
  setDashboardDate
} from '@/lib/feature/dashboard/dashboardSlice';

const initialDashboardData = {
  main: {
    currency: '',
    budget: 0,
    totalAmount: 0,
    totalPaidAmount: 0,
    balance: 0,
    extra: 0,
    paymentCompletionRate: 0
  },
  categories: []
};

const initialTransactionPaymentCategory = {
  _id: '',
  name: '',
  icon: '',
  totalAmount: 0,
  totalPaidAmount: 0,
  paymentCompletionRate: 0,
  transactions: []
};

const initialCurrency = {
  _id: 'php',
  name: 'PHP'
};

const Dashboard = () => {
  const [dashboardData, setDashboardData] =
    useState<DashboardDataResult>(initialDashboardData);
  const [dashboardCategoryData, setDashboardCategoryData] = useState(
    initialTransactionPaymentCategory
  );
  const [date, setDate] = useState(new Date());
  const [currencies, setCurrencies] = useState<DashboardSelectionItemsProps[]>(
    []
  );
  const [currency, setCurrency] =
    useState<DashboardSelectionItemsProps>(initialCurrency);
  const [isDatePopoverOpen, setIsDatePopoverOpen] = useState(false);
  const [isCurrencyPopoverOpen, setIsCurrencyPopoverOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isTransactionDrawerOpen, setIsTransactionDrawerOpen] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    fetchCurrencyData();
  }, []);

  useEffect(() => {
    if (currencies.length > 0) {
      // store in redux state
      dispatch(
        setDashboardCurrency({
          currency: currencies[0]
        })
      );

      // store in component state
      setCurrency(currencies[0]);
    }
  }, [currencies]);

  useEffect(() => {
    const hasCurrency = Object.keys(currency).length > 0;

    if (date && hasCurrency) {
      fetchDashboardData({ date, currency: currency.name });
    }
  }, [date, currency]);

  const fetchDashboardData = async ({ date, currency }: DashboardDataProps) => {
    const data = await fetchTransactionPayments({
      date,
      currency
    });
    setDashboardData(data);
  };

  const fetchCurrencyData = async () => {
    const data = await fetchCurrencies();

    setCurrencies(data);
  };

  const handleDateSelection = (date: any) => {
    // store in redux state
    dispatch(
      setDashboardDate({
        date: date
      })
    );

    // store in component state
    setDate(date);

    setIsDatePopoverOpen(false);
  };

  const handleCurrencySelection = ({
    selectedCurrency
  }: {
    selectedCurrency: DashboardSelectionItemsProps;
  }) => {
    // store in redux state
    dispatch(
      setDashboardCurrency({
        currency: selectedCurrency
      })
    );

    // store in component state
    setCurrency({
      _id: selectedCurrency._id,
      name: selectedCurrency.name
    });

    setIsCurrencyPopoverOpen(false);
  };

  const handleCardClick = (category: DashboardDataCategoryResult) => {
    setDashboardCategoryData(category);
    setIsDialogOpen(true);
  };

  const handleAddTransactionButton = () => {
    setIsTransactionDrawerOpen(true);
  };

  return (
    <div className="flex flex-col px-6 py-2 sm:py-4">
      <div className="pb-4">
        <div className="pb-2 sm:pb-6">
          {Object.keys(dashboardData.main).length > 0 ? (
            <div className="flex flex-row items-center justify-between">
              {/* CALENDAR */}
              <Popover
                open={isDatePopoverOpen}
                onOpenChange={setIsDatePopoverOpen}
              >
                <PopoverTrigger asChild>
                  <Button variant="ghost" className="px-0">
                    <p className="text-3xl sm:text-5xl font-extrabold sm:font-black">
                      {format(date, 'MMM yyyy')}
                    </p>
                    {/* <ChevronDownIcon className="h-4 w-4" /> */}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    defaultMonth={date}
                    selected={date}
                    onSelect={handleDateSelection}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              {/* CURRENCY */}
              <Popover
                open={isCurrencyPopoverOpen}
                onOpenChange={setIsCurrencyPopoverOpen}
              >
                <PopoverTrigger asChild>
                  <Button variant="ghost" className="px-0">
                    <p className="text-3xl sm:text-5xl font-extrabold sm:font-black">
                      {currency.name}
                    </p>
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
          ) : (
            <div className="flex flex-row items-center justify-between">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-20" />
            </div>
          )}
        </div>

        <div className="pb-1 sm:pb-2">
          {Object.keys(dashboardData.main).length > 0 ? (
            <div className="flex flex-row items-center justify-between">
              <p className="text-xl sm:text-3xl font-semibold sm:font-bold">
                Balance
              </p>
              <p className="text-xl sm:text-3xl font-medium">
                {formatCurrency({
                  value: dashboardData.main.balance,
                  currency: currency.name
                })}
              </p>
            </div>
          ) : (
            <div className="flex flex-row items-center justify-between">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-20" />
            </div>
          )}
        </div>

        <div>
          {Object.keys(dashboardData.main).length > 0 ? (
            <div className="flex flex-row items-center justify-between">
              <p className="text-base sm:text-lg font-medium sm:font-semibold">
                Extra
              </p>
              <p className="text-base sm:text-lg font-medium sm:font-semibold">
                {formatCurrency({
                  value: dashboardData.main.extra,
                  currency: currency.name
                })}
              </p>
            </div>
          ) : (
            <div className="flex flex-row items-center justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col items-center pb-4">
        {Object.keys(dashboardData.main).length > 0 ? (
          <CircularProgress
            classNames={{
              svg: 'w-36 sm:w-64 h-36 sm:h-64 drop-shadow-md',
              // indicator: 'stroke-white',
              // track: 'stroke-white/10',
              value: 'text-3xl sm:text-6xl font-semibold'
            }}
            label="Completed"
            value={
              (dashboardData.main.totalPaidAmount /
                dashboardData.main.totalAmount) *
              100
            }
            strokeWidth={3}
            color="success"
            showValueLabel={true}
          />
        ) : (
          <Skeleton className="h-36 w-36 rounded-full" />
        )}
      </div>

      <ScrollShadow className="max-h-50vh pb-4" hideScrollBar>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 sm:gap-10 items-start justify-center">
          {dashboardData.categories.map(
            (category: DashboardDataCategoryResult) => (
              <div key={category._id}>
                <CategoryCard
                  category={category}
                  currency={currency.name}
                  handleCardClick={handleCardClick}
                />
              </div>
            )
          )}
        </div>
      </ScrollShadow>

      <Button
        variant="outline"
        className="my-4"
        onClick={handleAddTransactionButton}
      >
        Add Transaction
      </Button>

      <CategoryDrawer
        category={dashboardCategoryData}
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
      />

      <TransactionDrawer
        currencies={currencies}
        setDashboardData={setDashboardData}
        isTransactionDrawerOpen={isTransactionDrawerOpen}
        setIsTransactionDrawerOpen={setIsTransactionDrawerOpen}
      />
    </div>
  );
};

export default Dashboard;
