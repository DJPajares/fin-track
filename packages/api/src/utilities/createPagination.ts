import { PaginationProps } from '../types/commonTypes';

const createPagination = (query: PaginationProps, totalDocuments: number) => {
  const { page = '1', limit = '10' } = query;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const totalPages = Math.ceil(totalDocuments / parseInt(limit));

  return {
    skip,
    limit: parseInt(limit),
    pagination: {
      limit: parseInt(limit),
      currentPage: parseInt(page),
      totalPages,
      totalDocuments
    }
  };
};

export default createPagination;
