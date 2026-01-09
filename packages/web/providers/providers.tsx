'use client';

import { HeroUIProvider } from '@heroui/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { Provider as ReduxProvider } from 'react-redux';
import { AppStore, store } from '../lib/redux/store';
import { useRef } from 'react';
import { ClientDataProvider } from './clientDataProvider';
import { ThemeColorProvider } from './themeColorProvider';
import { ProtectedRoute } from '../components/shared/ProtectedRoute';

type ProviderProps = {
  children: React.ReactNode;
};

export function Providers({ children }: ProviderProps) {
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = store();
  }

  return (
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    <ReduxProvider store={storeRef.current!}>
      <HeroUIProvider>
        <NextThemesProvider attribute="class" defaultTheme="dark">
          <ThemeColorProvider />
          <ProtectedRoute>
            <ClientDataProvider>{children}</ClientDataProvider>
          </ProtectedRoute>
        </NextThemesProvider>
      </HeroUIProvider>
    </ReduxProvider>
  );
}
