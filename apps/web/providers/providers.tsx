'use client';

import { HeroUIProvider } from '@heroui/react';
import ErrorMessageModal from '@web/components/ErrorBoundary/ErrorMessageModal';
import { ProtectedRoute } from '@web/components/shared/ProtectedRoute';
import { useAppDispatch, useAppSelector } from '@web/lib/hooks/use-redux';
import { clearMainError } from '@web/lib/redux/feature/main/mainSlice';
import { AppStore, store } from '@web/lib/redux/store';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { useState } from 'react';
import { Provider as ReduxProvider } from 'react-redux';

import { ClientDataProvider } from './clientDataProvider';
import { ThemeColorProvider } from './themeColorProvider';

type ProviderProps = {
  children: React.ReactNode;
};

const GlobalApiErrorModal = () => {
  const dispatch = useAppDispatch();
  const error = useAppSelector((state) => state.main.error);

  if (!error) {
    return null;
  }

  const handleClose = () => {
    dispatch(clearMainError());
  };

  return (
    <ErrorMessageModal isOpen={!!error} error={error} onClose={handleClose} />
  );
};

export function Providers({ children }: ProviderProps) {
  const [appStore] = useState<AppStore>(() => store());

  return (
    <ReduxProvider store={appStore}>
      <HeroUIProvider>
        <NextThemesProvider attribute="class" defaultTheme="dark">
          <ThemeColorProvider />
          <ProtectedRoute>
            <ClientDataProvider>
              <GlobalApiErrorModal />
              {children}
            </ClientDataProvider>
          </ProtectedRoute>
        </NextThemesProvider>
      </HeroUIProvider>
    </ReduxProvider>
  );
}
