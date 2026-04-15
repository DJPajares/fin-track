import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import CardButton from './CardButton';

const noop = vi.fn();

describe('CardButton', () => {
  it('renders the label text', () => {
    render(
      <CardButton label="Groceries" handleOnClick={noop} isActive={false} />,
    );
    expect(screen.getByText('Groceries')).toBeInTheDocument();
  });

  it('calls handleOnClick when clicked', async () => {
    const handleOnClick = vi.fn();
    const { getByRole } = render(
      <CardButton
        label="Click me"
        handleOnClick={handleOnClick}
        isActive={false}
      />,
    );
    await userEvent.click(getByRole('button'));
    expect(handleOnClick).toHaveBeenCalledOnce();
  });

  it('sets aria-pressed="true" when isActive is true', () => {
    const { getByRole } = render(
      <CardButton label="Active" handleOnClick={noop} isActive={true} />,
    );
    expect(getByRole('button')).toHaveAttribute('aria-pressed', 'true');
  });

  it('sets aria-pressed="false" when isActive is false', () => {
    const { getByRole } = render(
      <CardButton label="Inactive" handleOnClick={noop} isActive={false} />,
    );
    expect(getByRole('button')).toHaveAttribute('aria-pressed', 'false');
  });

  it('applies active variant classes when isActive is true', () => {
    const { getByRole } = render(
      <CardButton label="Active" handleOnClick={noop} isActive={true} />,
    );
    expect(getByRole('button').className).toContain('border-primary');
  });

  it('applies inactive variant classes when isActive is false', () => {
    const { getByRole } = render(
      <CardButton label="Inactive" handleOnClick={noop} isActive={false} />,
    );
    expect(getByRole('button').className).toContain('border-border/70');
  });

  it('applies sm padding class for size="sm"', () => {
    const { getByRole } = render(
      <CardButton
        label="Small"
        handleOnClick={noop}
        isActive={false}
        size="sm"
      />,
    );
    expect(getByRole('button').className).toContain('p-2');
  });

  it('applies md padding class for size="md"', () => {
    const { getByRole } = render(
      <CardButton
        label="Medium"
        handleOnClick={noop}
        isActive={false}
        size="md"
      />,
    );
    expect(getByRole('button').className).toContain('p-3');
  });

  it('applies lg padding class for size="lg"', () => {
    const { getByRole } = render(
      <CardButton
        label="Large"
        handleOnClick={noop}
        isActive={false}
        size="lg"
      />,
    );
    expect(getByRole('button').className).toContain('p-4');
  });

  it('renders as a button element', () => {
    const { getByRole } = render(
      <CardButton label="Button" handleOnClick={noop} isActive={false} />,
    );
    expect(getByRole('button')).toBeInTheDocument();
  });
});
