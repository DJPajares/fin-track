import type { PaginationProps, PaginationResult } from '../types/commonTypes';

const createPagination = (
  query: PaginationProps,
  totalDocuments: number
): PaginationResult => {
  const { page = '1', limit } = query;

  // Use totalDocuments if limit is not defined
  const effectiveLimit =
    limit && parseInt(limit) > 0 ? limit : totalDocuments.toString();

  const skip = (parseInt(page) - 1) * parseInt(effectiveLimit);
  const totalPages = Math.ceil(totalDocuments / parseInt(effectiveLimit));

  return {
    skip,
    limit: parseInt(effectiveLimit),
    pagination: {
      limit: parseInt(effectiveLimit),
      currentPage: parseInt(page),
      totalPages,
      totalDocuments
    }
  };
};

export default createPagination;
