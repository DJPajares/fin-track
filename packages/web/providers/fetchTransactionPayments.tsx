import axios from 'axios';
import transactionPaymentsData from '../../../shared/mockData/transactionPayments.json';
import type { DashboardDataProps } from '@/types/dashboardTypes';

const useMockedData = process.env.NEXT_PUBLIC_USE_MOCKED_DATA === 'true';

const transactionPaymentsUrl =
  'http://localhost:3001/api/v1/transactionPayments';

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
