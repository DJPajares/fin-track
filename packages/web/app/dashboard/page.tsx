'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import transactionPaymentsData from '../../mockData/transactionPayments.json';
import { formatCurrency } from '../../../shared/utilities/formatCurrency';
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
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckIcon, HandCoinsIcon } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const dashboardUrl = 'http://localhost:3001/api/v1/transactionPayments';

const useMockedData = process.env.NEXT_PUBLIC_USE_MOCKED_DATA === 'true';

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
  const [dashboardMainData, setDashboardMainData] = useState({});
  const [dashboardCategories, setDashboardCategories] = useState([]);
  const [dashboardCategory, setDashboardCategory] = useState({});
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
    <main className="flex min-h-screen flex-col items-center justify-around">
      <div className="grid grid-cols-2 gap-2">
        <div>
          <p>Balance</p>
          <p>Extra</p>
        </div>

        <div className="text-right">
          <p>{dashboardMainData.balance}</p>
          <p>{dashboardMainData.extra}</p>
        </div>

        <div className="col-span-2">
          <div className="flex flex-row items-center justify-between">
            <Progress
              value={
                (dashboardMainData.totalPaidAmount /
                  dashboardMainData.totalAmount) *
                100
              }
            />

            <p className="text-xs pr-2">
              {Math.round(
                (dashboardMainData.totalPaidAmount /
                  dashboardMainData.totalAmount) *
                  100
              )}
              %
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:gap-1 lg:gap-6 items-start justify-center">
        {dashboardCategories.map((category: any) => (
          <div className="p-5" key={category._id}>
            <Card onClick={() => handleCardClick(category)}>
              <CardHeader>
                <CardTitle>{category.name}</CardTitle>
                <CardDescription>
                  {formatCurrency({
                    value: category.totalAmount,
                    currency: dashboardMainData.currency
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-gray-500">Settled</p>
                {/* <Separator /> */}
                <div className="flex flex-row items-center pt-2">
                  <p className="text-xs pr-2">
                    {Math.round(
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
                        {Math.round(
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
