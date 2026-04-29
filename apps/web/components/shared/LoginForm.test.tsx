import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { LoginForm } from './LoginForm';

// ── Mocks ────────────────────────────────────────────────────────────────────

vi.mock('next-intl', () => ({
  useTranslations: (namespace: string) => (key: string) =>
    `${namespace}.${key}`,
}));

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

const mockDispatch = vi.fn();
vi.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
}));

const mockSetTheme = vi.fn();
vi.mock('next-themes', () => ({
  useTheme: () => ({ setTheme: mockSetTheme, theme: 'light' }),
}));

const mockLogin = vi.fn();
vi.mock('@web/services/auth', () => ({
  login: (...args: unknown[]) => mockLogin(...args),
}));

const mockFetchCurrency = vi.fn();
vi.mock('@web/services/api', () => ({
  fetchCurrencyByName: (...args: unknown[]) => mockFetchCurrency(...args),
}));

vi.mock('@web/services/locale', () => ({
  setUserLocale: vi.fn(),
}));

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.ComponentProps<'div'>) => (
      <div {...props}>{children}</div>
    ),
  },
}));

vi.mock('next/image', () => ({
  default: (props: { alt?: string }) => (
    <span data-testid="next-image">{props.alt ?? ''}</span>
  ),
}));

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeAxiosError(message: string) {
  return { response: { data: { message } } };
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders email, password inputs and submit button', () => {
    render(<LoginForm />);
    expect(screen.getByLabelText(/Auth\.login\.email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Auth\.login\.password/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Auth\.login\.submit/i }),
    ).toBeInTheDocument();
  });

  it('password field defaults to type="password"', () => {
    render(<LoginForm />);
    const input = screen.getByLabelText(/Auth\.login\.password/i);
    expect(input).toHaveAttribute('type', 'password');
  });

  it('toggles password visibility when Eye button is clicked', async () => {
    render(<LoginForm />);
    const toggle = screen.getByRole('button', {
      name: /Auth\.login\.showPassword/i,
    });
    const input = screen.getByLabelText(/Auth\.login\.password/i);

    await userEvent.click(toggle);
    expect(input).toHaveAttribute('type', 'text');

    await userEvent.click(
      screen.getByRole('button', { name: /Auth\.login\.hidePassword/i }),
    );
    expect(input).toHaveAttribute('type', 'password');
  });

  it('disables the submit button and shows loading text while submitting', async () => {
    // Never resolve so it stays in loading state
    mockLogin.mockReturnValue(new Promise(() => {}));

    render(<LoginForm />);
    await userEvent.type(
      screen.getByLabelText(/Auth\.login\.email/i),
      'user@example.com',
    );
    await userEvent.type(
      screen.getByLabelText(/Auth\.login\.password/i),
      'password',
    );
    await userEvent.click(
      screen.getByRole('button', { name: /Auth\.login\.submit/i }),
    );

    const btn = screen.getByRole('button', { name: /Auth\.login\.loading/i });
    expect(btn).toBeDisabled();
  });

  it('shows emailNotRegistered error when API returns that message', async () => {
    mockLogin.mockRejectedValue(makeAxiosError('Email not registered'));

    render(<LoginForm />);
    await userEvent.type(
      screen.getByLabelText(/Auth\.login\.email/i),
      'unknown@example.com',
    );
    await userEvent.type(
      screen.getByLabelText(/Auth\.login\.password/i),
      'password',
    );
    await userEvent.click(
      screen.getByRole('button', { name: /Auth\.login\.submit/i }),
    );

    await waitFor(() => {
      expect(
        screen.getByText(/Auth\.login\.error\.emailNotRegistered/i),
      ).toBeInTheDocument();
    });
  });

  it('shows incorrectPassword error when API returns that message', async () => {
    mockLogin.mockRejectedValue(makeAxiosError('Incorrect password'));

    render(<LoginForm />);
    await userEvent.type(
      screen.getByLabelText(/Auth\.login\.email/i),
      'user@example.com',
    );
    await userEvent.type(
      screen.getByLabelText(/Auth\.login\.password/i),
      'wrongpassword',
    );
    await userEvent.click(
      screen.getByRole('button', { name: /Auth\.login\.submit/i }),
    );

    await waitFor(() => {
      expect(
        screen.getByText(/Auth\.login\.error\.incorrectPassword/i),
      ).toBeInTheDocument();
    });
  });

  it('shows generic error for unknown API errors', async () => {
    mockLogin.mockRejectedValue(new Error('Network error'));

    render(<LoginForm />);
    await userEvent.type(
      screen.getByLabelText(/Auth\.login\.email/i),
      'user@example.com',
    );
    await userEvent.type(
      screen.getByLabelText(/Auth\.login\.password/i),
      'password',
    );
    await userEvent.click(
      screen.getByRole('button', { name: /Auth\.login\.submit/i }),
    );

    await waitFor(() => {
      expect(
        screen.getByText(/Auth\.login\.error\.generic/i),
      ).toBeInTheDocument();
    });
  });

  it('dispatches loginSuccess and redirects to /dashboard on successful login', async () => {
    mockLogin.mockResolvedValue({
      user: { _id: '1', email: 'user@example.com', settings: null },
      token: 'tok123',
    });

    render(<LoginForm />);
    await userEvent.type(
      screen.getByLabelText(/Auth\.login\.email/i),
      'user@example.com',
    );
    await userEvent.type(
      screen.getByLabelText(/Auth\.login\.password/i),
      'correctpassword',
    );
    await userEvent.click(
      screen.getByRole('button', { name: /Auth\.login\.submit/i }),
    );

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('re-enables submit button after a failed attempt', async () => {
    mockLogin.mockRejectedValue(makeAxiosError('Incorrect password'));

    render(<LoginForm />);
    await userEvent.type(
      screen.getByLabelText(/Auth\.login\.email/i),
      'user@example.com',
    );
    await userEvent.type(
      screen.getByLabelText(/Auth\.login\.password/i),
      'wrongpassword',
    );
    await userEvent.click(
      screen.getByRole('button', { name: /Auth\.login\.submit/i }),
    );

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /Auth\.login\.submit/i }),
      ).not.toBeDisabled();
    });
  });
});
