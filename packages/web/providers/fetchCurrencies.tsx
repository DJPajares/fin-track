import axios from 'axios';
import mockData from '../../../shared/mockData/currencies.json';

const url = `${process.env.NEXT_PUBLIC_BASE_URL}/currencies?sort=name`;

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
