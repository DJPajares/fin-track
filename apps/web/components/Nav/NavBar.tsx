'use client';

import { CONSTANTS } from '@shared/constants/common';
import { usePathname } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';

import { Label } from '../shared/Typography';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '../ui/sidebar';
import NavDropdownMenu from './NavDropdownMenu';
import SideNav from './SideNav';

type NavBarProps = {
  children: ReactNode;
};

const NAV_HIDDEN_PREFIXES = ['/auth', '/onboarding'];

const NavBar = ({ children }: NavBarProps) => {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const isNavHiddenRoute = NAV_HIDDEN_PREFIXES.some((prefix) =>
    pathname?.startsWith(prefix),
  );

  useEffect(() => {
    if (isNavHiddenRoute) return;

    let lastScroll = 0;

    const handleScroll = () => {
      const currentScroll = window.pageYOffset;

      if (currentScroll <= 0) {
        setIsVisible(true); // Show navbar at the top of the page
      } else if (currentScroll > lastScroll) {
        setIsVisible(false); // Hide navbar on scroll down
      } else {
        setIsVisible(true); // Show navbar on scroll up
      }

      lastScroll = currentScroll;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isNavHiddenRoute]);

  if (isNavHiddenRoute) {
    return <>{children}</>;
  }

  return (
    <SidebarProvider>
      <SideNav />

      <SidebarInset className="relative">
        <header
          className={`bg-background/90 sticky inset-x-0 top-0 z-40 flex h-12 shrink-0 items-center p-3 transition-transform duration-300 ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-14 sm:h-14 ${
            isVisible ? 'translate-y-0' : '-translate-y-full'
          }`}
        >
          <nav className="flex w-full items-center justify-between">
            <SidebarTrigger />

            <Label variant="title-xs" className="font-bold uppercase">
              {CONSTANTS.APP_NAME}
            </Label>

            <NavDropdownMenu />
          </nav>
        </header>

        <div>{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default NavBar;
