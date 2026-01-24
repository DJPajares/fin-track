'use client';

import { ReactNode, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useLocale, useTranslations } from 'next-intl';
import { useDispatch } from 'react-redux';

import {
  DollarSignIcon,
  GlobeIcon,
  InfoIcon,
  LogOutIcon,
  MoonIcon,
  SquarePenIcon,
  SunIcon,
} from 'lucide-react';
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
import { Switch } from '../ui/switch';
import ProfileDrawer from '@web/components/Nav/ProfileDrawer';

import { setUserLocale } from '../../services/locale';
import { logout, updateUserSettings } from '../../services/auth';
import { sortedLanguages } from '@shared/utilities/common';
import packageInfo from '../../../../package.json';

import { useAppSelector } from '../../lib/hooks/use-redux';
import { setDashboardCurrency } from '../../lib/redux/feature/dashboard/dashboardSlice';
import { logoutSuccess } from '../../lib/redux/feature/auth/authSlice';

import type { ListProps } from '../../types/List';
import type { LocaleProps } from '@shared/types/Locale';

type NavDropdownMenuProps = {
  children: ReactNode;
};

const NavDropdownMenu = ({ children }: NavDropdownMenuProps) => {
  const { theme, setTheme } = useTheme();

  const locale = useLocale();
  const router = useRouter();
  const dispatch = useDispatch();
  const t = useTranslations('MenuDropdown');
  const { user } = useAppSelector((state) => state.auth);
  const [isDarkMode, setIsDarkMode] = useState(theme === 'dark');
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { currencies } = useAppSelector((state) => state.main);
  const dashboardCurrency = useAppSelector((state) => state.dashboard.currency);

  const handleProfileDrawerChange = (open: boolean) => {
    setIsProfileDrawerOpen(open);
    if (open) {
      setIsDropdownOpen(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      dispatch(logoutSuccess());
      router.push('/auth');
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if API call fails
      dispatch(logoutSuccess());
      router.push('/auth');
    }
  };

  const handleLanguageChange = (language: LocaleProps) => {
    setUserLocale(language);
    updateUserSettings({ language }).catch(() => {});
  };

  const handleCurrencyChange = (currency: ListProps) => {
    dispatch(setDashboardCurrency({ currency }));
    updateUserSettings({ currency: currency.name }).catch(() => {});
  };

  const handleDarkModeToggle = () => {
    setTheme(isDarkMode ? 'light' : 'dark');
    setIsDarkMode(!isDarkMode);
    updateUserSettings({ darkMode: !isDarkMode }).catch(() => {});
  };

  const handleRestartTour = () => {
    router.push('/onboarding');
  };

  return (
    <>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <Label variant="subtitle-md">{user?.name || 'User'}</Label>
              <Label variant="caption" className="text-muted-foreground">
                {user?.email || ''}
              </Label>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuItem
              onSelect={(event) => {
                event.preventDefault();
                handleProfileDrawerChange(true);
              }}
            >
              <SquarePenIcon className="text-muted-foreground size-4" />
              {t('editProfile')}
            </DropdownMenuItem>

            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <GlobeIcon className="text-muted-foreground mr-2 size-4" />
                {t('language')}
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className="max-h-100 overflow-y-auto">
                  {sortedLanguages.map((language) => {
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
                <DropdownMenuSubContent className="max-h-100 overflow-y-auto">
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
            <DropdownMenuItem onClick={handleRestartTour}>
              <InfoIcon className="text-muted-foreground size-4" />
              {t('restartTour')}
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuItem onClick={handleLogout}>
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

      <ProfileDrawer
        open={isProfileDrawerOpen}
        onOpenChange={handleProfileDrawerChange}
      />
    </>
  );
};

export default NavDropdownMenu;
