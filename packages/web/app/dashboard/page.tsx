'use client';

import { useEffect, useMemo, useState } from 'react';
import moment from 'moment';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import {
  setDashboardCurrency,
  setDashboardDate
} from '@/lib/feature/dashboard/dashboardSlice';

import { ScrollShadow, CircularProgress } from '@nextui-org/react';
import { Button } from '@/components/ui/button';
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
import { Skeleton } from '@/components/ui/skeleton';
import { DatePicker } from '@/components/shared/DatePicker';

// import CategoryDialog from '@/app/dashboard/Category/CategoryDialog';
import CategoryCard from '@/app/dashboard/Category/CategoryCard';
import CategoryDrawer from '@/app/dashboard/Category/CategoryDrawer';
import TransactionDrawer from '@/app/dashboard/Transaction/TransactionDrawer';

import fetchTransactionPayments from '@/providers/fetchTransactionPayments';
import { formatCurrency } from '../../../../shared/utilities/formatCurrency';
import { dateStringFormat } from '../../../../shared/constants/dateStringFormat';

import type {
  DashboardSelectionItemsProps,
  DashboardDataProps,
  DashboardDataCategoryResult,
  DashboardDataResult
} from '../../types/Dashboard';

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
  totalAmount: 0,
  totalPaidAmount: 0,
  paymentCompletionRate: 0,
  transactions: []
};

const Dashboard = () => {
  const [dashboardData, setDashboardData] =
    useState<DashboardDataResult>(initialDashboardData);
  const [dashboardCategoryData, setDashboardCategoryData] = useState(
    initialTransactionPaymentCategory
  );
  const [isCurrencyPopoverOpen, setIsCurrencyPopoverOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isTransactionDrawerOpen, setIsTransactionDrawerOpen] = useState(false);

  const dispatch = useAppDispatch();

  const { currencies } = useAppSelector((state) => state.main);
  const dateString = useAppSelector((state) => state.dashboard.date);
  const currency = useAppSelector((state) => state.dashboard.currency);

  const date = useMemo(
    () => moment(dateString, dateStringFormat).toDate(),
    [dateString]
  );

  useEffect(() => {
    if (currencies.length > 0) {
      const dashboardCurrency = currencies.filter(
        (thisCurrency) => thisCurrency.name === currency.name
      );

      dispatch(
        setDashboardCurrency({
          currency: dashboardCurrency[0]
        })
      );
    }
  }, [currencies, currency]);

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

  const handleDateSelection = (date: Date) => {
    dispatch(
      setDashboardDate({
        date: moment(date).format(dateStringFormat)
      })
    );
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
    <div className="space-y-4 sm:space-y-8">
      <div>
        <div className="pb-2 sm:pb-6">
          <div className="flex flex-row items-center justify-between">
            {/* CALENDAR */}
            {date ? (
              <DatePicker date={date} onChange={handleDateSelection}>
                <Button variant="ghost" className="px-0">
                  <p className="text-3xl sm:text-5xl font-extrabold sm:font-black hover:underline hover:bg-background">
                    {moment(date).format('MMM yyyy')}
                  </p>
                </Button>
              </DatePicker>
            ) : (
              <Skeleton className="h-6 w-20" />
            )}

            {/* CURRENCY */}
            {currency ? (
              <Popover
                open={isCurrencyPopoverOpen}
                onOpenChange={setIsCurrencyPopoverOpen}
              >
                <PopoverTrigger asChild>
                  <Button variant="ghost" className="px-0">
                    <p className="text-3xl sm:text-5xl font-extrabold sm:font-black hover:underline hover:bg-background0">
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
            ) : (
              <Skeleton className="h-6 w-20" />
            )}
          </div>
        </div>

        <div className="pb-1 sm:pb-2">
          <div className="flex flex-row items-center justify-between">
            <p className="text-xl sm:text-3xl font-semibold sm:font-bold">
              Balance
            </p>

            {dashboardData.main.balance ? (
              <p className="text-xl sm:text-3xl font-medium">
                {formatCurrency({
                  value: dashboardData.main.balance,
                  currency: currency.name
                })}
              </p>
            ) : (
              <Skeleton className="h-6 w-20" />
            )}
          </div>
        </div>

        <div>
          <div className="flex flex-row items-center justify-between">
            <p className="text-base sm:text-lg font-medium sm:font-semibold">
              Extra
            </p>

            {dashboardData.main.extra ? (
              <p className="text-base sm:text-lg font-medium sm:font-semibold">
                {formatCurrency({
                  value: dashboardData.main.extra,
                  currency: currency.name
                })}
              </p>
            ) : (
              <Skeleton className="h-4 w-20" />
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center">
        {Object.keys(dashboardData.main).length > 0 ? (
          <CircularProgress
            classNames={{
              svg: 'w-36 sm:w-64 h-36 sm:h-64 drop-shadow-md',
              value: 'text-3xl sm:text-6xl font-semibold',
              indicator: 'stroke-primary'
            }}
            label="Completed"
            value={
              (dashboardData.main.totalPaidAmount /
                dashboardData.main.totalAmount) *
                100 || 0
            }
            strokeWidth={3}
            showValueLabel={true}
          />
        ) : (
          <Skeleton className="h-36 w-36 rounded-full" />
        )}
      </div>

      <ScrollShadow className="max-h-50vh" hideScrollBar>
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
        className="w-full my-4"
        onClick={handleAddTransactionButton}
      >
        Add Transaction
      </Button>

      <CategoryDrawer
        category={dashboardCategoryData}
        setDashboardData={setDashboardData}
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
      />

      {/* <CategoryDialog
        category={dashboardCategoryData}
        setDashboardData={setDashboardData}
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
      /> */}

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
