'use client';

import { HeroUIProvider } from '@heroui/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { Provider as ReduxProvider } from 'react-redux';
import { AppStore, store } from '../lib/redux/store';
import { useRef } from 'react';
import { ClientDataProvider } from './clientDataProvider';

type ProviderProps = {
  children: React.ReactNode;
};

export function Providers({ children }: ProviderProps) {
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = store();
  }

  return (
    <ReduxProvider store={storeRef.current!}>
      <HeroUIProvider>
        <NextThemesProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClientDataProvider>{children}</ClientDataProvider>
        </NextThemesProvider>
      </HeroUIProvider>
    </ReduxProvider>
  );
}
