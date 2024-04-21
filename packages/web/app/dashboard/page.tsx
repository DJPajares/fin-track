'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';

const dashboardUrl = 'http://localhost:3001/api/v1/transactionPayments';

const fetchDashboardCategories = async () => {
  try {
    const date = new Date();
    const currency = 'SGD';

    const { status, data } = await axios.post(dashboardUrl, {
      date,
      currency
    });

    if (status === 200) {
      return data.data;
    }
  } catch (error) {
    console.error('Fetch failed', error);
  }
};

const openCard = () => {};

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
      <div className="flex flex-row align-middle">
        {dashboardCategories.map((category: any) => (
          <div
            key={category._id}
            className="flex flex-col border-2 border-solid border-black rounded-lg p-8 m-8"
            onClick={openCard}
          >
            <div className="text-lg font-bold">{category.name}</div>
            <div>{category.totalAmount}</div>
            <div className="text-sm">Settled</div>
            <div>{category.paymentCompletionRate}</div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default Dashboard;
