'use client';

import { ReactNode, useEffect } from 'react';
import {
  setCategories,
  setCurrencies,
  setTypes
} from '@/lib/feature/main/mainDataSlice';
import { useAppDispatch } from '@/lib/hooks';

import fetchTypes from './fetchTypes';
import fetchCategories from './fetchCategories';
import fetchCurrencies from './fetchCurrencies';

type ClientDataProviderProps = {
  children: ReactNode;
};

export const ClientDataProvider = ({ children }: ClientDataProviderProps) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchData = async () => {
      const categories = await fetchCategories();
      dispatch(setCategories(categories));

      const types = await fetchTypes();
      dispatch(setTypes(types));

      const currencies = await fetchCurrencies();
      dispatch(setCurrencies(currencies));
    };

    fetchData();
  }, [dispatch]);

  return <>{children}</>;
};
