import type { PaginationPageProps } from './Pagination';
import type { TypeDataResponse } from './Type';

type CategoryRequest = {
  _id?: string;
  id?: string; // move serialization to backend
  name: string;
  icon: string;
  type: string;
  scope?: 'global' | 'custom';
  isActive?: boolean;
};

type CustomCategoryRequest = CategoryRequest & {
  userId: string;
};

type FetchCategoryRequest = {
  userId?: string;
};

type CategoryDataResponse = {
  _id: string;
  id: string;
  name: string;
  type: TypeDataResponse;
  icon: string;
  isActive?: boolean;
  scope: 'global' | 'custom';
  userId?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

type CategoryResponse = {
  data: CategoryDataResponse[];
  pagination: PaginationPageProps;
};

export type {
  FetchCategoryRequest,
  CategoryRequest,
  CustomCategoryRequest,
  CategoryResponse,
  CategoryDataResponse,
};
