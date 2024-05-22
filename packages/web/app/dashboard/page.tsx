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
import { Progress } from '@/components/ui/progress';
import { CheckIcon, HandCoinsIcon } from 'lucide-react';
import {
  TransactionPaymentMainProps,
  TransactionPaymentCategoryProps
} from '../../../../shared/types/transactionPaymentTypes';

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

const fetchDashboardCategories = async () => {
  try {
    if (useMockedData) {
      return transactionPaymentsData;
    } else {
      const date = new Date();
      const currency = 'SGD';

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

  useEffect(() => {
    const fetchInitialData = async () => {
      const { main, categories } = await fetchDashboardCategories();

      setDashboardCategories(categories);
      setDashboardMainData(main);
    };

    fetchInitialData();
  }, []);

  const handleCardClick = (category: any) => {
    setDashboardCategory(category);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <main className="flex min-h-screen flex-col justify-around p-10">
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

        <div>
          <div className="pt-8">
            <Progress
              value={
                (dashboardMainData.totalPaidAmount /
                  dashboardMainData.totalAmount) *
                100
              }
            />
          </div>

          <div className="pt-4">
            <p className="text font-medium text-center">Completed</p>
          </div>

          <div>
            <p className="text-2xl font-bold text-center">
              {Math.floor(
                (dashboardMainData.totalPaidAmount /
                  dashboardMainData.totalAmount) *
                  100
              )}
              %
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:gap-1 lg:gap-6 items-start justify-center cursor-pointer">
        {dashboardCategories.map((category: any) => (
          <div className="p-5" key={category._id}>
            <Card onClick={() => handleCardClick(category)}>
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
                {/* <Separator /> */}
                <div className="flex flex-row items-center pt-2">
                  <p className="text-xs pr-2">
                    {Math.floor(
                      (category.totalPaidAmount / category.totalAmount) * 100
                    )}
                    %
                  </p>
                  <Progress
                    value={
                      (category.totalPaidAmount / category.totalAmount) * 100
                    }
                    className="w-[60%] h-2"
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
                        value={
                          (transaction.paidAmount / transaction.amount) * 100
                        }
                        className="h-3"
                      />
                    </div>
                    <div className="text-left">
                      <p className="text-xs">
                        {Math.floor(
                          (transaction.paidAmount / transaction.amount) * 100
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
    </main>
  );
};

export default Dashboard;
