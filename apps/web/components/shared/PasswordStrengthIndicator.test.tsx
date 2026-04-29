import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { PasswordStrengthIndicator } from './PasswordStrengthIndicator';

vi.mock('next-intl', () => ({
  useTranslations: (namespace: string) => (key: string) =>
    `${namespace}.${key}`,
}));

describe('PasswordStrengthIndicator', () => {
  it('renders nothing when password is empty', () => {
    const { container } = render(<PasswordStrengthIndicator password="" />);
    expect(container.firstChild).toBeNull();
  });

  it('shows Weak for a short, simple password', () => {
    render(<PasswordStrengthIndicator password="abc" />);
    expect(
      screen.getByText(/Auth\.passwordStrength\.weak/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Auth\.passwordStrength\.label/i),
    ).toBeInTheDocument();
  });

  it('shows Fair for a password meeting 2 strength criteria', () => {
    // length >= 8 (+1) and has uppercase (+1) = score 2 → Fair
    render(<PasswordStrengthIndicator password="Abcdefgh" />);
    expect(
      screen.getByText(/Auth\.passwordStrength\.fair/i),
    ).toBeInTheDocument();
  });

  it('shows Good for a password meeting 3 strength criteria', () => {
    // length >= 8 (+1), uppercase (+1), digit (+1) = score 3 → Good
    render(<PasswordStrengthIndicator password="Abcdef1g" />);
    expect(
      screen.getByText(/Auth\.passwordStrength\.good/i),
    ).toBeInTheDocument();
  });

  it('shows Strong for a password meeting 4+ criteria', () => {
    // length >= 8 (+1), length >= 12 (+1), uppercase (+1), digit (+1), special char (+1) = 5 → Strong
    render(<PasswordStrengthIndicator password="Str0ng!Password" />);
    expect(
      screen.getByText(/Auth\.passwordStrength\.strong/i),
    ).toBeInTheDocument();
  });

  it('renders 4 bar segments', () => {
    render(<PasswordStrengthIndicator password="abc" />);
    // The 4 segments live inside the role="presentation" div
    const presentation = document.querySelector('[role="presentation"]');
    expect(presentation?.childElementCount).toBe(4);
  });

  it('weak level fills exactly 1 segment', () => {
    render(<PasswordStrengthIndicator password="abc" />);
    const presentation = document.querySelector('[role="presentation"]');
    const segments = Array.from(presentation?.children ?? []);
    const filled = segments.filter((s) =>
      s.className.includes('bg-destructive'),
    );
    expect(filled).toHaveLength(1);
  });

  it('strong level fills all 4 segments', () => {
    render(<PasswordStrengthIndicator password="Str0ng!Password" />);
    const presentation = document.querySelector('[role="presentation"]');
    const segments = Array.from(presentation?.children ?? []);
    // All 4 should NOT have bg-muted (the unfilled colour)
    const unfilled = segments.filter((s) => s.className.includes('bg-muted'));
    expect(unfilled).toHaveLength(0);
  });
});
