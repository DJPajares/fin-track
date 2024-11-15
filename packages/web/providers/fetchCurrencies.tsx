import axios from 'axios';
import mockData from '../../../shared/mockData/currencies.json';

const url = 'http://localhost:3001/api/v1/currencies?sort=name';

const useMockedData = process.env.NEXT_PUBLIC_USE_MOCKED_DATA === 'true';

const fetchCurrencies = async () => {
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

export default fetchCurrencies;
