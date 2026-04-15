import { describe, expect, it } from 'vitest';

import type { PaginationProps } from '../types/commonTypes';
import createPagination from './createPagination';

// Cast plain objects to PaginationProps (extends Express Request)
const props = (page?: string, limit?: string): PaginationProps =>
  ({ page, limit }) as unknown as PaginationProps;

describe('createPagination', () => {
  it('returns correct skip, limit, and totalPages for page 1', () => {
    const result = createPagination(props('1', '10'), 25);
    expect(result.skip).toBe(0);
    expect(result.limit).toBe(10);
    expect(result.pagination.totalPages).toBe(3);
    expect(result.pagination.currentPage).toBe(1);
    expect(result.pagination.totalDocuments).toBe(25);
  });

  it('returns correct skip for page 2', () => {
    const result = createPagination(props('2', '10'), 25);
    expect(result.skip).toBe(10);
  });

  it('falls back to totalDocuments as limit when limit is not provided', () => {
    const result = createPagination(props('1', undefined), 25);
    expect(result.limit).toBe(25);
    expect(result.pagination.totalPages).toBe(1);
  });

  it('falls back to totalDocuments as limit when limit is "0"', () => {
    const result = createPagination(props('1', '0'), 25);
    expect(result.limit).toBe(25);
  });

  it('calculates correct skip for the last page', () => {
    // page 3 of 3 with limit 10 and 25 total documents
    const result = createPagination(props('3', '10'), 25);
    expect(result.skip).toBe(20);
    expect(result.pagination.currentPage).toBe(3);
    expect(result.pagination.totalPages).toBe(3);
  });

  it('returns limit = 0 and skip = 0 when totalDocuments is 0 and no limit', () => {
    const result = createPagination(props('1', undefined), 0);
    expect(result.skip).toBe(0);
    expect(result.limit).toBe(0);
  });
});
