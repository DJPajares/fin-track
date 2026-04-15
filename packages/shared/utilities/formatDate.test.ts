import { describe, expect, it } from 'vitest';

import { formatDate } from './formatDate';

describe('formatDate', () => {
  it('formats a date to "Mon YYYY" (e.g. Apr 2026)', () => {
    expect(formatDate(new Date('2026-04-15'))).toBe('Apr 2026');
  });

  it('formats a January date correctly', () => {
    expect(formatDate(new Date('2025-01-01'))).toBe('Jan 2025');
  });

  it('formats a December date correctly', () => {
    expect(formatDate(new Date('2024-12-31'))).toBe('Dec 2024');
  });

  it('formats a mid-year date correctly', () => {
    expect(formatDate(new Date('2023-07-20'))).toBe('Jul 2023');
  });
});
