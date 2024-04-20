import axios from 'axios';
import { useEffect, useState } from 'react';

const dashboardUrl = 'http://localhost:3000/api/v1/transactionPayments';

const fetchDashboardData = async (date: any, currency: string) => {
  try {
    // const res = await fetch(dashboardUrl, {
    //   method: 'POST',
    //   body: {
    //     date,
    //     currency
    //   }
    // });

    const { success, data } = axios.get(dashboardUrl, {
      date,
      currency
    });

    if (success) {
      console.log(data);

      return data;
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

  console.log(dashboardData);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24"></main>
  );
};

export default Dashboard;
