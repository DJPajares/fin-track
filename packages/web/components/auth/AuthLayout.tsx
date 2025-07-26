'use client';

import { usePathname } from 'next/navigation';
// import { useSelector } from 'react-redux';
// import { RootState } from '../../lib/redux/store';
import AuthGuard from './AuthGuard';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const pathname = usePathname();
  // const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  // Define public routes that don't require authentication
  const publicRoutes = ['/auth/login', '/auth/register'];
  const isPublicRoute = publicRoutes.includes(pathname);

  // If it's a public route, don't require authentication and don't wrap with main layout
  if (isPublicRoute) {
    return <AuthGuard requireAuth={false}>{children}</AuthGuard>;
  }

  // For all other routes, require authentication
  return <AuthGuard requireAuth={true}>{children}</AuthGuard>;
}
