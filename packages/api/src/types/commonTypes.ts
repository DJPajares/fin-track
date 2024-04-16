import { Request } from 'express';

type PaginationProps = Request & {
  page?: string;
  limit?: string;
};

export { PaginationProps };
