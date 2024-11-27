import axios from 'axios';

// import mockData from '@shared/mockData/categories.json';
import mockData from '@shared/mockData/categories.json';

const url = `${process.env.NEXT_PUBLIC_BASE_URL}/categories?sort=name`;

const useMockedData = process.env.NEXT_PUBLIC_USE_MOCKED_DATA === 'true';

const fetchCategories = async () => {
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

export default fetchCategories;
