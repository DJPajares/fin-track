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
  DollarSignIcon,
  GlobeIcon,
  LogOutIcon,
  MoonIcon,
  SquarePenIcon,
  SunIcon
} from 'lucide-react';
import { Switch } from '../ui/switch';

import packageInfo from '../../package.json';
import { languages, LocaleProps } from '../../i18n/config';
import { setUserLocale } from '../../services/locale';

import { useLocale, useTranslations } from 'next-intl';
import { useAppSelector } from '../../lib/hooks/use-redux';
import { useDispatch } from 'react-redux';
import { setDashboardCurrency } from '../../lib/redux/feature/dashboard/dashboardSlice';

import type { ListProps } from '../../types/List';

type NavDropdownMenuProps = {
  children: ReactNode;
};

const NavDropdownMenu = ({ children }: NavDropdownMenuProps) => {
  const { theme, setTheme } = useTheme();

  const locale = useLocale();
  const dispatch = useDispatch();
  const t = useTranslations('MenuDropdown');

  const [isDarkMode, setIsDarkMode] = useState(theme === 'dark');

  const { currencies } = useAppSelector((state) => state.main);
  const dashboardCurrency = useAppSelector((state) => state.dashboard.currency);

  const handleLanguageChange = (language: LocaleProps) => {
    setUserLocale(language);
  };

  const handleCurrencyChange = (currency: ListProps) => {
    // store in redux state
    dispatch(
      setDashboardCurrency({
        currency
      })
    );
  };

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
            <span>{t('editProfile')}</span>
          </DropdownMenuItem>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <GlobeIcon className="mr-2 h-4 w-4" />
              <span>{t('language')}</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                {languages.map((language) => {
                  const isSelected = locale === language.value;

                  return (
                    <DropdownMenuCheckboxItem
                      key={language.value}
                      checked={isSelected}
                      onClick={() => handleLanguageChange(language.value)}
                    >
                      <p className={`${isSelected && 'font-bold'}`}>
                        {language.label}
                      </p>
                    </DropdownMenuCheckboxItem>
                  );
                })}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <DollarSignIcon className="mr-2 h-4 w-4" />
              <span>{t('currency')}</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                {currencies.map((currency) => {
                  const isSelected = dashboardCurrency.name === currency.name;
                  return (
                    <DropdownMenuCheckboxItem
                      key={currency._id}
                      checked={isSelected}
                      onClick={() => handleCurrencyChange(currency)}
                    >
                      <p className={`${isSelected && 'font-bold'}`}>
                        {currency.name}
                      </p>
                    </DropdownMenuCheckboxItem>
                  );
                })}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>

          <DropdownMenuItem>
            {isDarkMode ? (
              <MoonIcon className="mr-2 h-4 w-4" />
            ) : (
              <SunIcon className="mr-2 h-4 w-4" />
            )}
            <span>{t('darkMode')}</span>
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
            <span>{t('logout')}</span>
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
