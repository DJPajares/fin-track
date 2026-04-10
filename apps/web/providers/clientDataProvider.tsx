'use client';

import { STORAGE_KEYS } from '@web/constants/storageKeys';
import { useAppDispatch, useAppSelector } from '@web/lib/hooks/use-redux';
import { setDashboardCurrency } from '@web/lib/redux/feature/dashboard/dashboardSlice';
import {
  fetchCategories,
  setCurrencies,
  setTypes,
} from '@web/lib/redux/feature/main/mainSlice';
import { fetchCurrencies, fetchTypes } from '@web/services/api';
import { CurrencyProps } from '@web/types/Currency';
import { ReactNode, useEffect } from 'react';

type ClientDataProviderProps = {
  children: ReactNode;
};

export const ClientDataProvider = ({ children }: ClientDataProviderProps) => {
  const dispatch = useAppDispatch();

  const userId = useAppSelector((state) => state.auth.user)?.id || '';
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
  const { currency } = useAppSelector((state) => state.dashboard);

  useEffect(() => {
    const fetchData = async () => {
      dispatch(fetchCategories({ userId }));

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
      dispatch(
        setCurrencies(
          sortedCurrencies.map((c: CurrencyProps) => ({
            value: c._id,
            label: c.name,
          })),
        ),
      );

      // Set initial dashboard currency (if not set)
      // Currency is set during login from user settings
      if (sortedCurrencies.length > 0 && !currency.label) {
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
              (currency: CurrencyProps) => currency.name === 'SGD',
            ) || sortedCurrencies[0];
        }

        if (defaultCurrency) {
          dispatch(
            setDashboardCurrency({
              currency: {
                value: defaultCurrency._id,
                label: defaultCurrency.name,
              },
            }),
          );
        }
      }
    };

    if (isAuthenticated && !isLoading) {
      fetchData();
    }
  }, [dispatch, currency.label, isAuthenticated, isLoading, userId]);

  // Automatically sync currency to localStorage whenever it changes
  useEffect(() => {
    if (currency.label) {
      localStorage.setItem(
        STORAGE_KEYS.USER_CURRENCY,
        JSON.stringify(currency),
      );
    }
  }, [currency]);

  return <>{children}</>;
};
