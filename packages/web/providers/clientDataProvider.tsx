'use client';

import { ReactNode, useEffect } from 'react';
import axios from 'axios';
import { setCategories, setTypes } from '@/lib/feature/main/mainDataSlice';
import { useAppDispatch } from '@/lib/hooks';

import categoriesData from '../../../shared/mockData/categories.json';
import typesData from '../../../shared/mockData/types.json';

const useMockedData = process.env.NEXT_PUBLIC_USE_MOCKED_DATA === 'true';

const typesUrl = 'http://localhost:3001/api/v1/types';
const categoriesUrl =
  'http://localhost:3001/api/v1/categories?page=1&sort=-name';

const fetchTypes = async () => {
  try {
    if (useMockedData) {
      return typesData;
    } else {
      const { status, data } = await axios.get(typesUrl);

      if (status === 200) return data.data;
    }
  } catch (error) {
    console.error('Fetch failed', error);
  }
};

const fetchCategories = async () => {
  try {
    if (useMockedData) {
      return categoriesData;
    } else {
      const { status, data } = await axios.get(categoriesUrl);

      if (status === 200) return data.data;
    }
  } catch (error) {
    console.error('Fetch failed', error);
  }
};

type ClientDataProviderProps = {
  children: ReactNode;
};

export const ClientDataProvider = ({ children }: ClientDataProviderProps) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchCategoryData = async () => {
      const result = await fetchCategories();
      dispatch(setCategories(result));
    };

    const fetchTypeData = async () => {
      const result = await fetchTypes();

      dispatch(setTypes(result));
    };

    fetchCategoryData();
    fetchTypeData();
  }, [dispatch]);

  return <>{children}</>;
};
