import axios from 'axios';
import currenciesData from '../../../shared/mockData/currencies.json';

const currenciesUrl = 'http://localhost:3001/api/v1/currencies?sort=name';

const useMockedData = process.env.NEXT_PUBLIC_USE_MOCKED_DATA === 'true';

const fetchCurrencies = async () => {
  try {
    if (useMockedData) {
      return currenciesData;
    } else {
      const { status, data } = await axios.get(currenciesUrl);

      if (status === 200) return data.data;
    }
  } catch (error) {
    console.error('Fetch failed', error);
  }
};

export default fetchCurrencies;
