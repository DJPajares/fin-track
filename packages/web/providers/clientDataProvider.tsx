'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setCategory } from '@/lib/feature/category/categorySlice';

import type { CategoryProps } from '@/types/Category';

import categoriesData from '../../../shared/mockData/categories.json';

const useMockedData = process.env.NEXT_PUBLIC_USE_MOCKED_DATA === 'true';

const categoriesUrl = 'http://localhost:3001/api/v1/categories/types';

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
  const dispatch = useDispatch();
  // const [categories, setCategories] = useState<CategoryProps>({});

  useEffect(() => {
    fetchCategoryData();
  }, []);

  const fetchCategoryData = async () => {
    const data = await fetchCategories();

    // setCategories(data);
    dispatch(setCategory(data));
  };

  return <>{children}</>;
};
