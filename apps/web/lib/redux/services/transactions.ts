import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import moment from 'moment';

type TransactionsByCategoryProps = {
  date: Date;
  currency: string;
  type?: string;
  userId: string;
};

type TransactionsMonthlyCategoriesProps = {
  startDate: Date;
  endDate: Date;
  currency: string;
  type?: string;
  aggregateBy?: 'amount' | 'paidAmount';
  userId: string;
};

type TransactionsMonthlyCategoriesResult = Array<
  Record<string, number | string>
>;

const formatTransactionsByCategoryQueryKey = ({
  date,
  currency,
  type,
  userId,
}: TransactionsByCategoryProps & { userId: string }) => {
  const yearMonth = moment(date).format('YYYYMM');

  return `${yearMonth}_${currency}_${type}_${userId}`;
};

const formatTransactionsMonthlyCategoriesQueryKey = ({
  startDate,
  endDate,
  currency,
  type,
  aggregateBy,
  userId,
}: TransactionsMonthlyCategoriesProps) => {
  const start = moment(startDate).format('YYYYMM');
  const end = moment(endDate).format('YYYYMM');

  return `${start}_${end}_${currency}_${type ?? ''}_${aggregateBy ?? 'amount'}_${userId}`;
};

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
        const { data, pagination } = response;

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
    getTransactionsByCategory: builder.query({
      query: (body) => ({
        url: `/categories-chart`,
        method: 'POST',
        body,
      }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      transformResponse: (response: any) => {
        return response.data;
      },
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        const { date, currency, type, userId } = queryArgs;

        const provider = formatTransactionsByCategoryQueryKey({
          date,
          currency,
          type,
          userId,
        });

        return `${endpointName}_${provider}`;
      },
    }),
    getTransactionsMonthlyCategoriesByDateRange: builder.query<
      TransactionsMonthlyCategoriesResult,
      TransactionsMonthlyCategoriesProps
    >({
      query: (body) => ({
        url: `/monthly-categories`,
        method: 'POST',
        body,
      }),
      transformResponse: (
        response:
          | TransactionsMonthlyCategoriesResult
          | { data: TransactionsMonthlyCategoriesResult },
      ) => {
        return Array.isArray(response) ? response : response.data;
      },
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        const provider = formatTransactionsMonthlyCategoriesQueryKey(queryArgs);

        return `${endpointName}_${provider}`;
      },
    }),
  }),
});

export const {
  useGetTransactionsQuery, // getTransactions
  useLazyGetTransactionsQuery, // getTransactions
  useCreateTransactionMutation, // createTransaction
  useUpdateTransactionMutation, // updateTransaction
  useDeleteTransactionMutation, // deleteTransaction
  useGetTransactionsByCategoryQuery, // getTransactionsByCategory
  useGetTransactionsMonthlyCategoriesByDateRangeQuery, // getTransactionsMonthlyCategoriesByDateRange
} = transactionsApi;
