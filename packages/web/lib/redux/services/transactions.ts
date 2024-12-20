import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const transactionsApi = createApi({
  reducerPath: 'transactionsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/transactions`
  }),
  endpoints: (builder) => ({
    getTransactions: builder.query({
      query: ({ page, limit, body }) => ({
        url: `/getAdvanced?page=${page}&limit=${limit}`,
        method: 'POST',
        body
      }),
      transformResponse: (response: { data: any; pagination: any }) => {
        const { data, pagination } = response.data;

        return {
          data,
          pagination,
          isFullyFetched: pagination.currentPage >= pagination.totalPages
        };
      },
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      merge: (currentCache, newItems, { arg }) => {
        if (!Array.isArray(newItems.data)) {
          console.error('Invalid newItems structure:', newItems);
          return currentCache;
        }

        if (arg.page === 1) {
          return {
            ...newItems,
            data: [...newItems.data]
          };
        }

        return {
          ...currentCache,
          data: [...currentCache.data, ...newItems.data],
          pagination: newItems.pagination,
          isFullyFetched: newItems.isFullyFetched
        };
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      }
    })
  })
});

export const { useGetTransactionsQuery } = transactionsApi;
