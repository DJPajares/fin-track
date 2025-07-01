'use client';

import { usePathname } from 'next/navigation';
import NavBar from './NavBar';

interface NavBarWrapperProps {
  children: React.ReactNode;
}

export function NavBarWrapper({ children }: NavBarWrapperProps) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <NavBar>
      <div className="w-full px-6 py-2 sm:px-8">{children}</div>
    </NavBar>
  );
}
