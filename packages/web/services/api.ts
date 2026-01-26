import axios from 'axios';

import typesMockData from '@shared/mockData/types.json';
import categoriesMockData from '@shared/mockData/categories.json';
import currenciesMockData from '@shared/mockData/currencies.json';

import type { CustomCategoryRequest } from '@shared/types/Category';

const typesUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/types?sort=name`;
const currenciesUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/currencies?sort=name`;

const useMockedData = process.env.NEXT_PUBLIC_USE_MOCKED_DATA === 'true';

const fetchTypes = async () => {
  try {
    if (useMockedData) return typesMockData;

    const { status, data } = await axios.get(typesUrl);

    if (status === 200) return data.data;
  } catch (error) {
    console.error('Fetch failed', error);
  }
};

type CategoriesProps = {
  userId?: string;
};

const fetchCategories = async ({ userId }: CategoriesProps) => {
  try {
    if (useMockedData) return categoriesMockData;

    const categoriesUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/categories?sort=name${userId ? `&userId=${userId}` : ''}`;

    const { status, data } = await axios.get(categoriesUrl);

    if (status === 200) return data.data;
  } catch (error) {
    console.error('Fetch failed', error);
  }
};

const fetchCurrencies = async () => {
  try {
    if (useMockedData) return currenciesMockData;

    const { status, data } = await axios.get(currenciesUrl);

    if (status === 200) return data.data;
  } catch (error) {
    console.error('Fetch failed', error);
  }
};

const fetchCurrencyByName = async (name: string) => {
  try {
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/currencies/by-name/${name}`;

    const { status, data } = await axios.get(url);

    if (status === 200) return data;
  } catch (error) {
    console.error('Fetch currency by name failed', error);
    throw error;
  }
};

const createCustomCategory = async (categoryData: CustomCategoryRequest) => {
  try {
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/categories/custom`;

    const { status, data } = await axios.post(url, categoryData);

    if (status === 200) return data;
  } catch (error) {
    console.error('Create custom category failed', error);
    throw error;
  }
};

export {
  fetchTypes,
  fetchCategories,
  fetchCurrencies,
  fetchCurrencyByName,
  createCustomCategory,
};
