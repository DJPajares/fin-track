import { describe, expect, it } from 'vitest';

import type { QueryParamsProps } from '../types/commonTypes';
import setQueryParams from './setQueryParams';

const props = (
  overrides: Partial<{
    filter: string;
    sort: string;
    page: string;
    limit: string;
  }>,
): QueryParamsProps => overrides as unknown as QueryParamsProps;

describe('setQueryParams', () => {
  it('returns empty queryObj and sortObj when no filter or sort provided', () => {
    const result = setQueryParams(props({}), 10);
    expect(result.queryObj).toEqual({});
    expect(result.sortObj).toEqual({});
  });

  it('parses a JSON filter string into queryObj', () => {
    const result = setQueryParams(props({ filter: '{"type":"income"}' }), 10);
    expect(result.queryObj).toEqual({ type: 'income' });
  });

  it('maps a descending sort field (leading -) to -1', () => {
    const result = setQueryParams(props({ sort: '-createdAt' }), 10);
    expect(result.sortObj).toEqual({ createdAt: -1 });
  });

  it('maps an ascending sort field (leading + or no prefix) to 1', () => {
    const resultPlus = setQueryParams(props({ sort: '+name' }), 10);
    expect(resultPlus.sortObj).toEqual({ name: 1 });

    const resultBare = setQueryParams(props({ sort: 'name' }), 10);
    expect(resultBare.sortObj).toEqual({ name: 1 });
  });

  it('handles multiple sort fields', () => {
    const result = setQueryParams(props({ sort: '+name,-createdAt' }), 10);
    expect(result.sortObj).toEqual({ name: 1, createdAt: -1 });
  });

  it('computes correct skip and totalPages using default page/limit', () => {
    const result = setQueryParams(props({}), 25);
    // Default page=1, limit=10
    expect(result.skip).toBe(0);
    expect(result.limit).toBe(10);
    expect(result.pagination.totalPages).toBe(3);
    expect(result.pagination.currentPage).toBe(1);
  });

  it('computes correct skip for page 2', () => {
    const result = setQueryParams(props({ page: '2', limit: '10' }), 25);
    expect(result.skip).toBe(10);
  });
});
