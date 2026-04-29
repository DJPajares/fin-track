import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { SignupForm } from './SignupForm';

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

const mockSignup = vi.fn();
vi.mock('@web/services/auth', () => ({
  signup: (...args: unknown[]) => mockSignup(...args),
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

// PasswordStrengthIndicator is a real component — keep it so we can test it too.
// But it depends on next-intl which is already mocked above.

// ── Helpers ───────────────────────────────────────────────────────────────────

async function fillAndSubmit({
  name = '',
  email = 'user@example.com',
  password,
  confirmPassword,
}: {
  name?: string;
  email?: string;
  password: string;
  confirmPassword: string;
}) {
  if (name) {
    await userEvent.type(screen.getByLabelText(/Auth\.signup\.name/i), name);
  }
  await userEvent.type(screen.getByLabelText(/Auth\.signup\.email/i), email);
  await userEvent.type(
    screen.getByLabelText(/^Auth\.signup\.password$/i),
    password,
  );
  await userEvent.type(
    screen.getByLabelText(/Auth\.signup\.confirmPassword/i),
    confirmPassword,
  );
  await userEvent.click(
    screen.getByRole('button', { name: /Auth\.signup\.submit/i }),
  );
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('SignupForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all fields and submit button', () => {
    render(<SignupForm />);
    expect(screen.getByLabelText(/Auth\.signup\.name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Auth\.signup\.email/i)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/^Auth\.signup\.password$/i),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(/Auth\.signup\.confirmPassword/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Auth\.signup\.submit/i }),
    ).toBeInTheDocument();
  });

  it('password fields default to type="password"', () => {
    render(<SignupForm />);
    const inputs = document.querySelectorAll('input[type="password"]');
    expect(inputs).toHaveLength(2);
  });

  it('toggles password field visibility independently', async () => {
    render(<SignupForm />);

    const toggleButtons = screen.getAllByRole('button', {
      name: /Auth\.signup\.showPassword/i,
    });
    expect(toggleButtons).toHaveLength(2);

    // Toggle first password field
    await userEvent.click(toggleButtons[0]);
    const inputs = document.querySelectorAll(
      'input[id="password"], input[id="confirmPassword"]',
    );
    expect(inputs[0]).toHaveAttribute('type', 'text');
    expect(inputs[1]).toHaveAttribute('type', 'password');

    // Toggle second password field
    await userEvent.click(toggleButtons[1]);
    expect(inputs[0]).toHaveAttribute('type', 'text');
    expect(inputs[1]).toHaveAttribute('type', 'text');
  });

  it('shows passwordMismatch error without calling API', async () => {
    render(<SignupForm />);
    await fillAndSubmit({
      password: 'password1',
      confirmPassword: 'password2',
    });

    expect(
      screen.getByText(/Auth\.signup\.error\.passwordMismatch/i),
    ).toBeInTheDocument();
    expect(mockSignup).not.toHaveBeenCalled();
  });

  it('shows passwordTooShort error without calling API', async () => {
    render(<SignupForm />);
    await fillAndSubmit({ password: 'short', confirmPassword: 'short' });

    expect(
      screen.getByText(/Auth\.signup\.error\.passwordTooShort/i),
    ).toBeInTheDocument();
    expect(mockSignup).not.toHaveBeenCalled();
  });

  it('disables submit button and shows loading text while submitting', async () => {
    mockSignup.mockReturnValue(new Promise(() => {}));

    render(<SignupForm />);
    await fillAndSubmit({
      password: 'ValidPassword1!',
      confirmPassword: 'ValidPassword1!',
    });

    const btn = screen.getByRole('button', { name: /Auth\.signup\.loading/i });
    expect(btn).toBeDisabled();
  });

  it('shows generic error on API failure', async () => {
    mockSignup.mockRejectedValue(new Error('Network error'));

    render(<SignupForm />);
    await fillAndSubmit({
      password: 'ValidPassword1!',
      confirmPassword: 'ValidPassword1!',
    });

    await waitFor(() => {
      expect(
        screen.getByText(/Auth\.signup\.error\.generic/i),
      ).toBeInTheDocument();
    });
  });

  it('dispatches loginSuccess and redirects to /onboarding on success', async () => {
    mockSignup.mockResolvedValue({
      user: { _id: '1', email: 'user@example.com' },
      token: 'tok123',
    });

    render(<SignupForm />);
    await fillAndSubmit({
      password: 'ValidPassword1!',
      confirmPassword: 'ValidPassword1!',
    });

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith('/onboarding');
    });
  });

  it('shows the PasswordStrengthIndicator only when password is non-empty', async () => {
    render(<SignupForm />);

    // Initially hidden
    expect(
      screen.queryByText(/Auth\.passwordStrength\.label/i),
    ).not.toBeInTheDocument();

    // Type into password field
    await userEvent.type(
      screen.getByLabelText(/^Auth\.signup\.password$/i),
      'abc',
    );

    expect(
      screen.getByText(/Auth\.passwordStrength\.label/i),
    ).toBeInTheDocument();
  });

  it('re-enables submit button after a failed attempt', async () => {
    mockSignup.mockRejectedValue(new Error('Signup failed'));

    render(<SignupForm />);
    await fillAndSubmit({
      password: 'ValidPassword1!',
      confirmPassword: 'ValidPassword1!',
    });

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /Auth\.signup\.submit/i }),
      ).not.toBeDisabled();
    });
  });
});
