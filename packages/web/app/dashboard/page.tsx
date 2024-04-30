'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import transactionPaymentsData from '../../mockData/transactionPayments.json';
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

  useEffect(() => {
    const fetchInitialData = async () => {
      const { main, categories } = await fetchDashboardCategories();

      setDashboardCategories(categories);
      setDashboardMainData(main);
    };

    fetchInitialData();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="grid grid-cols-2 gap-6">
        {dashboardCategories.map((category: any) => (
          <div className="p-5" key={category._id}>
            <Dialog>
              <DialogTrigger>
                <Card>
                  <CardHeader>
                    <CardTitle>{category.name}</CardTitle>
                    <CardDescription>
                      {category.totalAmount.toFixed(2)}{' '}
                      {dashboardMainData.currency}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs">Settled</p>
                    <div className="flex flex-row items-center justify-between pt-2">
                      <Progress
                        value={
                          (category.totalPaidAmount / category.totalAmount) *
                          100
                        }
                        className="w-[60%]"
                      />
                      <p className="text-xs">
                        {Math.round(
                          (category.totalPaidAmount / category.totalAmount) *
                            100
                        )}
                        %
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{category.name}</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col">
                  {category.transactions.map((transaction: any) => (
                    <div
                      key={transaction._id}
                      // className="grid grid-flow-col auto-cols-max grid-cols-5 gap-2 items-center justify-stretch"
                      className="grid grid-cols-8 gap-2 items-center justify-stretch"
                    >
                      <div className="col-span-2">{transaction.name}</div>
                      <div className="text-center">{transaction.amount}</div>
                      <div className="col-span-2">
                        <Progress
                          value={
                            (transaction.paidAmount / transaction.amount) * 100
                          }
                        />
                      </div>
                      <div className="text-center">
                        {Math.round(
                          (transaction.paidAmount / transaction.amount) * 100
                        )}
                        %
                      </div>
                      <div className="text-end">
                        <Button variant="outline" size="icon">
                          <HandCoinsIcon className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="text-end">
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
        ))}
      </div>
    </main>
  );
};

export default Dashboard;
