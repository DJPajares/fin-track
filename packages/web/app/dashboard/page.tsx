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
import type {
  TransactionPaymentMainProps,
  TransactionPaymentCategoryProps
} from '../../../../shared/types/transactionPaymentTypes';
import type { CurrencyProps } from '../../../api/src/models/v1/currencyModel';
import CategoryDrawer from '@/components/dashboard/CategoryDrawer';

const transactionPaymentsUrl =
  'http://localhost:3001/api/v1/transactionPayments';
const currenciesUrl = 'http://localhost:3001/api/v1/currencies';

const useMockedData = process.env.NEXT_PUBLIC_USE_MOCKED_DATA === 'true';

const fetchTransactionPayments = async (date: Date, currency: string) => {
  try {
    if (useMockedData) {
      return transactionPaymentsData;
    } else {
      const { status, data } = await axios.post(transactionPaymentsUrl, {
        date,
        currency
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
  const [dashboardCategories, setDashboardCategories] = useState([]);
  const [dashboardCategory, setDashboardCategory] =
    useState<TransactionPaymentCategoryProps>({});
  const [currencies, setCurrencies] = useState<CurrencyProps[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [date, setDate] = useState(new Date());
  const [openDatePopover, setOpenDatePopover] = useState(false);
  const [currency, setCurrency] = useState('PHP');
  const [openCurrencyPopover, setOpenCurrencyPopover] = useState(false);

  useEffect(() => {
    fetchDashboardData(date, currency);
    fetchCurrencyData();
  }, []);

  useEffect(() => {
    fetchDashboardData(date, currency);
  }, [date, currency]);

  const fetchDashboardData = async (date: Date, currency: string) => {
    const { main, categories } = await fetchTransactionPayments(date, currency);

    setDashboardCategories(categories);
    setDashboardMainData(main);
  };

  const fetchCurrencyData = async () => {
    const data = await fetchCurrencies();

    setCurrencies(data);
  };

  const changeDate = async (newDate: any) => {
    setDate(newDate);
    setOpenDatePopover(false);
  };

  const handleCardClick = (category: any) => {
    setDashboardCategory(category);
    setIsDialogOpen(true);
  };

  return (
    <div className="flex flex-col p-6">
      <div className="py-2">
        <div className="pb-4">
          {Object.keys(dashboardMainData).length > 0 ? (
            <div className="flex flex-row items-center justify-between">
              <Popover open={openDatePopover} onOpenChange={setOpenDatePopover}>
                <PopoverTrigger asChild>
                  <Button variant="ghost" className="px-0">
                    <p className="text-3xl font-extrabold pr-2">
                      {formatDate(date)}
                    </p>
                    {/* <ChevronDownIcon className="h-4 w-4" /> */}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={changeDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <Popover
                open={openCurrencyPopover}
                onOpenChange={setOpenCurrencyPopover}
              >
                <PopoverTrigger asChild>
                  <Button variant="ghost" className="px-0">
                    <p className="text-3xl font-extrabold">{currency}</p>
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
                            key={currency._id.toString()}
                            value={currency.name}
                            onSelect={(currentValue: any) => {
                              setCurrency(
                                currentValue === currency ? '' : currentValue
                              );
                              setOpenCurrencyPopover(false);
                            }}
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

        <div className="pb-2">
          {Object.keys(dashboardMainData).length > 0 ? (
            <div className="flex flex-row items-center justify-between">
              <p className="text-xl font-medium">Balance</p>
              <p className="text-xl font-medium">
                {formatCurrency({
                  value: dashboardMainData.balance,
                  currency: dashboardMainData.currency
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
              <p className="text-sm">Extra</p>
              <p className="text-sm">
                {formatCurrency({
                  value: dashboardMainData.extra,
                  currency: dashboardMainData.currency
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

      <div className="flex flex-col items-center py-4">
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

      <ScrollShadow className="max-h-[400px] py-4" hideScrollBar>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 sm:gap-10 items-start justify-center">
          {dashboardCategories.map(
            (category: TransactionPaymentCategoryProps) => (
              <div key={category._id}>
                <CategoryCard
                  category={category}
                  currency={dashboardMainData.currency}
                  handleCardClick={handleCardClick}
                />
              </div>
            )
          )}
        </div>
      </ScrollShadow>

      <CategoryDrawer
        category={dashboardCategory}
        currency={dashboardMainData.currency}
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
      />
    </div>
  );
};

export default Dashboard;
