import { configureStore } from '@reduxjs/toolkit';
import { act, render, screen } from '@testing-library/react';
import authSlice from '@web/lib/redux/feature/auth/authSlice';
import dashboardSlice from '@web/lib/redux/feature/dashboard/dashboardSlice';
import mainSlice from '@web/lib/redux/feature/main/mainSlice';
import { Provider } from 'react-redux';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import NavBar from './NavBar';

// ── external deps ─────────────────────────────────────────────────────────────

const mockPathname = vi.fn(() => '/dashboard');
vi.mock('next/navigation', () => ({
  usePathname: () => mockPathname(),
}));

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

// ── sidebar UI (passthrough) ──────────────────────────────────────────────────

vi.mock('@web/components/ui/sidebar', () => ({
  SidebarProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sidebar-provider">{children}</div>
  ),
  SidebarInset: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <div data-testid="sidebar-inset" className={className}>
      {children}
    </div>
  ),
  SidebarTrigger: () => <button data-testid="sidebar-trigger" />,
}));

// ── child components ──────────────────────────────────────────────────────────

vi.mock('./SideNav', () => ({
  default: () => <div data-testid="side-nav" />,
}));

vi.mock('./NavDropdownMenu', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="nav-dropdown-menu">{children}</div>
  ),
}));

// ── helpers ───────────────────────────────────────────────────────────────────

function buildStore(
  userOverride: Partial<{
    name: string | null;
    email: string | null;
    image: string | null;
  }> = {},
) {
  return configureStore({
    reducer: {
      auth: authSlice,
      dashboard: dashboardSlice,
      main: mainSlice,
    },
    preloadedState: {
      auth: {
        user: {
          id: 'user-1',
          name: 'John Doe',
          email: 'john@example.com',
          image: null,
          ...userOverride,
        },
        session: null,
        isLoading: false,
        error: null,
        isAuthenticated: true,
      },
    },
  });
}

function renderNavBar(
  children: React.ReactNode = <div>page content</div>,
  storeOpts: Parameters<typeof buildStore>[0] = {},
) {
  const store = buildStore(storeOpts);
  return render(
    <Provider store={store}>
      <NavBar>{children}</NavBar>
    </Provider>,
  );
}

// ── tests ─────────────────────────────────────────────────────────────────────

describe('NavBar', () => {
  beforeEach(() => {
    mockPathname.mockReturnValue('/dashboard');
  });

  describe('required props', () => {
    it('renders the children prop', () => {
      renderNavBar(<span data-testid="child-node">hello</span>);
      expect(screen.getByTestId('child-node')).toBeInTheDocument();
    });
  });

  describe('nav-hidden routes', () => {
    it('renders only children on /auth without nav wrapper', () => {
      mockPathname.mockReturnValue('/auth');
      renderNavBar(<span data-testid="auth-child">auth page</span>);

      expect(screen.getByTestId('auth-child')).toBeInTheDocument();
      expect(screen.queryByTestId('sidebar-provider')).not.toBeInTheDocument();
    });

    it('renders only children on /auth/login sub-route', () => {
      mockPathname.mockReturnValue('/auth/login');
      renderNavBar(<span data-testid="login-child">login</span>);

      expect(screen.getByTestId('login-child')).toBeInTheDocument();
      expect(screen.queryByTestId('sidebar-provider')).not.toBeInTheDocument();
    });

    it('renders only children on /onboarding route', () => {
      mockPathname.mockReturnValue('/onboarding');
      renderNavBar(<span data-testid="onb-child">onboarding</span>);

      expect(screen.getByTestId('onb-child')).toBeInTheDocument();
      expect(screen.queryByTestId('sidebar-provider')).not.toBeInTheDocument();
    });

    it('renders only children on /onboarding/step sub-route', () => {
      mockPathname.mockReturnValue('/onboarding/step');
      renderNavBar(<span data-testid="step-child">step</span>);

      expect(screen.getByTestId('step-child')).toBeInTheDocument();
      expect(screen.queryByTestId('sidebar-provider')).not.toBeInTheDocument();
    });
  });

  describe('nav-visible routes', () => {
    it('renders the sidebar provider on regular routes', () => {
      renderNavBar();
      expect(screen.getByTestId('sidebar-provider')).toBeInTheDocument();
    });

    it('renders the SideNav component', () => {
      renderNavBar();
      expect(screen.getByTestId('side-nav')).toBeInTheDocument();
    });

    it('renders the SidebarTrigger', () => {
      renderNavBar();
      expect(screen.getByTestId('sidebar-trigger')).toBeInTheDocument();
    });

    it('renders the NavDropdownMenu', () => {
      renderNavBar();
      expect(screen.getByTestId('nav-dropdown-menu')).toBeInTheDocument();
    });

    it('renders the app name in the header', () => {
      renderNavBar();
      expect(screen.getByText(/fin-track/i)).toBeInTheDocument();
    });

    it('renders children inside the layout', () => {
      renderNavBar(<span data-testid="page-content">my page</span>);
      expect(screen.getByTestId('page-content')).toBeInTheDocument();
    });
  });

  describe('avatar initials', () => {
    it('shows two-letter initials from a full name', () => {
      renderNavBar(<div />, { name: 'John Doe' });
      expect(screen.getByText('JD')).toBeInTheDocument();
    });

    it('shows first two chars of a single-word name', () => {
      renderNavBar(<div />, { name: 'Admin' });
      expect(screen.getByText('AD')).toBeInTheDocument();
    });

    it('falls back to first two chars of email when name is absent', () => {
      renderNavBar(<div />, { name: null, email: 'alice@example.com' });
      expect(screen.getByText('AL')).toBeInTheDocument();
    });

    it('falls back to "U" when both name and email are absent', () => {
      const store = configureStore({
        reducer: {
          auth: authSlice,
          dashboard: dashboardSlice,
          main: mainSlice,
        },
        preloadedState: {
          auth: {
            user: null,
            session: null,
            isLoading: false,
            error: null,
            isAuthenticated: false,
          },
        },
      });
      render(
        <Provider store={store}>
          <NavBar>
            <div />
          </NavBar>
        </Provider>,
      );
      expect(screen.getByText('U')).toBeInTheDocument();
    });
  });

  describe('scroll visibility', () => {
    it('attaches a scroll listener on regular routes', () => {
      const addSpy = vi.spyOn(window, 'addEventListener');
      renderNavBar();
      expect(addSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
      addSpy.mockRestore();
    });

    it('does not attach a scroll listener on auth routes', () => {
      mockPathname.mockReturnValue('/auth');
      const addSpy = vi.spyOn(window, 'addEventListener');
      renderNavBar();
      const scrollCalls = addSpy.mock.calls.filter(
        ([event]) => event === 'scroll',
      );
      expect(scrollCalls).toHaveLength(0);
      addSpy.mockRestore();
    });

    it('hides the header when scrolling down', () => {
      renderNavBar();
      const header = screen.getByRole('banner');

      act(() => {
        Object.defineProperty(window, 'pageYOffset', {
          value: 200,
          writable: true,
        });
        window.dispatchEvent(new Event('scroll'));
      });

      expect(header.className).toContain('-translate-y-full');
    });

    it('shows the header when scrolling back to top', () => {
      renderNavBar();
      const header = screen.getByRole('banner');

      act(() => {
        Object.defineProperty(window, 'pageYOffset', {
          value: 200,
          writable: true,
        });
        window.dispatchEvent(new Event('scroll'));
      });

      act(() => {
        Object.defineProperty(window, 'pageYOffset', {
          value: 0,
          writable: true,
        });
        window.dispatchEvent(new Event('scroll'));
      });

      expect(header.className).toContain('translate-y-0');
      expect(header.className).not.toContain('-translate-y-full');
    });
  });
});
