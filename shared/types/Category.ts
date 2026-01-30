import type { PaginationPageProps } from '@shared/types/Pagination';
import type { TypeDataResponse } from '@shared/types/Type';

type CategoryRequest = {
  _id?: string;
  id: string;
  name: string;
  icon: string;
  type: string;
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
  name: string;
  type: TypeDataResponse;
  icon: string;
  id: string;
  isActive?: boolean;
  scope: 'global' | 'custom';
  userId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  serializedName?: string;
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
