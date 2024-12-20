'use client';

import { ReactNode, useEffect } from 'react';
import {
  setCategories,
  setCurrencies,
  setTypes
} from '../lib/redux/feature/main/mainSlice';
import { useAppDispatch } from '../lib/hooks/use-redux';

import fetchTypes from './fetchTypes';
import fetchCategories from './fetchCategories';
import fetchCurrencies from './fetchCurrencies';
import { CurrencyProps } from '@web/types/Currency';

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
      const sortedCurrencies = currencies.sort(
        (a: CurrencyProps, b: CurrencyProps) => {
          if (a.name === 'USD') return -1;
          if (b.name === 'USD') return 1;

          return a.name.localeCompare(b.name);
        }
      );
      dispatch(setCurrencies(sortedCurrencies));
    };

    fetchData();
  }, [dispatch]);

  return <>{children}</>;
};
