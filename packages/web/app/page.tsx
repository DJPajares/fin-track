import Image from 'next/image';
import { useEffect, useState } from 'react';

const dashboardUrl = 'http://localhost:3000/api/v1/transactionPayments';

const fetchDashboardData = async (date: Date, currency: string) => {
  try {
    const res = await fetch(dashboardUrl, {
      method: 'POST',
      body: {
        date,
        currency
      }
    });

    if (res.status === 200) {
      console.log(res.data);

      return res.data;
    }
  } catch (error) {
    console.error('Fetch failed', error);
  }
};

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState([]);

  useEffect(() => {
    const date = new Date();
    const currency = 'SGD';

    const fetchInitialData = async () => {
      setDashboardData(await fetchDashboardData(date, currency));
    };

    fetchInitialData();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24"></main>
  );
};

export default Dashboard;
