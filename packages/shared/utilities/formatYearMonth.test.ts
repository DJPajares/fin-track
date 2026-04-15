import { describe, expect, it } from 'vitest';

import formatYearMonth from './formatYearMonth';

describe('formatYearMonth', () => {
  it('returns YYYYMM as an integer for April 2026', () => {
    expect(formatYearMonth(new Date('2026-04-01'))).toBe(202604);
  });

  it('zero-pads single-digit months (January)', () => {
    expect(formatYearMonth(new Date('2025-01-15'))).toBe(202501);
  });

  it('zero-pads single-digit months (September)', () => {
    expect(formatYearMonth(new Date('2024-09-10'))).toBe(202409);
  });

  it('returns the correct integer for December (month 12)', () => {
    expect(formatYearMonth(new Date('2023-12-31'))).toBe(202312);
  });

  it('returns a number type', () => {
    expect(typeof formatYearMonth(new Date('2026-04-01'))).toBe('number');
  });
});
