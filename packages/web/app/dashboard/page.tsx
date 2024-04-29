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
      <div className="flex flex-row">
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
                    <div>Settled</div>
                    <div>
                      {Math.round(
                        (category.totalPaidAmount / category.totalAmount) * 100
                      )}
                      %
                    </div>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{category.name}</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col mb-8">
                  {category.transactions.map((transaction: any) => (
                    <div
                      key={transaction._id}
                      className="flex flex-row items-center justify-between"
                    >
                      <div>{transaction.name}: </div>
                      <div>
                        {Math.round(
                          (transaction.paidAmount / transaction.amount) * 100
                        )}
                        %
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
