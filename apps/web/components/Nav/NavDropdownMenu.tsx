'use client';

import { Avatar, Dropdown } from '@heroui/react';
import { LogOutIcon, MoonIcon, SunIcon, UserIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

import { useAppSelector } from '../../lib/hooks/use-redux';
import { logoutSuccess } from '../../lib/redux/feature/auth/authSlice';
import { logout, updateUserSettings } from '../../services/auth';
import {
  Label,
  TypographyCaption,
  TypographyLabel,
} from '../shared/Typography';

const NavDropdownMenu = () => {
  const { theme, setTheme } = useTheme();

  const router = useRouter();
  const dispatch = useDispatch();
  const t = useTranslations('MenuDropdown');
  const { user } = useAppSelector((state) => state.auth);
  const [isDarkMode, setIsDarkMode] = useState(theme === 'dark');

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

  const handleDarkModeToggle = () => {
    setTheme(isDarkMode ? 'light' : 'dark');
    setIsDarkMode(!isDarkMode);
    updateUserSettings({ darkMode: !isDarkMode }).catch(() => {});
  };

  return (
    <Dropdown>
      <Dropdown.Trigger>
        {user ? (
          <Avatar size="sm" variant="soft" className="ring-accent ring-2">
            <Avatar.Image src="https://i.pravatar.cc/150?u=a04258114e29026708c" />
            <Avatar.Fallback>
              <UserIcon size={20} />
            </Avatar.Fallback>
          </Avatar>
        ) : (
          <Avatar size="sm">
            <Avatar.Fallback>
              <UserIcon size={20} />
            </Avatar.Fallback>
          </Avatar>
        )}
      </Dropdown.Trigger>
      <Dropdown.Popover className="w-max max-w-[calc(100vw-2rem)] min-w-40 overflow-hidden">
        {/* User Info */}
        {user && (
          <div className="flex items-center gap-3 p-3">
            <Avatar size="sm" variant="soft" className="ring-accent ring-2">
              <Avatar.Image src="https://i.pravatar.cc/150?u=a04258114e29026708c" />
              <Avatar.Fallback>
                <UserIcon size={20} />
              </Avatar.Fallback>
            </Avatar>
            <div className="flex min-w-0 flex-1 flex-col gap-0">
              <TypographyLabel className="max-w-full wrap-anywhere">
                {user?.name}
              </TypographyLabel>
              <TypographyCaption className="max-w-full wrap-anywhere">
                {user?.email}
              </TypographyCaption>
            </div>
          </div>
        )}

        {/* Items */}
        <Dropdown.Menu aria-label="user menu">
          <Dropdown.Item
            id="dark-mode"
            textValue={isDarkMode ? 'Light Mode' : 'Dark Mode'}
            onPress={handleDarkModeToggle}
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? (
              <div className="flex w-full items-center justify-between gap-2">
                <Label>Light Mode</Label>
                <SunIcon className="text-muted size-3.5" />
              </div>
            ) : (
              <div className="flex w-full items-center justify-between gap-2">
                <Label>Dark Mode</Label>
                <MoonIcon className="text-muted size-3.5" />
              </div>
            )}
          </Dropdown.Item>

          <Dropdown.Item
            id="auth-action"
            textValue={t('logout')}
            aria-label="Logout or Login"
            onPress={handleLogout}
          >
            <div className="flex w-full items-center justify-between gap-2">
              <Label>{t('logout')}</Label>
              <LogOutIcon className="text-muted size-3.5" />
            </div>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
};

export default NavDropdownMenu;
