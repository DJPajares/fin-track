'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
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
import { CircularProgress } from '@nextui-org/progress';
import {
  Navbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle
} from '@nextui-org/navbar';
import { Link, ScrollShadow } from '@nextui-org/react';
import CategoryCard from '@/components/dashboard/CategoryCard';
import CategoryModal from '@/components/dashboard/CategoryModal';
import transactionPaymentsData from '../../mockData/transactionPayments.json';
import { formatCurrency } from '../../../../shared/utilities/formatCurrency';
import { formatDate } from '../../../../shared/utilities/formatDate';
import type {
  TransactionPaymentMainProps,
  TransactionPaymentCategoryProps
} from '../../../../shared/types/transactionPaymentTypes';
import { Skeleton } from '@/components/ui/skeleton';

const dashboardUrl = 'http://localhost:3001/api/v1/transactionPayments';

const useMockedData = process.env.NEXT_PUBLIC_USE_MOCKED_DATA === 'true';

const currencies = [
  {
    id: 'sgd',
    name: 'SGD'
  },
  {
    id: 'php',
    name: 'PHP'
  },
  {
    id: 'usd',
    name: 'USD'
  },
  {
    id: 'jpy',
    name: 'JPY'
  }
];

const menuItems = [
  'Profile',
  'Dashboard',
  'Transactions',
  'Analytics',
  'System',
  'Deployments',
  'My Settings',
  'Team Settings',
  'Help & Feedback',
  'Log Out'
];

const fetchTransactionPayments = async (date: Date, currency: string) => {
  try {
    if (useMockedData) {
      return transactionPaymentsData;
    } else {
      const { status, data } = await axios.post(dashboardUrl, {
        date,
        currency
      });

      if (status === 200) {
        return data.data;
      }
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
  const [openDialog, setOpenDialog] = useState(false);
  const [date, setDate] = useState(new Date());
  const [openDatePopover, setOpenDatePopover] = useState(false);
  const [currency, setCurrency] = useState('PHP');
  const [openCurrencyPopover, setOpenCurrencyPopover] = useState(false);

  useEffect(() => {
    fetchDashboardData(date, currency);
  }, []);

  useEffect(() => {
    fetchDashboardData(date, currency);
  }, [date, currency]);

  const fetchDashboardData = async (date: Date, currency: string) => {
    const { main, categories } = await fetchTransactionPayments(date, currency);

    setDashboardCategories(categories);
    setDashboardMainData(main);
  };

  const changeDate = async (newDate: any) => {
    setDate(newDate);
    setOpenDatePopover(false);
  };

  const handleCardClick = (category: any) => {
    setDashboardCategory(category);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <main className="flex flex-col min-h-screen">
      {/* MAIN MENU */}
      {/* <div className="flex flex-row justify-end p-2">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <MenuIcon className="h-8 w-8" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <p className="text-left text-lg font-semibold">Main Menu</p>
            </SheetHeader>
            <div className="flex flex-col justify-start py-6">
              <p>Dashboard</p>
              <p>Transactions</p>
            </div>
          </SheetContent>
        </Sheet>
      </div> */}

      <Navbar>
        <NavbarContent justify="start">
          <NavbarMenuToggle />
        </NavbarContent>
        <NavbarMenu>
          {menuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                color={
                  index === 2
                    ? 'primary'
                    : index === menuItems.length - 1
                    ? 'danger'
                    : 'foreground'
                }
                className="w-full"
                href="#"
                size="lg"
              >
                {item}
              </Link>
            </NavbarMenuItem>
          ))}
        </NavbarMenu>
      </Navbar>

      {/* CONTENT */}
      <div className="flex flex-col justify-between p-10">
        <div>
          <div className="py-2">
            {Object.keys(dashboardMainData).length > 0 ? (
              <div className="flex flex-row items-center justify-between">
                <Popover
                  open={openDatePopover}
                  onOpenChange={setOpenDatePopover}
                >
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
                              key={currency.id}
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

          <div className="py-1">
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

          <div className="py-1">
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

          <div className="flex flex-col items-center">
            {Object.keys(dashboardMainData).length > 0 ? (
              <CircularProgress
                classNames={{
                  svg: 'w-36 h-36 drop-shadow-md',
                  // indicator: 'stroke-white',
                  track: 'stroke-white/10',
                  value: 'text-3xl font-semibold'
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
        </div>

        <ScrollShadow className="max-h-[500px]">
          <div className="grid grid-cols-2 sm:gap-1 lg:gap-6 items-start justify-center">
            {dashboardCategories.map(
              (category: TransactionPaymentCategoryProps) => (
                <div className="p-5" key={category._id}>
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

        <CategoryModal
          category={dashboardCategory}
          currency={dashboardMainData.currency}
          openDialog={openDialog}
          handleCloseDialog={handleCloseDialog}
        />
      </div>
    </main>
  );
};

export default Dashboard;
