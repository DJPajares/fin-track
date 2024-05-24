'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import transactionPaymentsData from '../../mockData/transactionPayments.json';
import { formatCurrency } from '../../../../shared/utilities/formatCurrency';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
// import { Progress } from '@/components/ui/progress';
import {
  CheckIcon,
  ChevronDownIcon,
  HandCoinsIcon,
  MenuIcon
} from 'lucide-react';
import {
  TransactionPaymentMainProps,
  TransactionPaymentCategoryProps
} from '../../../../shared/types/transactionPaymentTypes';
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
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import { formatDate } from '../../../../shared/utilities/formatDate';
import { CircularProgress, Progress } from '@nextui-org/progress';
import {
  Navbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle
} from '@nextui-org/navbar';
import { Link, ScrollShadow } from '@nextui-org/react';

const dashboardUrl = 'http://localhost:3001/api/v1/transactionPayments';

const useMockedData = process.env.NEXT_PUBLIC_USE_MOCKED_DATA === 'true';

const initialMainData = {
  currency: 'PHP',
  budget: 0,
  totalAmount: 0,
  totalPaidAmount: 0,
  balance: 0,
  extra: 0,
  paymentCompletionRate: 0
};

const initialCategoryData = {
  _id: '',
  name: '',
  totalAmount: 0,
  totalPaidAmount: 0,
  paymentCompletionRate: 0,
  transactions: []
};

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
    useState<TransactionPaymentMainProps>(initialMainData);
  const [dashboardCategories, setDashboardCategories] = useState([]);
  const [dashboardCategory, setDashboardCategory] =
    useState<TransactionPaymentCategoryProps>(initialCategoryData);
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

  const changeDate = async (newDate: Date) => {
    setDate(newDate);
    setOpenDatePopover(false);
    // await fetchDashboardData(newDate, currency);
  };

  // const changeCurrency = async (currency: string) => {
  //   await fetchDashboardData(date, currency);
  // };

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

      <div>
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
      </div>

      {/* CONTENT */}
      <div className="flex flex-col justify-between p-10">
        <div className="flex flex-row items-center justify-between">
          <Popover open={openDatePopover} onOpenChange={setOpenDatePopover}>
            <PopoverTrigger asChild>
              <div className="flex flex-row items-center cursor-pointer">
                <p className="text-2xl font-bold pr-2">{formatDate(date)}</p>
                <ChevronDownIcon className="h-4 w-4" />
              </div>
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
              <div className="flex flex-row items-center cursor-pointer">
                <p className="text-2xl font-bold">{currency}</p>
              </div>
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
                          // changeCurrency(currentValue);
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

        <div className="flex flex-col justify-around">
          <div className="flex flex-row items-center justify-between">
            <p className="text-xl font-medium">Balance</p>
            <p className="text-xl font-medium">
              {formatCurrency({
                value: dashboardMainData.balance,
                currency: dashboardMainData.currency
              })}
            </p>
          </div>

          <div className="flex flex-row items-center justify-between">
            <p className="text-sm">Extra</p>
            <p className="text-sm">
              {formatCurrency({
                value: dashboardMainData.extra,
                currency: dashboardMainData.currency
              })}
            </p>
          </div>

          <div className="flex flex-col items-center">
            {/* <Progress
                value={
                  (dashboardMainData.totalPaidAmount /
                    dashboardMainData.totalAmount) *
                  100
                }
              /> */}
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
          </div>
        </div>

        <ScrollShadow className="max-h-[500px]">
          <div className="grid grid-cols-2 sm:gap-1 lg:gap-6 items-start justify-center">
            {dashboardCategories.map((category: any) => (
              <div className="p-5" key={category._id}>
                <Card
                  onClick={() => handleCardClick(category)}
                  className="cursor-pointer"
                >
                  <CardHeader>
                    <CardDescription>{category.name}</CardDescription>
                    <CardTitle>
                      {formatCurrency({
                        value: category.totalAmount,
                        currency: dashboardMainData.currency
                      })}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-gray-500">Settled</p>

                    <div className="flex flex-row items-center pt-2">
                      <p className="text-xs pr-2">
                        {Math.floor(
                          (category.totalPaidAmount / category.totalAmount) *
                            100
                        )}
                        %
                      </p>
                      {/* <Progress
                      value={
                        (category.totalPaidAmount / category.totalAmount) * 100
                      }
                      className="w-[60%] h-2"
                    /> */}
                      <Progress
                        color="success"
                        aria-label="Loading..."
                        value={
                          (category.totalPaidAmount / category.totalAmount) *
                          100
                        }
                        size="sm"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}

            <Dialog open={openDialog} onOpenChange={handleCloseDialog}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{dashboardCategory.name}</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col">
                  {Object.keys(dashboardCategory).length > 0 &&
                    dashboardCategory.transactions.map((transaction: any) => (
                      <div
                        key={transaction._id}
                        // className="grid grid-flow-col auto-cols-max grid-cols-5 gap-2 items-center justify-stretch"
                        className="grid grid-cols-9 gap-2 items-center py-1"
                      >
                        <div className="col-span-2">{transaction.name}</div>
                        <div className="col-span-2 text-right">
                          <p className="text-sm">
                            {formatCurrency({
                              value: transaction.amount,
                              currency: dashboardMainData.currency
                            })}
                          </p>
                        </div>
                        <div className="col-span-2">
                          <Progress
                            color="success"
                            aria-label="Loading..."
                            value={
                              (transaction.paidAmount / transaction.amount) *
                              100
                            }
                            size="sm"
                          />
                        </div>
                        <div className="text-left">
                          <p className="text-xs">
                            {Math.floor(
                              (transaction.paidAmount / transaction.amount) *
                                100
                            )}
                            %
                          </p>
                        </div>
                        <div className="flex flex-row justify-end col-span-2">
                          <Button variant="outline" size="icon">
                            <HandCoinsIcon className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon">
                            <CheckIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
                <DialogFooter>
                  <DialogClose>
                    <Button>OK</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </ScrollShadow>
      </div>
    </main>
  );
};

export default Dashboard;
