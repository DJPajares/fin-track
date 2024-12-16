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
      transformResponse: (
        response: { data: any; pagination: any },
        meta,
        arg
      ) => {
        return response.data?.data;
      },
      // Only have one cache entry because the arg always maps to one string
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      // Always merge incoming data to the cache entry
      // merge: (currentCache, newItems, { arg }) => {
      //   if (arg.page === 1) {
      //     // Replace the cache when it's a new query
      //     return [...newItems];
      //   }
      //   // Otherwise, append to the existing cache
      //   currentCache.push(...newItems);
      // },
      merge: (currentCache, newItems, { arg }) => {
        if (!Array.isArray(newItems)) {
          console.error('Invalid newItems structure:', newItems);
          return currentCache;
        }

        if (arg.page === 1) {
          // Replace cache if fetching the first page
          return [...newItems];
        }

        // Append new items for subsequent pages
        return [...currentCache, ...newItems];
      },
      // Refetch when the page arg changes
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      }
    })
  })
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetTransactionsQuery } = transactionsApi;
