'use client';

import { NextUIProvider } from '@nextui-org/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { Provider as ReduxProvider } from 'react-redux';
import { AppStore, store } from '../lib/redux/store';
import { useRef } from 'react';
import { ClientDataProvider } from './clientDataProvider';

type ProviderProps = {
  children: React.ReactNode;
};

export function Providers({ children }: ProviderProps) {
  const storeRef = useRef<AppStore>();
  if (!storeRef.current) {
    storeRef.current = store();
  }

  return (
    <ReduxProvider store={storeRef.current}>
      <NextUIProvider>
        <NextThemesProvider attribute="class" defaultTheme="dark">
          <ClientDataProvider>{children}</ClientDataProvider>
        </NextThemesProvider>
      </NextUIProvider>
    </ReduxProvider>
  );
}
