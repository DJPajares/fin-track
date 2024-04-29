'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import transactionPaymentsData from '../../mockData/transactionPayments.json';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  category: any;
};

const Modal = ({ isOpen, onClose, category }: ModalProps) => {
  if (!isOpen) return null;

  const { name, transactions } = category;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
      <div className="bg-black p-8 rounded-lg">
        <div className="flex flex-row items-center align-middle justify-between mb-8">
          <h2 className="text-xl font-bold">{name}</h2>
          <button onClick={onClose}>X</button>
        </div>
        <div className="flex flex-col mb-8">
          {transactions.map((transaction: any) => (
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
        <div className="flex flex-col items-end">
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const dashboardUrl = 'http://localhost:3001/api/v1/transactionPayments';

const useMockedData = process.env.NEXT_PUBLIC_USE_MOCKED_DATA;

console.log(useMockedData);

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dashboardCategory, setDashboardCategory] = useState({});

  useEffect(() => {
    const fetchInitialData = async () => {
      const { main, categories } = await fetchDashboardCategories();

      setDashboardCategories(categories);
      setDashboardMainData(main);
    };

    fetchInitialData();
  }, []);

  const openModal = (category: any) => {
    setIsModalOpen(true);
    setDashboardCategory(category);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex flex-row align-middle">
        {dashboardCategories.map((category: any) => (
          <div key={category._id} onClick={() => openModal(category)}>
            <div className="border-2 border-solid rounded-lg p-8 m-2">
              <div>{category.name}</div>
              <div>
                {category.totalAmount} {dashboardMainData.currency}
              </div>
              <div>Settled</div>
              <div>
                {Math.round(
                  (category.totalPaidAmount / category.totalAmount) * 100
                )}
                %
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        category={dashboardCategory}
      />
    </main>
  );
};

export default Dashboard;
