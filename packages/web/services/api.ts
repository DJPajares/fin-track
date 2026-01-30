import axios, { AxiosError, AxiosRequestConfig } from 'axios';

import typesMockData from '@shared/mockData/types.json';
import currenciesMockData from '@shared/mockData/currencies.json';

import type {
  CustomCategoryRequest,
  FetchCategoryRequest,
} from '@shared/types/Category';
import { ErrorProps } from '@shared/types/Error';

const config: AxiosRequestConfig = {
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  },
};

const api = axios.create(config);

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    throw error;
  },
);

const handleApiError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;

    return {
      message: axiosError.message || 'An unexpected error occurred',
      status: axiosError.response?.status || 500,
      code: axiosError.code || 'UNKNOWN_ERROR',
      data: axiosError.response?.data as ErrorProps,
    };
  }

  return {
    message: 'An unknown error occurred',
    status: 500,
    code: 'UNKNOWN_ERROR',
    data: {
      message: 'An unknown error occurred',
    },
  };
};

const fetchCategoriesApi = async ({ userId }: FetchCategoryRequest) => {
  const url = `categories?sort=name${userId ? `&userId=${userId}` : ''}`;

  try {
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const createCustomCategoryApi = async (categoryData: CustomCategoryRequest) => {
  const url = `categories/custom`;

  try {
    const response = await api.post(url, categoryData);

    return response.data;
  } catch (error) {
    console.error('Create custom category failed', error);
    throw error;
  }
};

const updateCategoryApi = async (categoryData: CustomCategoryRequest) => {
  const url = `categories/${categoryData._id}`;

  try {
    const response = await api.put(url, categoryData);

    return response.data;
  } catch (error) {
    // console.error('Update category failed', error);
    throw handleApiError(error);
  }
};

// --- old implementation below ---

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

export {
  fetchCategoriesApi,
  createCustomCategoryApi,
  updateCategoryApi,
  fetchTypes,
  fetchCurrencies,
  fetchCurrencyByName,
};
