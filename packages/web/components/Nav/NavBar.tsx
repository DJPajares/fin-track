'use client';

import { ReactNode, useEffect, useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '../ui/sidebar';
import { Label } from '../ui/label';

import SideNav from './SideNav';
import NavDropdownMenu from './NavDropdownMenu';
import { useSession } from 'next-auth/react';
import { UserIcon } from 'lucide-react';

type NavBarProps = {
  children: ReactNode;
};

const NavBar = ({ children }: NavBarProps) => {
  const { data: session } = useSession();
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

          <Label variant="title-xs" className="!font-bold">
            FIN-TRACK
          </Label>

          <NavDropdownMenu>
            <Avatar className="hover:border-primary size-8 cursor-pointer">
              {session?.user?.image ? (
                <>
                  <AvatarImage src={session?.user?.image} />
                  <AvatarFallback>{session?.user?.name}</AvatarFallback>
                </>
              ) : (
                <>
                  <AvatarFallback>
                    <UserIcon className="size-4" />
                  </AvatarFallback>
                </>
              )}
            </Avatar>
          </NavDropdownMenu>
        </nav>

        <div>{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default NavBar;
