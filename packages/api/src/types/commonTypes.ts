import { Request } from 'express';

type QueryParamsProps = Request & {
  filter?: string;
  sort?: string;
  page?: string;
  limit?: string;
};

type QueryParamsResult = {
  queryObj: Record<string, string>;
  sortObj: Record<string, number>;
  skip: number;
  limit: number;
  pagination: {
    limit: number;
    currentPage: number;
    totalPages: number;
    totalDocuments: number;
  };
};

type PaginationProps = Request & {
  page?: string;
  limit?: string;
};

type PaginationResult = {
  skip: number;
  limit: number;
  pagination: {
    limit: number;
    currentPage: number;
    totalPages: number;
    totalDocuments: number;
  };
};

export type {
  QueryParamsProps,
  QueryParamsResult,
  PaginationProps,
  PaginationResult
};
