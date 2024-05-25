'use client';

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle
} from '@nextui-org/navbar';
import { Avatar, Link } from '@nextui-org/react';
import { Button } from '@/components/ui/button';
import { MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

const menuItems = [
  {
    name: 'Home',
    route: '/'
  },
  {
    name: 'Dashboard',
    route: '/dashboard'
  },
  {
    name: 'Transactions',
    route: '/transactions'
  },
  {
    name: 'Categories',
    route: '/categories'
  },
  {
    name: 'Logout',
    route: '/logout'
  }
];

const NavMenu = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // [!] fixes hydration warning
  if (!mounted) return null;

  return (
    <Navbar shouldHideOnScroll>
      <NavbarContent justify="start">
        <NavbarMenuToggle />
        <NavbarBrand>
          <p className="font-bold text-inherit">FIN-TRACK</p>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent justify="end">
        <Button
          variant="ghost"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        >
          {theme === 'light' ? <SunIcon /> : <MoonIcon />}
        </Button>
        <Avatar
          src="https://i.pravatar.cc/150?u=a04258114e29026708c"
          size="sm"
        />
      </NavbarContent>
      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item.name}-${index}`}>
            <Link
              color={
                index === 2
                  ? 'primary'
                  : index === menuItems.length - 1
                  ? 'danger'
                  : 'foreground'
              }
              className="w-full"
              href={item.route}
              size="lg"
            >
              {item.name}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
};

export default NavMenu;
