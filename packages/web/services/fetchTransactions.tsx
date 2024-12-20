import axios from 'axios';

import transactionsData from '@shared/mockData/transactions.json';
import transactionsByCategoryData from '@shared/mockData/transactionsByCategory.json';
import transactionsDateRangeByTypeData from '@shared/mockData/transactionsDateRangeByType.json';

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
};

export type TransactionsDateRangeByTypeProps = {
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

const fetchTransactionsDateByCategory = async ({
  date,
  currency,
  type
}: TransactionsDateByCategoryProps) => {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/transactions/getByCategoryDate`;

  try {
    if (useMockedData) {
      return transactionsByCategoryData;
    } else {
      const postData = {
        date,
        currency,
        type
      };

      const { status, data } = await axios.post(url, postData);

      if (status === 200) return data;
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
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/transactions/getByTypeDateRange`;

  try {
    if (useMockedData) {
      return transactionsDateRangeByTypeData;
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

export {
  fetchTransactions,
  fetchTransactionsDateByCategory,
  fetchTransactionsDateRangeByType
};
