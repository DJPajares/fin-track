'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle
} from '@nextui-org/navbar';
import { Avatar } from '@nextui-org/react';
import { Button } from '@/components/ui/button';
import { MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';

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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  // [!] fixes hydration warning
  if (!mounted) return null;

  return (
    <Navbar
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      maxWidth="full"
      shouldHideOnScroll
    >
      <NavbarContent justify="start">
        <NavbarMenuToggle />
        <NavbarBrand>
          <div onClick={() => router.push('/')} className="cursor-pointer">
            <p className="font-bold text-inherit">FIN-TRACK</p>
          </div>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent justify="end">
        <Button
          variant="ghost"
          size="rounded_icon"
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
            <Link href={item.route} onClick={() => setIsMenuOpen(false)}>
              {item.name}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
};

export default NavMenu;
