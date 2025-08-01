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
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Label } from '../ui/label';
import {
  DollarSignIcon,
  GlobeIcon,
  LogOutIcon,
  MoonIcon,
  SquarePenIcon,
  SunIcon,
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
        currency,
      }),
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
            <Label variant="subtitle-md">DJ Pajares</Label>
            <Label variant="caption" className="text-muted-foreground">
              dj.pajares@gmail.com
            </Label>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem>
            <SquarePenIcon className="text-muted-foreground size-4" />
            {t('editProfile')}
          </DropdownMenuItem>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <GlobeIcon className="text-muted-foreground mr-2 size-4" />
              {t('language')}
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
                      <Label
                        variant="subtitle-md"
                        className={`${isSelected && 'font-bold'}`}
                      >
                        {language.label}
                      </Label>
                    </DropdownMenuCheckboxItem>
                  );
                })}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <DollarSignIcon className="text-muted-foreground mr-2 size-4" />
              {t('currency')}
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
                      <Label
                        variant="subtitle-md"
                        className={`${isSelected && 'font-bold'}`}
                      >
                        {currency.name}
                      </Label>
                    </DropdownMenuCheckboxItem>
                  );
                })}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>

          <DropdownMenuItem>
            {isDarkMode ? (
              <MoonIcon className="text-muted-foreground size-4" />
            ) : (
              <SunIcon className="text-muted-foreground size-4" />
            )}
            {t('darkMode')}
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
            <LogOutIcon className="text-muted-foreground size-4" />
            {t('logout')}
            <DropdownMenuShortcut>
              <Label variant="caption" className="text-muted-foreground">
                {`v${packageInfo.version}`}
              </Label>
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NavDropdownMenu;
