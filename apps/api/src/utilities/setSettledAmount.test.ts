import { Types } from 'mongoose';
import { describe, expect, it } from 'vitest';

import setSettledAmount from './setSettledAmount';

const dec = (value: number) => new Types.Decimal128(value.toString());

describe('setSettledAmount', () => {
  it('marks as settled when settledAmount equals transactionAmount', () => {
    const result = setSettledAmount({
      settledAmount: dec(100),
      transactionAmount: dec(100),
    });
    expect(result.settled).toBe(true);
    expect(parseFloat(result.remainingAmount.toString())).toBe(0);
  });

  it('marks as not settled when payment is partial', () => {
    const result = setSettledAmount({
      settledAmount: dec(40),
      transactionAmount: dec(100),
    });
    expect(result.settled).toBe(false);
    expect(parseFloat(result.remainingAmount.toString())).toBe(60);
  });

  it('handles over-payment (settled amount exceeds transaction amount)', () => {
    const result = setSettledAmount({
      settledAmount: dec(120),
      transactionAmount: dec(100),
    });
    expect(result.settled).toBe(false);
    expect(parseFloat(result.remainingAmount.toString())).toBe(-20);
  });

  it('returns Decimal128 for remainingAmount', () => {
    const result = setSettledAmount({
      settledAmount: dec(50),
      transactionAmount: dec(100),
    });
    expect(result.remainingAmount).toBeInstanceOf(Types.Decimal128);
  });
});
