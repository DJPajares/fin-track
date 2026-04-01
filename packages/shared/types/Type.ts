import type { PaginationPageProps } from '@shared/types/Pagination';

type TypeDataResponse = {
  _id: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
  id?: string;
};

type TypeResponse = {
  data: TypeDataResponse[];
  pagination: PaginationPageProps;
};

export type { TypeDataResponse, TypeResponse };
