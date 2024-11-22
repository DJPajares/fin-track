'use client';

import { ReactNode, useState } from 'react';
import { useTheme } from 'next-themes';

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from '../ui/dropdown-menu';
import {
  GlobeIcon,
  LogOutIcon,
  MoonIcon,
  SquarePenIcon,
  SunIcon
} from 'lucide-react';
import { Switch } from '../ui/switch';

import packageInfo from '@/package.json';

type NavDropdownMenuProps = {
  children: ReactNode;
};

const NavDropdownMenu = ({ children }: NavDropdownMenuProps) => {
  const { theme, setTheme } = useTheme();

  const [isDarkMode, setIsDarkMode] = useState(theme === 'dark');

  // const handleChangeLanguage = (language: LocaleProps) => {
  //   setUserLocale(language);
  // };

  const handleDarkModeToggle = () => {
    setTheme(isDarkMode ? 'light' : 'dark');
    setIsDarkMode(!isDarkMode);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">DJ Pajares</p>
            <p className="text-xs leading-none text-muted-foreground">
              dj.pajares@gmail.com
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem>
            <SquarePenIcon className="mr-2 h-4 w-4" />
            <span>Edit Profile</span>
          </DropdownMenuItem>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <GlobeIcon className="mr-2 h-4 w-4" />
              <span>Language</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                {/* {languages.map((language) => (
                  <DropdownMenuCheckboxItem
                    key={language.value}
                    checked={locale === language.value}
                    onClick={() => handleChangeLanguage(language.value)}
                  >
                    {language.label}
                  </DropdownMenuCheckboxItem>
                ))} */}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuItem>
            {isDarkMode ? (
              <MoonIcon className="mr-2 h-4 w-4" />
            ) : (
              <SunIcon className="mr-2 h-4 w-4" />
            )}
            <span>Dark Mode</span>
            <DropdownMenuShortcut>
              <Switch
                checked={isDarkMode}
                onCheckedChange={handleDarkModeToggle}
              />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem>
            <LogOutIcon className="mr-2 h-4 w-4" />
            <span>Logout</span>
            <DropdownMenuShortcut>
              <p className="text-xs leading-none text-muted-foreground">
                {`v${packageInfo.version}`}
              </p>
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        {/* <DropdownMenuLabel>
                <div className="flex flex-row justify-end">
                  <p className="text-xs leading-none text-muted-foreground">
                    {`v${version}`}
                  </p>
                </div>
              </DropdownMenuLabel> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NavDropdownMenu;
