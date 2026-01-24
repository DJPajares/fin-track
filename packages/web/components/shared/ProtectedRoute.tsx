'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslations } from 'next-intl';
import { RootState } from '@web/lib/redux/store';
import { STORAGE_KEYS } from '@web/constants/storageKeys';
import {
  getSessionSuccess,
  getSessionFailure,
} from '@web/lib/redux/feature/auth/authSlice';
import { getCurrentUser, getStoredToken } from '@web/services/auth';
import Loader from '@web/components/shared/Loader';

type ProtectedRouteProps = {
  children: React.ReactNode;
};

const publicRoutes = ['/auth', '/auth/signup'];

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const t = useTranslations('Auth');
  const { isAuthenticated, isLoading } = useSelector(
    (state: RootState) => state.auth,
  );
  const [isInitialized, setIsInitialized] = useState(false);
  const isOnboardingRoute = pathname === '/onboarding';

  useEffect(() => {
    const initializeAuth = async () => {
      const token = getStoredToken();

      if (!token) {
        // No token, user is not authenticated
        dispatch(getSessionFailure('No token found'));
        setIsInitialized(true);

        // Redirect to login if not on a public route
        if (!publicRoutes.includes(pathname || '')) {
          router.push('/auth');
        }
        return;
      }

      try {
        // Verify token and get user data
        const user = await getCurrentUser();

        dispatch(
          getSessionSuccess({
            user,
            session: {
              token,
              expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
            },
          }),
        );

        // If user is authenticated and on a public route, redirect to dashboard
        if (publicRoutes.includes(pathname || '') && !isOnboardingRoute) {
          router.push('/dashboard');
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        dispatch(getSessionFailure('Session expired'));

        // Token is invalid, clear it and redirect to login
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);

        if (!publicRoutes.includes(pathname || '')) {
          router.push('/auth');
        }
      } finally {
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, [pathname, dispatch, router, isOnboardingRoute]);

  // Show loading state while checking authentication
  if (isLoading || !isInitialized) {
    return <Loader />;
  }

  // If authenticated and on a public route, don't render children (redirect in progress)
  if (isAuthenticated && publicRoutes.includes(pathname || '')) {
    return <Loader />;
  }

  // If not authenticated and not on a public route, don't render children
  if (!isAuthenticated && !publicRoutes.includes(pathname || '')) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">{t('redirectingToLogin')}</div>
      </div>
    );
  }

  // Allow authenticated users to access the onboarding route
  if (isAuthenticated && isOnboardingRoute) {
    return <>{children}</>;
  }

  return <>{children}</>;
}
