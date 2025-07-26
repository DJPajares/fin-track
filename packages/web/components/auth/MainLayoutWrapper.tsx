'use client';

import { usePathname } from 'next/navigation';
// import { useSelector } from 'react-redux';
// import { RootState } from '../../lib/redux/store';
import AuthGuard from './AuthGuard';

interface MainLayoutWrapperProps {
  children: React.ReactNode;
}

export default function MainLayoutWrapper({
  children,
}: MainLayoutWrapperProps) {
  const pathname = usePathname();
  // const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  // Define public routes that don't require authentication
  const publicRoutes = ['/auth/login', '/auth/register'];
  const isPublicRoute = publicRoutes.includes(pathname);

  // If it's a public route, don't render anything (auth layout will handle it)
  if (isPublicRoute) {
    return null;
  }

  // For all other routes, require authentication
  return <AuthGuard requireAuth={true}>{children}</AuthGuard>;
}
