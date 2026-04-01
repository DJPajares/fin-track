'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { useMemo } from 'react';
import { Provider as ReduxProvider } from 'react-redux';

import ErrorMessageModal from '../components/ErrorBoundary/ErrorMessageModal';
import { ProtectedRoute } from '../components/shared/ProtectedRoute';
import { useAppDispatch, useAppSelector } from '../lib/hooks/use-redux';
import { clearMainError } from '../lib/redux/feature/main/mainSlice';
import { store } from '../lib/redux/store';
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
  const appStore = useMemo(() => store(), []);

  return (
    <ReduxProvider store={appStore}>
      <NextThemesProvider attribute="class" defaultTheme="dark">
        <ThemeColorProvider />
        <ProtectedRoute>
          <ClientDataProvider>
            <GlobalApiErrorModal />
            {children}
          </ClientDataProvider>
        </ProtectedRoute>
      </NextThemesProvider>
    </ReduxProvider>
  );
}
