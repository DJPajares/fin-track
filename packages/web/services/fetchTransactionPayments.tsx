import axios from 'axios';

import transactionPaymentsData from '@shared/mockData/transactionPayments.json';

import type { DashboardDataProps } from '../types/Dashboard';

const useMockedData = process.env.NEXT_PUBLIC_USE_MOCKED_DATA === 'true';

const transactionPaymentsUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/transactionPayments`;

const fetchTransactionPayments = async ({
  date,
  currency
}: DashboardDataProps) => {
  try {
    if (useMockedData) {
      return transactionPaymentsData;
    } else {
      const { status, data } = await axios.post(transactionPaymentsUrl, {
        date,
        currency
      });

      if (status === 200) return data.data;
    }
  } catch (error) {
    console.error('Fetch failed', error);
  }
};

export default fetchTransactionPayments;
