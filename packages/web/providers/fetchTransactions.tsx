import axios from 'axios';
import mockData from '../../../shared/mockData/transactions.json';

const useMockedData = process.env.NEXT_PUBLIC_USE_MOCKED_DATA === 'true';

type TransactionProps = {
  page: string;
  limit: string;
  sortField: string;
};

const fetchTransactions = async ({
  page,
  limit,
  sortField
}: TransactionProps) => {
  const url = `http://localhost:3001/api/v1/transactions?page=${page}&limit=${limit}&sort=${sortField}`;

  try {
    if (useMockedData) {
      return mockData;
    } else {
      const { status, data } = await axios.get(url);

      if (status === 200) return data.data;
    }
  } catch (error) {
    console.error('Fetch failed', error);
  }
};

export default fetchTransactions;
