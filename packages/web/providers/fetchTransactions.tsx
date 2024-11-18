import axios from 'axios';
import mockData from '../../../shared/mockData/transactions.json';

const useMockedData = process.env.NEXT_PUBLIC_USE_MOCKED_DATA === 'true';

type TransactionProps = {
  date: Date;
};

const fetchTransactions = async ({ date }: TransactionProps) => {
  const url = `http://localhost:3001/api/v1/transactions/getAdvanced/`;

  try {
    if (useMockedData) {
      return mockData;
    } else {
      const { status, data } = await axios.post(url, { date });

      if (status === 200) return data.data;
    }
  } catch (error) {
    console.error('Fetch failed', error);
  }
};

export default fetchTransactions;
