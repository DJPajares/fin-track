import { Types } from 'mongoose';
import { describe, expect, it } from 'vitest';

import parseObjectId from './parseObjectId';

const validId = '507f1f77bcf86cd799439011';

describe('parseObjectId', () => {
  it('returns a ObjectId for a valid 24-character hex string', () => {
    const result = parseObjectId(validId);
    expect(result).toBeInstanceOf(Types.ObjectId);
    expect(result?.toString()).toBe(validId);
  });

  it('returns null for an invalid string', () => {
    expect(parseObjectId('abc')).toBeNull();
    expect(parseObjectId('not-an-id')).toBeNull();
  });

  it('returns null for an empty string', () => {
    expect(parseObjectId('')).toBeNull();
  });

  it('returns null for undefined', () => {
    expect(parseObjectId(undefined)).toBeNull();
  });

  it('uses the first element when given an array with a valid id', () => {
    const result = parseObjectId([validId]);
    expect(result).toBeInstanceOf(Types.ObjectId);
    expect(result?.toString()).toBe(validId);
  });

  it('returns null when given an array with an invalid id', () => {
    expect(parseObjectId(['bad-id'])).toBeNull();
  });
});
