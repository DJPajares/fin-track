import axios from 'axios';
import mockData from '../../../shared/mockData/transactions.json';

const useMockedData = process.env.NEXT_PUBLIC_USE_MOCKED_DATA === 'true';

type TransactionProps = {
  type: string;
  date: Date;
  page?: number;
  limit?: number;
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

export default fetchTransactions;
