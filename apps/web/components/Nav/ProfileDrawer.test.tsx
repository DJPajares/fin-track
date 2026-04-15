import { configureStore } from '@reduxjs/toolkit';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import authSlice from '@web/lib/redux/feature/auth/authSlice';
import dashboardSlice from '@web/lib/redux/feature/dashboard/dashboardSlice';
import mainSlice from '@web/lib/redux/feature/main/mainSlice';
import { Provider } from 'react-redux';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import ProfileDrawer from './ProfileDrawer';

// ── external deps ─────────────────────────────────────────────────────────────

const mockRouterPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockRouterPush }),
}));

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

// ── services ──────────────────────────────────────────────────────────────────

vi.mock('@web/services/auth', () => ({
  updateProfile: vi.fn().mockResolvedValue(undefined),
  deleteAccount: vi.fn().mockResolvedValue(undefined),
}));

// ── shared UI (passthrough) ───────────────────────────────────────────────────

vi.mock('@web/components/shared/CustomDrawer', () => ({
  default: ({
    open,
    title,
    description,
    children,
    okButtonLabel,
    cancelButtonLabel,
    handleSubmit,
    onOpenChange,
  }: {
    open: boolean;
    title?: string;
    description?: string;
    children: React.ReactNode;
    okButtonLabel?: string;
    cancelButtonLabel?: string;
    handleSubmit: () => void;
    onOpenChange: (v: boolean) => void;
  }) => (
    <div data-testid="custom-drawer" data-open={String(open)}>
      {title && <h2 data-testid="drawer-title">{title}</h2>}
      {description && <p data-testid="drawer-description">{description}</p>}
      <div data-testid="drawer-body">{children}</div>
      <button data-testid="drawer-save" onClick={handleSubmit}>
        {okButtonLabel}
      </button>
      <button data-testid="drawer-cancel" onClick={() => onOpenChange(false)}>
        {cancelButtonLabel}
      </button>
    </div>
  ),
}));

vi.mock('@web/components/ui/alert-dialog', () => ({
  AlertDialog: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="alert-dialog">{children}</div>
  ),
  AlertDialogTrigger: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="alert-dialog-trigger">{children}</div>
  ),
  AlertDialogContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="alert-dialog-content">{children}</div>
  ),
  AlertDialogHeader: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  AlertDialogFooter: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  AlertDialogTitle: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  AlertDialogDescription: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  AlertDialogAction: ({
    children,
    onClick,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
  }) => (
    <button data-testid="alert-dialog-action" onClick={onClick}>
      {children}
    </button>
  ),
  AlertDialogCancel: ({ children }: { children: React.ReactNode }) => (
    <button data-testid="alert-dialog-cancel">{children}</button>
  ),
}));

vi.mock('@web/components/ui/separator', () => ({
  Separator: () => <hr />,
}));

vi.mock('@web/components/ui/field', () => ({
  Field: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  FieldGroup: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  FieldLabel: ({
    children,
    htmlFor,
  }: {
    children: React.ReactNode;
    htmlFor?: string;
  }) => <label htmlFor={htmlFor}>{children}</label>,
}));

// ── helpers ───────────────────────────────────────────────────────────────────

function buildStore(
  user: {
    name?: string | null;
    email?: string | null;
  } = { name: 'Alice Walker', email: 'alice@example.com' },
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
    },
  });
}

function renderDrawer(
  open = true,
  onOpenChange = vi.fn(),
  user?: { name?: string | null; email?: string | null },
) {
  const store = buildStore(user);
  return render(
    <Provider store={store}>
      <ProfileDrawer open={open} onOpenChange={onOpenChange} />
    </Provider>,
  );
}

// ── tests ─────────────────────────────────────────────────────────────────────

describe('ProfileDrawer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('required props', () => {
    it('renders without errors when open is true', () => {
      renderDrawer(true);
      expect(screen.getByTestId('custom-drawer')).toBeInTheDocument();
    });

    it('renders without errors when open is false', () => {
      renderDrawer(false);
      expect(screen.getByTestId('custom-drawer')).toHaveAttribute(
        'data-open',
        'false',
      );
    });

    it('passes the open prop correctly to the drawer', () => {
      renderDrawer(true);
      expect(screen.getByTestId('custom-drawer')).toHaveAttribute(
        'data-open',
        'true',
      );
    });

    it('calls onOpenChange when cancel is clicked', async () => {
      const onOpenChange = vi.fn();
      renderDrawer(true, onOpenChange);
      await userEvent.click(screen.getByTestId('drawer-cancel'));
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  describe('drawer metadata', () => {
    it('renders the profile title', () => {
      renderDrawer();
      expect(screen.getByTestId('drawer-title')).toHaveTextContent(
        'Profile.title',
      );
    });

    it('renders the profile description', () => {
      renderDrawer();
      expect(screen.getByTestId('drawer-description')).toHaveTextContent(
        'Profile.description',
      );
    });

    it('renders the save button label', () => {
      renderDrawer();
      expect(screen.getByTestId('drawer-save')).toBeInTheDocument();
    });

    it('renders the cancel button label', () => {
      renderDrawer();
      expect(screen.getByTestId('drawer-cancel')).toBeInTheDocument();
    });
  });

  describe('user data pre-population', () => {
    it('pre-fills the name field with the user name', () => {
      renderDrawer(true, vi.fn(), {
        name: 'Alice Walker',
        email: 'alice@example.com',
      });
      expect(screen.getByLabelText('Profile.name')).toHaveValue('Alice Walker');
    });

    it('pre-fills the email field with the user email', () => {
      renderDrawer(true, vi.fn(), {
        name: 'Alice Walker',
        email: 'alice@example.com',
      });
      expect(screen.getByLabelText('Profile.email')).toHaveValue(
        'alice@example.com',
      );
    });

    it('pre-fills name as empty string when user name is null', () => {
      renderDrawer(true, vi.fn(), { name: null, email: 'alice@example.com' });
      expect(screen.getByLabelText('Profile.name')).toHaveValue('');
    });

    it('shows the user name in the avatar section', () => {
      renderDrawer(true, vi.fn(), {
        name: 'Alice Walker',
        email: 'alice@example.com',
      });
      expect(screen.getByText('Alice Walker')).toBeInTheDocument();
    });

    it('shows the user email in the avatar section', () => {
      renderDrawer(true, vi.fn(), {
        name: 'Alice Walker',
        email: 'alice@example.com',
      });
      expect(screen.getByText('alice@example.com')).toBeInTheDocument();
    });

    it('shows "User" when user name is absent', () => {
      renderDrawer(true, vi.fn(), { name: null, email: null });
      expect(screen.getByText('User')).toBeInTheDocument();
    });
  });

  describe('form fields', () => {
    it('renders the name input field', () => {
      renderDrawer();
      expect(screen.getByLabelText('Profile.name')).toBeInTheDocument();
    });

    it('renders the email input field', () => {
      renderDrawer();
      expect(screen.getByLabelText('Profile.email')).toBeInTheDocument();
    });

    it('renders the current-password input field', () => {
      renderDrawer();
      expect(
        screen.getByLabelText('Profile.currentPassword'),
      ).toBeInTheDocument();
    });

    it('renders the new-password input field', () => {
      renderDrawer();
      expect(screen.getByLabelText('Profile.newPassword')).toBeInTheDocument();
    });

    it('renders the confirm-password input field', () => {
      renderDrawer();
      expect(
        screen.getByLabelText('Profile.confirmPassword'),
      ).toBeInTheDocument();
    });

    it('updates the name field value when typed into', async () => {
      renderDrawer();
      const input = screen.getByLabelText('Profile.name');
      await userEvent.clear(input);
      await userEvent.type(input, 'Bob');
      expect(input).toHaveValue('Bob');
    });

    it('updates the email field value when typed into', async () => {
      renderDrawer();
      const input = screen.getByLabelText('Profile.email');
      await userEvent.clear(input);
      await userEvent.type(input, 'bob@example.com');
      expect(input).toHaveValue('bob@example.com');
    });

    it('password fields start empty', () => {
      renderDrawer();
      expect(screen.getByLabelText('Profile.currentPassword')).toHaveValue('');
      expect(screen.getByLabelText('Profile.newPassword')).toHaveValue('');
      expect(screen.getByLabelText('Profile.confirmPassword')).toHaveValue('');
    });
  });

  describe('delete account', () => {
    it('renders the delete account section', () => {
      renderDrawer();
      expect(screen.getByTestId('alert-dialog')).toBeInTheDocument();
    });

    it('renders the delete account trigger button', () => {
      renderDrawer();
      expect(screen.getByTestId('alert-dialog-trigger')).toBeInTheDocument();
    });
  });

  describe('avatar initials', () => {
    it('shows two uppercase initials from a full name', () => {
      renderDrawer(true, vi.fn(), { name: 'Alice Walker', email: null });
      // AW
      expect(screen.getByText('AW')).toBeInTheDocument();
    });

    it('falls back to first char of email when name is absent', () => {
      renderDrawer(true, vi.fn(), { name: null, email: 'zara@example.com' });
      // initials logic: email split by whitespace → single chunk → charAt(0) → 'Z'
      expect(screen.getByText('Z')).toBeInTheDocument();
    });

    it('falls back to "U" when both name and email are absent', () => {
      renderDrawer(true, vi.fn(), { name: null, email: null });
      expect(screen.getByText('U')).toBeInTheDocument();
    });
  });

  describe('form reset on close', () => {
    it('clears password fields when drawer is closed and reopened', async () => {
      const { rerender } = renderDrawer(true, vi.fn(), {
        name: 'Alice',
        email: 'a@b.com',
      });
      const store = buildStore({ name: 'Alice', email: 'a@b.com' });

      await userEvent.type(
        screen.getByLabelText('Profile.currentPassword'),
        'secret',
      );
      expect(screen.getByLabelText('Profile.currentPassword')).toHaveValue(
        'secret',
      );

      // Close the drawer (open=false triggers cleanup effect)
      rerender(
        <Provider store={store}>
          <ProfileDrawer open={false} onOpenChange={vi.fn()} />
        </Provider>,
      );

      // Reopen
      rerender(
        <Provider store={store}>
          <ProfileDrawer open={true} onOpenChange={vi.fn()} />
        </Provider>,
      );

      await waitFor(() => {
        expect(screen.getByLabelText('Profile.currentPassword')).toHaveValue(
          '',
        );
      });
    });
  });
});
