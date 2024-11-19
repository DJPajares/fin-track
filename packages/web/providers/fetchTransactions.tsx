import axios from 'axios';
import mockData from '../../../shared/mockData/transactions.json';

const useMockedData = process.env.NEXT_PUBLIC_USE_MOCKED_DATA === 'true';

type TransactionProps = {
  type: string;
  date: Date;
};

const fetchTransactions = async ({ type, date }: TransactionProps) => {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/transactions/getAdvanced/`;

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
