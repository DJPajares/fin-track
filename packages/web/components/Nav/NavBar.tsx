'use client';

import { ReactNode, useEffect, useState } from 'react';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '../ui/sidebar';
import SideNav from './SideNav';

type NavBarProps = {
  children: ReactNode;
};

const NavBar = ({ children }: NavBarProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [open, setOpen] = useState(false);

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

  useEffect(() => {
    console.log(open);
  }, [open]);

  return (
    <SidebarProvider open={open} onOpenChange={setOpen}>
      <SideNav open={open} setOpen={setOpen} />

      <SidebarInset>
        <nav
          className={`nav sticky top-0 z-50 h-12 sm:h-14 bg-background/85 backdrop-blur-sm flex items-center justify-between p-3 transition-transform duration-300 ${
            isVisible ? 'translate-y-0' : '-translate-y-full'
          }`}
        >
          {/* <nav className="nav sticky top-0 z-50 h-12 sm:h-16 bg-background/85 backdrop-blur-sm flex items-center justify-between p-3"> */}
          <SidebarTrigger className="-ml-1" />

          <p className="font-bold text-inherit">FIN-TRACK</p>
        </nav>

        <div>{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default NavBar;
