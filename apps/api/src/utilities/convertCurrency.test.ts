import { describe, expect, it } from 'vitest';

import convertCurrency from './convertCurrency';

const rates = {
  PHP: 56,
  EUR: 0.92,
  JPY: 155,
};

describe('convertCurrency', () => {
  it('returns the original value when fromCurrency equals toCurrency', () => {
    expect(
      convertCurrency({
        value: 100,
        fromCurrency: 'PHP',
        toCurrency: 'PHP',
        rates,
      }),
    ).toBe(100);
  });

  it('converts from USD to another currency', () => {
    expect(
      convertCurrency({
        value: 1,
        fromCurrency: 'USD',
        toCurrency: 'PHP',
        rates,
      }),
    ).toBe(56);
  });

  it('converts from another currency to USD', () => {
    expect(
      convertCurrency({
        value: 56,
        fromCurrency: 'PHP',
        toCurrency: 'USD',
        rates,
      }),
    ).toBe(1);
  });

  it('converts cross-currency (PHP → EUR) via USD base', () => {
    const result = convertCurrency({
      value: 56,
      fromCurrency: 'PHP',
      toCurrency: 'EUR',
      rates,
    });
    expect(result).toBeCloseTo(0.92, 5);
  });

  it('converts cross-currency (EUR → JPY) via USD base', () => {
    const result = convertCurrency({
      value: 0.92,
      fromCurrency: 'EUR',
      toCurrency: 'JPY',
      rates,
    });
    expect(result).toBeCloseTo(155, 2);
  });

  it('returns zero for a zero value regardless of currencies', () => {
    expect(
      convertCurrency({
        value: 0,
        fromCurrency: 'PHP',
        toCurrency: 'EUR',
        rates,
      }),
    ).toBe(0);
  });
});
