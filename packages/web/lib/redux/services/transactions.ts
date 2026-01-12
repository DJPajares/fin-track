import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const transactionsApi = createApi({
  reducerPath: 'transactionsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/transactions`,
  }),
  endpoints: (builder) => ({
    getTransactions: builder.query({
      query: ({ page, limit, body }) => ({
        url: `/getAdvanced?page=${page}&limit=${limit}`,
        method: 'POST',
        body,
      }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      transformResponse: (response: { data: any; pagination: any }) => {
        const { data, pagination } = response.data;

        return {
          data,
          pagination,
          isFullyFetched: pagination.currentPage >= pagination.totalPages,
        };
      },
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        const { body } = queryArgs;
        return `${endpointName}_${body?.userId || 'default'}`;
      },
      merge: (currentCache, newItems, { arg }) => {
        if (!Array.isArray(newItems.data)) {
          console.error('Invalid newItems structure:', newItems);
          return currentCache;
        }

        if (arg.page === 1) {
          return {
            ...newItems,
            data: [...newItems.data],
          };
        }

        return {
          ...currentCache,
          data: [...currentCache.data, ...newItems.data],
          pagination: newItems.pagination,
          isFullyFetched: newItems.isFullyFetched,
        };
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),
    createTransaction: builder.mutation({
      query: (body) => ({
        url: `/`,
        method: 'POST',
        body,
      }),
    }),
    updateTransaction: builder.mutation({
      query: ({ transactionId, postData }) => ({
        url: `/${transactionId}`,
        method: 'PUT',
        body: postData,
      }),
    }),
    deleteTransaction: builder.mutation({
      query: (transactionId) => ({
        url: `/${transactionId}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetTransactionsQuery,
  useLazyGetTransactionsQuery,
  useCreateTransactionMutation,
  useUpdateTransactionMutation,
  useDeleteTransactionMutation,
} = transactionsApi;
