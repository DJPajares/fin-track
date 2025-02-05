import { Request } from 'express';
import { SortOrder } from 'mongoose';
import type { PaginationPageProps } from '../../../../shared/types/Pagination';

type QueryParamsProps = Request & {
  filter?: string;
  sort?: string;
  page?: string;
  limit?: string;
};

type QueryParamsResult = {
  queryObj: Record<string, string>;
  sortObj: Record<string, SortOrder>;
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
  pagination: PaginationPageProps;
};

type SortObjProps = {
  [key: string]: SortOrder;
};

export type {
  QueryParamsProps,
  QueryParamsResult,
  PaginationProps,
  PaginationResult,
  SortObjProps,
};
