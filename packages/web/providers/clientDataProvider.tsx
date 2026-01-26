'use client';

import { ReactNode, useEffect } from 'react';
import {
  setCategories,
  setCurrencies,
  setTypes,
} from '../lib/redux/feature/main/mainSlice';
import {
  DashboardSliceProps,
  setDashboardCurrency,
} from '../lib/redux/feature/dashboard/dashboardSlice';
import { useAppDispatch, useAppSelector } from '../lib/hooks/use-redux';
import {
  fetchTypes,
  fetchCategories,
  fetchCurrencies,
} from '@web/services/api';

import { CurrencyProps } from '@web/types/Currency';
import { STORAGE_KEYS } from '@web/constants/storageKeys';

type ClientDataProviderProps = {
  children: ReactNode;
};

export const ClientDataProvider = ({ children }: ClientDataProviderProps) => {
  const dispatch = useAppDispatch();

  const userId = useAppSelector((state) => state.auth.user)?.id || '';
  const { currency } = useAppSelector((state) => state.dashboard);

  useEffect(() => {
    const fetchData = async () => {
      const categories = await fetchCategories({ userId });
      dispatch(setCategories(categories));

      const types = await fetchTypes();
      dispatch(setTypes(types));

      const currencies = await fetchCurrencies();
      const sortedCurrencies = currencies.sort(
        (a: CurrencyProps, b: CurrencyProps) => {
          if (a.name === 'USD') return -1;
          if (b.name === 'USD') return 1;

          return a.name.localeCompare(b.name);
        },
      );
      dispatch(setCurrencies(sortedCurrencies));

      // Set initial dashboard currency (if not set)
      // Currency is set during login from user settings
      if (sortedCurrencies.length > 0 && !currency.name) {
        // Try to load from localStorage first
        const storedCurrency = localStorage.getItem(STORAGE_KEYS.USER_CURRENCY);
        let defaultCurrency: CurrencyProps | undefined;

        if (storedCurrency) {
          try {
            const parsed = JSON.parse(storedCurrency);
            defaultCurrency = sortedCurrencies.find(
              (c: CurrencyProps) => c.name === parsed.name,
            );
          } catch {
            // Invalid JSON, ignore
          }
        }

        // Fallback to SGD or first currency if not in localStorage
        if (!defaultCurrency) {
          defaultCurrency =
            sortedCurrencies.find(
              (currency: DashboardSliceProps['currency']) =>
                currency.name === 'SGD',
            ) || sortedCurrencies[0];
        }

        if (defaultCurrency) {
          dispatch(
            setDashboardCurrency({
              currency: defaultCurrency,
            }),
          );
        }
      }
    };

    fetchData();
  }, [dispatch, currency.name]);

  // Automatically sync currency to localStorage whenever it changes
  useEffect(() => {
    if (currency.name) {
      localStorage.setItem(
        STORAGE_KEYS.USER_CURRENCY,
        JSON.stringify(currency),
      );
    }
  }, [currency]);

  return <>{children}</>;
};
