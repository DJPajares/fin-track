'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import transactionPaymentsData from '../../mockData/transactionPayments.json';

const dashboardUrl = 'http://localhost:3001/api/v1/transactionPayments';

const useMockedData = process.env.NEXT_PUBLIC_USE_MOCKED_DATA || false;

console.log(useMockedData);

const fetchDashboardCategories = async () => {
  try {
    if (useMockedData) {
      console.log(transactionPaymentsData);
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

const Modal = ({
  isOpen,
  onClose
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
      <div className="bg-white p-8 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Modal Title</h2>
        <p>Modal content goes here.</p>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [dashboardMainData, setDashboardMainData] = useState({});
  const [dashboardCategories, setDashboardCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
            className="flex flex-col"
            onClick={() => setIsModalOpen(true)}
          >
            <div className="border-2 border-solid rounded-lg p-8 m-2">
              <div>{category.name}</div>
              <div>{category.totalAmount}</div>
            </div>
          </div>
        ))}
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </main>
  );
};

export default Dashboard;
