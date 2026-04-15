'use client';

import type { ListProps } from '@shared/types/List';
import type { LocaleProps } from '@shared/types/Locale';
import { sortedLanguages } from '@shared/utilities/common';
import ProfileDrawer from '@web/components/Nav/ProfileDrawer';
import {
  TypographyLabel,
  TypographyMuted,
} from '@web/components/shared/Typography';
import { Button } from '@web/components/ui/button';
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
} from '@web/components/ui/dropdown-menu';
import { Switch } from '@web/components/ui/switch';
import { useAppSelector } from '@web/lib/hooks/use-redux';
import { logoutSuccess } from '@web/lib/redux/feature/auth/authSlice';
import { setDashboardCurrency } from '@web/lib/redux/feature/dashboard/dashboardSlice';
import { logout, updateUserSettings } from '@web/services/auth';
import { setUserLocale } from '@web/services/locale';
import {
  DollarSignIcon,
  GlobeIcon,
  InfoIcon,
  LogOutIcon,
  MoonIcon,
  SquarePenIcon,
  SunIcon,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { ReactElement, useState } from 'react';
import { useDispatch } from 'react-redux';

import packageInfo from '../../../../package.json';

type NavDropdownMenuProps = {
  children: ReactElement;
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
        <DropdownMenuTrigger
          render={children}
          nativeButton={children.type === 'button' || children.type === Button}
        />
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuGroup>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <TypographyLabel>{user?.name || 'User'}</TypographyLabel>
                <TypographyMuted>{user?.email || ''}</TypographyMuted>
              </div>
            </DropdownMenuLabel>
          </DropdownMenuGroup>

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
                <GlobeIcon className="text-muted-foreground size-4" />
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
                        <TypographyLabel
                          className={`${isSelected && 'font-bold'}`}
                        >
                          {language.label}
                        </TypographyLabel>
                      </DropdownMenuCheckboxItem>
                    );
                  })}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>

            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <DollarSignIcon className="text-muted-foreground size-4" />
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
                        <TypographyLabel
                          className={`${isSelected && 'font-bold'}`}
                        >
                          {currency.name}
                        </TypographyLabel>
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
                <TypographyMuted>{`v${packageInfo.version}`}</TypographyMuted>
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
