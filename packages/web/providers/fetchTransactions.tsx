import axios from 'axios';
import mockData from '../../../shared/mockData/transactions.json';

const useMockedData = process.env.NEXT_PUBLIC_USE_MOCKED_DATA === 'true';

type TransactionProps = {
  type: string;
  date: Date;
  page?: number;
  limit?: number;
};

type TransactionsDateRangeByTypeProps = {
  startDate: Date;
  endDate: Date;
  currency: string;
};

const fetchTransactions = async ({
  type,
  date,
  page = 1,
  limit = 5
}: TransactionProps) => {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/transactions/getAdvanced?page=${page}&limit=${limit}`;

  try {
    if (useMockedData) {
      return mockData;
    } else {
      const postData = { type, date };

      const { status, data } = await axios.post(url, postData);

      if (status === 200) return data.data;
    }
  } catch (error) {
    console.error('Fetch failed', error);
  }
};

const fetchTransactionsDateRangeByType = async ({
  startDate,
  endDate,
  currency
}: TransactionsDateRangeByTypeProps) => {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/transactions/getDateRangeByType`;

  try {
    if (useMockedData) {
      return mockData;
    } else {
      const postData = {
        startDate,
        endDate,
        currency
      };

      const { status, data } = await axios.post(url, postData);

      if (status === 200) return data;
    }
  } catch (error) {
    console.error('Fetch failed', error);
  }
};

export { fetchTransactions, fetchTransactionsDateRangeByType };
