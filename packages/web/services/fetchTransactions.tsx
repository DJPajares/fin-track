import axios from 'axios';

import transactionsData from '@shared/mockData/transactions.json';

const useMockedData = process.env.NEXT_PUBLIC_USE_MOCKED_DATA === 'true';

export type TransactionProps = {
  type: string;
  date: Date;
  page?: number;
  limit?: number;
};

export type TransactionsDateByCategoryProps = {
  date: Date;
  currency: string;
  type?: string;
  userId: string;
};

export type TransactionsDateRangeByTypeProps = {
  startDate: Date;
  endDate: Date;
  currency: string;
  userId: string;
};

const fetchTransactions = async ({
  type,
  date,
  page = 1,
  limit = 5,
}: TransactionProps) => {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/transactions/getAdvanced?page=${page}&limit=${limit}`;

  try {
    if (useMockedData) {
      return transactionsData;
    } else {
      const postData = { type, date };

      const { status, data } = await axios.post(url, postData);

      if (status === 200) return data.data;
    }
  } catch (error) {
    console.error('Fetch failed', error);
  }
};

export { fetchTransactions };
