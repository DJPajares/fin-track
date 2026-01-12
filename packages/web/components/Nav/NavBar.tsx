'use client';

import { ReactNode, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '../ui/sidebar';
import { Label } from '../ui/label';

import SideNav from './SideNav';
import NavDropdownMenu from './NavDropdownMenu';
import { useAppSelector } from '../../lib/hooks/use-redux';

type NavBarProps = {
  children: ReactNode;
};

const NavBar = ({ children }: NavBarProps) => {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const isAuthRoute = pathname?.startsWith('/auth');
  const { user } = useAppSelector((state) => state.auth);

  // Get user initials
  const getInitials = (name?: string | null, email?: string | null) => {
    if (name) {
      const nameParts = name.split(' ');
      if (nameParts.length >= 2) {
        return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
      }
      return name.substring(0, 2).toUpperCase();
    }
    if (email) {
      return email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  useEffect(() => {
    if (isAuthRoute) return;

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
  }, [isAuthRoute]);

  if (isAuthRoute) {
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

            <Label variant="title-xs" className="font-bold">
              FIN-TRACK
            </Label>

            <NavDropdownMenu>
              <Avatar className="hover:border-primary cursor-pointer">
                <AvatarImage src={user?.image || undefined} />
                <AvatarFallback>
                  {getInitials(user?.name, user?.email)}
                </AvatarFallback>
              </Avatar>
            </NavDropdownMenu>
          </nav>
        </header>

        <div>{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default NavBar;
