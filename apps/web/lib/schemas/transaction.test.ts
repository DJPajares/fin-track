import { describe, expect, it } from 'vitest';

import { transactionSchema } from './transaction';

const validData = {
  category: 'cat-id-123',
  name: 'Groceries',
  currency: 'PHP',
  amount: 500,
  isRecurring: false,
  startDate: new Date('2026-04-01'),
  endDate: new Date('2026-04-30'),
};

describe('transactionSchema', () => {
  it('parses a valid transaction object successfully', () => {
    const result = transactionSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('accepts an optional id field', () => {
    const result = transactionSchema.safeParse({ ...validData, id: 'txn-1' });
    expect(result.success).toBe(true);
  });

  it('accepts an omitted id field', () => {
    const { ...withoutId } = { ...validData };
    const result = transactionSchema.safeParse(withoutId);
    expect(result.success).toBe(true);
  });

  it('accepts optional excludedDates', () => {
    const result = transactionSchema.safeParse({
      ...validData,
      excludedDates: [{ _id: 'd1', name: '2026-04-10' }],
    });
    expect(result.success).toBe(true);
  });

  it('fails when category is empty', () => {
    const result = transactionSchema.safeParse({ ...validData, category: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      const messages = result.error.issues.map((i) => i.message);
      expect(messages).toContain('Please select a category');
    }
  });

  it('fails when name is empty', () => {
    const result = transactionSchema.safeParse({ ...validData, name: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      const messages = result.error.issues.map((i) => i.message);
      expect(messages).toContain('Please enter a title');
    }
  });

  it('fails when currency is empty', () => {
    const result = transactionSchema.safeParse({ ...validData, currency: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      const messages = result.error.issues.map((i) => i.message);
      expect(messages).toContain('Please select a currency');
    }
  });

  it('fails when amount is negative', () => {
    const result = transactionSchema.safeParse({ ...validData, amount: -1 });
    expect(result.success).toBe(false);
    if (!result.success) {
      const messages = result.error.issues.map((i) => i.message);
      expect(messages).toContain('Amount must be a positive number');
    }
  });

  it('accepts amount of zero', () => {
    const result = transactionSchema.safeParse({ ...validData, amount: 0 });
    expect(result.success).toBe(true);
  });

  it('fails when description exceeds 240 characters', () => {
    const result = transactionSchema.safeParse({
      ...validData,
      description: 'a'.repeat(241),
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const messages = result.error.issues.map((i) => i.message);
      expect(messages).toContain('Description must be under 240 characters.');
    }
  });

  it('accepts a description exactly 240 characters long', () => {
    const result = transactionSchema.safeParse({
      ...validData,
      description: 'a'.repeat(240),
    });
    expect(result.success).toBe(true);
  });
});
