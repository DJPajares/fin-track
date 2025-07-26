'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../lib/redux/store';

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
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth,
  );

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

          {isAuthenticated && user ? (
            <NavDropdownMenu>
              <Avatar className="hover:border-primary h-8 w-8 cursor-pointer">
                <AvatarImage src="https://i.pravatar.cc/150?u=a04258114e29026708c" />
                <AvatarFallback>
                  {user.firstName.charAt(0)}
                  {user.lastName.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </NavDropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <a
                href="/auth/login"
                className="text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Sign In
              </a>
              <a
                href="/auth/register"
                className="rounded-md bg-blue-600 px-3 py-1 text-sm font-medium text-white hover:bg-blue-700"
              >
                Sign Up
              </a>
            </div>
          )}
        </nav>

        <div>{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default NavBar;
