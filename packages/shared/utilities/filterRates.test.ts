import { describe, expect, it } from 'vitest';

import { filterRates } from './common';

const baseRates = {
  USD: 1,
  PHP: 56,
  EUR: 0.92,
  JPY: 155,
};

describe('filterRates', () => {
  it('returns only the accepted currencies from baseRates', () => {
    const result = filterRates(['USD', 'PHP'], baseRates);
    expect(result).toEqual({ USD: 1, PHP: 56 });
  });

  it('returns an empty object when acceptedRates is empty', () => {
    const result = filterRates([], baseRates);
    expect(result).toEqual({});
  });

  it('returns all rates when all keys are accepted', () => {
    const result = filterRates(['USD', 'PHP', 'EUR', 'JPY'], baseRates);
    expect(result).toEqual(baseRates);
  });

  it('ignores accepted keys that do not exist in baseRates', () => {
    const result = filterRates(['USD', 'BTC'], baseRates);
    expect(result).toEqual({ USD: 1 });
  });

  it('returns an empty object when baseRates is empty', () => {
    const result = filterRates(['USD', 'PHP'], {});
    expect(result).toEqual({});
  });
});
