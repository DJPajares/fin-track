import type {
  QueryParamsProps,
  QueryParamsResult,
  SortObjProps,
} from '../types/commonTypes';

const setQueryParams = (
  query: QueryParamsProps,
  totalDocuments: number,
): QueryParamsResult => {
  const { filter, sort, page = '1', limit = '10' } = query;

  // Filtering
  const queryObj = filter ? JSON.parse(filter) : {};

  // Sorting
  const sortObj: SortObjProps = {};
  if (sort) {
    sort.split(',').forEach((sortField: string) => {
      const order = sortField.startsWith('-') ? -1 : 1;
      const field = sortField.replace(/^[-+]/, '');

      sortObj[field] = order;
    });
  }

  // Pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const totalPages = Math.ceil(totalDocuments / parseInt(limit));

  return {
    queryObj,
    sortObj,
    skip,
    limit: parseInt(limit),
    pagination: {
      limit: parseInt(limit),
      currentPage: parseInt(page),
      totalPages,
      totalDocuments,
    },
  };
};

export default setQueryParams;
