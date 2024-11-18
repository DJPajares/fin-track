import axios from 'axios';
import mockData from '../../../shared/mockData/types.json';

// const url = 'http://localhost:3001/api/v1/types?sort=name';
const url = 'http://localhost:3001/api/v1/types';

const useMockedData = process.env.NEXT_PUBLIC_USE_MOCKED_DATA === 'true';

const fetchTypes = async () => {
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

export default fetchTypes;
