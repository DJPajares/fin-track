import { configureStore } from '@reduxjs/toolkit';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import authSlice from '@web/lib/redux/feature/auth/authSlice';
import dashboardSlice from '@web/lib/redux/feature/dashboard/dashboardSlice';
import mainSlice from '@web/lib/redux/feature/main/mainSlice';
import { Provider } from 'react-redux';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import NavDropdownMenu from './NavDropdownMenu';

// ── external deps ─────────────────────────────────────────────────────────────

const mockRouterPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockRouterPush }),
}));

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => 'en',
}));

vi.mock('next-themes', () => ({
  useTheme: () => ({ theme: 'light', setTheme: vi.fn() }),
}));

// ── services ──────────────────────────────────────────────────────────────────

vi.mock('@web/services/auth', () => ({
  logout: vi.fn().mockResolvedValue(undefined),
  updateUserSettings: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('@web/services/locale', () => ({
  setUserLocale: vi.fn(),
}));

// ── child component ───────────────────────────────────────────────────────────

vi.mock('@web/components/Nav/ProfileDrawer', () => ({
  default: ({
    open,
    onOpenChange,
  }: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
  }) => (
    <div
      data-testid="profile-drawer"
      data-open={String(open)}
      onClick={() => onOpenChange(false)}
    />
  ),
}));

// ── dropdown UI (passthrough) ─────────────────────────────────────────────────

vi.mock('@web/components/ui/dropdown-menu', () => ({
  DropdownMenu: ({
    children,
    open,
    onOpenChange,
  }: {
    children: React.ReactNode;
    open?: boolean;
    onOpenChange?: (v: boolean) => void;
  }) => (
    <div
      data-testid="dropdown-menu"
      data-open={String(open)}
      onClick={() => onOpenChange?.(!open)}
    >
      {children}
    </div>
  ),
  DropdownMenuTrigger: ({
    render: renderProp,
    children,
  }: {
    render?: React.ReactElement;
    children?: React.ReactNode;
    nativeButton?: boolean;
  }) => <div data-testid="dropdown-trigger">{renderProp ?? children}</div>,
  DropdownMenuContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dropdown-content">{children}</div>
  ),
  DropdownMenuGroup: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DropdownMenuLabel: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dropdown-label">{children}</div>
  ),
  DropdownMenuSeparator: () => <hr />,
  DropdownMenuItem: ({
    children,
    onClick,
    onSelect,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    onSelect?: (e: Event) => void;
  }) => (
    <button
      data-testid="dropdown-item"
      onClick={(e) => {
        onClick?.();
        onSelect?.(e.nativeEvent);
      }}
    >
      {children}
    </button>
  ),
  DropdownMenuSub: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DropdownMenuSubTrigger: ({ children }: { children: React.ReactNode }) => (
    <button data-testid="dropdown-sub-trigger">{children}</button>
  ),
  DropdownMenuPortal: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DropdownMenuSubContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dropdown-sub-content">{children}</div>
  ),
  DropdownMenuCheckboxItem: ({
    children,
    onClick,
    checked,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    checked?: boolean;
  }) => (
    <button
      role="menuitemcheckbox"
      aria-checked={checked}
      onClick={onClick}
      data-testid="dropdown-checkbox-item"
    >
      {children}
    </button>
  ),
  DropdownMenuShortcut: ({ children }: { children: React.ReactNode }) => (
    <span data-testid="dropdown-shortcut">{children}</span>
  ),
}));

vi.mock('@web/components/ui/switch', () => ({
  Switch: ({
    checked,
    onCheckedChange,
  }: {
    checked?: boolean;
    onCheckedChange?: (v: boolean) => void;
  }) => (
    <input
      type="checkbox"
      role="switch"
      checked={checked}
      onChange={(e) => onCheckedChange?.(e.target.checked)}
      data-testid="dark-mode-switch"
    />
  ),
}));

// ── helpers ───────────────────────────────────────────────────────────────────

function buildStore(
  currencies: { _id: string; name: string }[] = [],
  user: { name?: string | null; email?: string | null } = {
    name: 'Jane Smith',
    email: 'jane@example.com',
  },
) {
  return configureStore({
    reducer: { auth: authSlice, dashboard: dashboardSlice, main: mainSlice },
    preloadedState: {
      auth: {
        user: { id: 'u1', ...user },
        session: null,
        isLoading: false,
        error: null,
        isAuthenticated: true,
      },
      main: { currencies, categories: [], types: [], isLoading: false },
      dashboard: {
        date: '2026-04-15',
        currency: { _id: '', name: '' },
      },
    },
  });
}

function renderMenu(
  trigger: React.ReactElement = (
    <button data-testid="avatar-btn">avatar</button>
  ),
  storeOpts: Parameters<typeof buildStore> = [],
) {
  const store = buildStore(...storeOpts);
  return render(
    <Provider store={store}>
      <NavDropdownMenu>{trigger}</NavDropdownMenu>
    </Provider>,
  );
}

// ── tests ─────────────────────────────────────────────────────────────────────

describe('NavDropdownMenu', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('required props', () => {
    it('renders the children ReactElement as the trigger', () => {
      renderMenu(<button data-testid="my-trigger">open</button>);
      expect(screen.getByTestId('my-trigger')).toBeInTheDocument();
    });
  });

  describe('user info display', () => {
    it('shows the logged-in user name', () => {
      renderMenu();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });

    it('shows the logged-in user email', () => {
      renderMenu();
      expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    });

    it('falls back to "User" label when name is absent', () => {
      renderMenu(<button>avatar</button>, [
        [],
        { name: null, email: 'x@example.com' },
      ]);
      expect(screen.getByText('User')).toBeInTheDocument();
    });
  });

  describe('menu items', () => {
    it('renders the edit-profile option', () => {
      renderMenu();
      expect(screen.getByText('editProfile')).toBeInTheDocument();
    });

    it('renders the language sub-trigger', () => {
      renderMenu();
      const subTriggers = screen
        .getAllByTestId('dropdown-sub-trigger')
        .map((el) => el.textContent);
      expect(subTriggers.some((t) => t?.includes('language'))).toBe(true);
    });

    it('renders the currency sub-trigger', () => {
      renderMenu();
      const subTriggers = screen
        .getAllByTestId('dropdown-sub-trigger')
        .map((el) => el.textContent);
      expect(subTriggers.some((t) => t?.includes('currency'))).toBe(true);
    });

    it('renders the dark mode toggle', () => {
      renderMenu();
      expect(screen.getByText('darkMode')).toBeInTheDocument();
      expect(screen.getByRole('switch')).toBeInTheDocument();
    });

    it('renders the restart-tour option', () => {
      renderMenu();
      expect(screen.getByText('restartTour')).toBeInTheDocument();
    });

    it('renders the logout option', () => {
      renderMenu();
      expect(screen.getByText('logout')).toBeInTheDocument();
    });
  });

  describe('currency list', () => {
    it('renders a checkbox item for each available currency', () => {
      const currencies = [
        { _id: '1', name: 'USD' },
        { _id: '2', name: 'EUR' },
      ];
      renderMenu(<button>avatar</button>, [currencies]);
      expect(screen.getByText('USD')).toBeInTheDocument();
      expect(screen.getByText('EUR')).toBeInTheDocument();
    });

    it('marks the currently selected currency as checked', () => {
      const currencies = [{ _id: '1', name: 'USD' }];
      const store = configureStore({
        reducer: {
          auth: authSlice,
          dashboard: dashboardSlice,
          main: mainSlice,
        },
        preloadedState: {
          auth: {
            user: { id: 'u1', name: 'A', email: 'a@b.com' },
            session: null,
            isLoading: false,
            error: null,
            isAuthenticated: true,
          },
          main: { currencies, categories: [], types: [], isLoading: false },
          dashboard: {
            date: '2026-04-15',
            currency: { _id: '1', name: 'USD' },
          },
        },
      });
      render(
        <Provider store={store}>
          <NavDropdownMenu>
            <button>avatar</button>
          </NavDropdownMenu>
        </Provider>,
      );
      const usdItem = screen.getByRole('menuitemcheckbox', { name: /USD/ });
      expect(usdItem).toHaveAttribute('aria-checked', 'true');
    });
  });

  describe('actions', () => {
    it('navigates to /onboarding when restart-tour is clicked', async () => {
      renderMenu();
      const items = screen.getAllByTestId('dropdown-item');
      const restartItem = items.find((el) =>
        el.textContent?.includes('restartTour'),
      )!;
      await userEvent.click(restartItem);
      expect(mockRouterPush).toHaveBeenCalledWith('/onboarding');
    });

    it('navigates to /auth after logout', async () => {
      const { logout: logoutMock } = await import('@web/services/auth');
      renderMenu();
      const items = screen.getAllByTestId('dropdown-item');
      const logoutItem = items.find((el) =>
        el.textContent?.includes('logout'),
      )!;
      await userEvent.click(logoutItem);
      await waitFor(() => {
        expect(logoutMock).toHaveBeenCalled();
        expect(mockRouterPush).toHaveBeenCalledWith('/auth');
      });
    });

    it('navigates to /auth even when logout API call fails', async () => {
      const { logout: logoutMock } = await import('@web/services/auth');
      vi.mocked(logoutMock).mockRejectedValueOnce(new Error('network'));
      renderMenu();
      const items = screen.getAllByTestId('dropdown-item');
      const logoutItem = items.find((el) =>
        el.textContent?.includes('logout'),
      )!;
      await userEvent.click(logoutItem);
      await waitFor(() => {
        expect(mockRouterPush).toHaveBeenCalledWith('/auth');
      });
    });

    it('opens the profile drawer when edit-profile is selected', async () => {
      renderMenu();
      const items = screen.getAllByTestId('dropdown-item');
      const editItem = items.find((el) =>
        el.textContent?.includes('editProfile'),
      )!;
      await userEvent.click(editItem);
      const drawer = screen.getByTestId('profile-drawer');
      expect(drawer).toHaveAttribute('data-open', 'true');
    });
  });
});
