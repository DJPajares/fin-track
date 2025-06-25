'use client';

import { ReactNode, useEffect, useState } from 'react';
import Link from 'next/link';

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '../ui/sidebar';
import { Label } from '../ui/label';

import SideNav from './SideNav';
import NavDropdownMenu from './NavDropdownMenu';

type NavBarProps = {
  children: ReactNode;
};

const NavBar = ({ children }: NavBarProps) => {
  const [isVisible, setIsVisible] = useState(true);

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
          className={`nav bg-background/85 sticky top-0 z-50 flex h-12 items-center justify-between p-3 backdrop-blur-sm transition-transform duration-300 sm:h-14 ${
            isVisible ? 'translate-y-0' : '-translate-y-full'
          }`}
        >
          <SidebarTrigger className="-ml-1" />

          <Link href="/">
            <Label variant="title-md">FIN-TRACK</Label>
          </Link>

          <NavDropdownMenu>
            <Avatar className="hover:border-primary h-8 w-8 cursor-pointer">
              <AvatarImage src="https://i.pravatar.cc/150?u=a04258114e29026708c" />
              <AvatarFallback>DJ</AvatarFallback>
            </Avatar>
          </NavDropdownMenu>
        </nav>

        <div>{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default NavBar;
