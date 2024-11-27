'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useIsMobile } from '../../hooks/use-mobile';

import { Avatar } from '@nextui-org/react';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '../ui/sidebar';

import SideNav from './SideNav';
import NavDropdownMenu from './NavDropdownMenu';
import Link from 'next/link';

type NavBarProps = {
  children: ReactNode;
};

const NavBar = ({ children }: NavBarProps) => {
  const [isVisible, setIsVisible] = useState(true);

  const isMobile = useIsMobile();

  let lastScroll = 0;

  useEffect(() => {
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
  }, []);

  return (
    <SidebarProvider>
      <SideNav />

      <SidebarInset>
        <nav
          className={`nav sticky top-0 z-50 h-12 sm:h-14 bg-background/85 backdrop-blur-sm flex items-center justify-between p-3 transition-transform duration-300 ${
            isVisible ? 'translate-y-0' : '-translate-y-full'
          }`}
        >
          <SidebarTrigger className="-ml-1" />

          <Link href="/">
            <p className="font-bold text-inherit">FIN-TRACK</p>
          </Link>

          <NavDropdownMenu>
            {isMobile ? (
              <Avatar
                src="https://i.pravatar.cc/150?u=a04258114e29026708c"
                className="w-6 h-6 text-tiny hover:border-primary"
              />
            ) : (
              <Avatar
                src="https://i.pravatar.cc/150?u=a04258114e29026708c"
                size="sm"
                className="cursor-pointer hover:border-primary"
              />
            )}
          </NavDropdownMenu>
        </nav>

        <div>{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default NavBar;
