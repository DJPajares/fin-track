'use client';

import { HeroUIProvider } from '@heroui/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { Provider as ReduxProvider } from 'react-redux';
import { AppStore, store } from '../lib/redux/store';
import { useRef } from 'react';
import { ClientDataProvider } from './clientDataProvider';
import { ThemeColorProvider } from './themeColorProvider';
import { ProtectedRoute } from '../components/shared/ProtectedRoute';
import ErrorMessageModal from '../components/ErrorBoundary/ErrorMessageModal';
import { useAppDispatch, useAppSelector } from '../lib/hooks/use-redux';
import { clearMainError } from '../lib/redux/feature/main/mainSlice';

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
