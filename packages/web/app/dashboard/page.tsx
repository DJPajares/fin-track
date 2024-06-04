'use client';

import axios from 'axios';
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
import { ScrollShadow } from '@nextui-org/react';
import { CircularProgress } from '@nextui-org/progress';
import CategoryCard from '@/components/dashboard/CategoryCard';
import { formatCurrency } from '../../../../shared/utilities/formatCurrency';
import { formatDate } from '../../../../shared/utilities/formatDate';
import transactionPaymentsData from '../../mockData/transactionPayments.json';
import currenciesData from '../../mockData/currencies.json';
import CategoryDrawer from '@/components/dashboard/CategoryDrawer';
import TransactionDrawer from '@/components/dashboard/TransactionDrawer';
import type {
  TransactionPaymentMainProps,
  TransactionPaymentCategoryProps
} from '../../../../shared/types/transactionPaymentTypes';
import type {
  DashboardCurrencyProps,
  DashboardDataProps
} from '../../../../shared/types/dashboardTypes';

const transactionPaymentsUrl =
  'http://localhost:3001/api/v1/transactionPayments';
const currenciesUrl = 'http://localhost:3001/api/v1/currencies';

const useMockedData = process.env.NEXT_PUBLIC_USE_MOCKED_DATA === 'true';

const initialTransactionPaymentCategory: TransactionPaymentCategoryProps = {
  _id: '',
  name: '',
  totalAmount: 0,
  totalPaidAmount: 0,
  paymentCompletionRate: 0,
  transactions: []
};

const fetchTransactionPayments = async ({
  date,
  currencyId
}: DashboardDataProps) => {
  try {
    if (useMockedData) {
      return transactionPaymentsData;
    } else {
      const { status, data } = await axios.post(transactionPaymentsUrl, {
        date,
        currency: currencyId
      });

      if (status === 200) return data.data;
    }
  } catch (error) {
    console.error('Fetch failed', error);
  }
};

const fetchCurrencies = async () => {
  try {
    if (useMockedData) {
      return currenciesData;
    } else {
      const { status, data } = await axios.get(`${currenciesUrl}?limit=20`);

      if (status === 200) return data.data;
    }
  } catch (error) {
    console.error('Fetch failed', error);
  }
};

const Dashboard = () => {
  const [dashboardMainData, setDashboardMainData] =
    useState<TransactionPaymentMainProps>({});
  const [dashboardCategoriesData, setDashboardCategoriesData] = useState([]);
  const [dashboardCategoryData, setDashboardCategoryData] = useState(
    initialTransactionPaymentCategory
  );
  const [date, setDate] = useState(new Date());
  const [currencies, setCurrencies] = useState<DashboardCurrencyProps[]>([]);
  const [currency, setCurrency] = useState<DashboardCurrencyProps>({});
  const [isDatePopoverOpen, setIsDatePopoverOpen] = useState(false);
  const [isCurrencyPopoverOpen, setIsCurrencyPopoverOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isTransactionDrawerOpen, setIsTransactionDrawerOpen] = useState(false);

  useEffect(() => {
    fetchCurrencyData();
  }, []);

  useEffect(() => {
    if (currencies.length > 0) {
      setCurrency(currencies[0]);
    }
  }, [currencies]);

  useEffect(() => {
    fetchDashboardData({ date, currencyId: currency._id });
  }, [date, currency]);

  const fetchDashboardData = async ({
    date,
    currencyId
  }: DashboardDataProps) => {
    const { main, categories } = await fetchTransactionPayments({
      date,
      currencyId
    });

    setDashboardCategoriesData(categories);
    setDashboardMainData(main);
  };

  const fetchCurrencyData = async () => {
    const data = await fetchCurrencies();

    setCurrencies(data);
  };

  const handleDateSelection = (newDate: any) => {
    setDate(newDate);
    setIsDatePopoverOpen(false);
  };

  const handleCurrencySelection = ({
    selectedCurrency
  }: {
    selectedCurrency: DashboardCurrencyProps;
  }) => {
    const { _id, name } = selectedCurrency;

    setCurrency({
      _id,
      name
    });
    setIsCurrencyPopoverOpen(false);
  };

  const handleCardClick = (category: TransactionPaymentCategoryProps) => {
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
          {Object.keys(dashboardMainData).length > 0 ? (
            <div className="flex flex-row items-center justify-between">
              {/* CALENDAR */}
              <Popover
                open={isDatePopoverOpen}
                onOpenChange={setIsDatePopoverOpen}
              >
                <PopoverTrigger asChild>
                  <Button variant="ghost" className="px-0">
                    <p className="text-3xl sm:text-5xl font-extrabold sm:font-black">
                      {formatDate(date)}
                    </p>
                    {/* <ChevronDownIcon className="h-4 w-4" /> */}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
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
          {Object.keys(dashboardMainData).length > 0 ? (
            <div className="flex flex-row items-center justify-between">
              <p className="text-xl sm:text-3xl font-semibold sm:font-bold">
                Balance
              </p>
              <p className="text-xl sm:text-3xl font-medium">
                {formatCurrency({
                  value: dashboardMainData.balance,
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
          {Object.keys(dashboardMainData).length > 0 ? (
            <div className="flex flex-row items-center justify-between">
              <p className="text-base sm:text-lg font-medium sm:font-semibold">
                Extra
              </p>
              <p className="text-base sm:text-lg font-medium sm:font-semibold">
                {formatCurrency({
                  value: dashboardMainData.extra,
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
        {Object.keys(dashboardMainData).length > 0 ? (
          <CircularProgress
            classNames={{
              svg: 'w-36 sm:w-64 h-36 sm:h-64 drop-shadow-md',
              // indicator: 'stroke-white',
              // track: 'stroke-white/10',
              value: 'text-3xl sm:text-6xl font-semibold'
            }}
            label="Completed"
            value={
              (dashboardMainData.totalPaidAmount /
                dashboardMainData.totalAmount) *
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
          {dashboardCategoriesData.map(
            (category: TransactionPaymentCategoryProps) => (
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
        Add
      </Button>

      <CategoryDrawer
        category={dashboardCategoryData}
        currency={currency}
        date={date}
        fetchDashboardData={fetchDashboardData}
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
      />

      <TransactionDrawer
        currencies={currencies}
        isTransactionDrawerOpen={isTransactionDrawerOpen}
        setIsTransactionDrawerOpen={setIsTransactionDrawerOpen}
      />
    </div>
  );
};

export default Dashboard;
