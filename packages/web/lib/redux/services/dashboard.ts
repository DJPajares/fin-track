import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import formatYearMonth from '@shared/utilities/formatYearMonth';

import DASHBOARD_DATA from '@shared/mockData/transactionPayments.json';
import TRANSACTIONS_BY_TYPE_DATA from '@shared/mockData/transactionsDateRangeByType.json';

const useMockedData = process.env.NEXT_PUBLIC_USE_MOCKED_DATA === 'true';

const type = 'Dashboard';

export type DashboardDataProps = {
  date: Date;
  currency: string;
};

export type TransactionsByTypeProps = {
  startDate: Date;
  endDate: Date;
  currency: string;
};

export type TransactionsByTypeResult = {
  month: string;
  year: string;
  date: string;
  expense: number;
  income: number;
};

const formatDashboardDataQueryKey = ({
  date,
  currency,
}: DashboardDataProps) => {
  const yearMonth = formatYearMonth(new Date(date));

  return `${yearMonth}_${currency}`;
};

const formatTransactionsByTypeQueryKey = ({
  startDate,
  endDate,
  currency,
}: TransactionsByTypeProps) => {
  const startYearMonth = formatYearMonth(new Date(startDate));
  const endYearMonth = formatYearMonth(new Date(endDate));

  return `${startYearMonth}_${endYearMonth}_${currency}`;
};

export const dashboardApi = createApi({
  reducerPath: 'dashboardApi',
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_BASE_URL }),
  tagTypes: [type],
  endpoints: (builder) => ({
    getDashboardData: builder.query({
      query: ({ date, currency }) => {
        return useMockedData
          ? { url: '', method: 'GET' } // Empty request since data is mocked
          : {
              url: '/transactionPayments',
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: { date, currency },
            };
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      transformResponse: (response: any) => {
        return useMockedData ? DASHBOARD_DATA : response.data;
      },
      providesTags: (result, error, { date, currency }) => {
        return [
          {
            type: type,
            id: formatDashboardDataQueryKey({ date, currency }),
          },
        ];
      },
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        const { date, currency } = queryArgs;

        const provider = formatDashboardDataQueryKey({ date, currency });

        return `${endpointName}_${provider}`;
      },
    }),
    getTransactionsByTypeDateRange: builder.query({
      query: ({ startDate, endDate, currency }) => {
        return useMockedData
          ? { url: '', method: 'GET' } // Empty request since data is mocked
          : {
              url: '/transactions/monthly-types',
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: { startDate, endDate, currency },
            };
      },
      transformResponse: (response: unknown): TransactionsByTypeResult[] => {
        return useMockedData
          ? TRANSACTIONS_BY_TYPE_DATA
          : (response as TransactionsByTypeResult[]);
      },
      providesTags: (result, error, { startDate, endDate, currency }) => {
        return [
          {
            type: type,
            id: formatTransactionsByTypeQueryKey({
              startDate,
              endDate,
              currency,
            }),
          },
        ];
      },
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        const { startDate, endDate, currency } = queryArgs;

        const provider = formatTransactionsByTypeQueryKey({
          startDate,
          endDate,
          currency,
        });

        return `${endpointName}_${provider}`;
      },
    }),
    updateCategoryData: builder.mutation({
      query: (updatedData) => ({
        url: `transactionPayments/update`,
        method: 'POST',
        body: updatedData,
      }),
      invalidatesTags: (_result, _error, { date, currency }) => [
        { type: type, id: formatDashboardDataQueryKey({ date, currency }) },
      ],
    }),
    updateDashboardPayments: builder.mutation({
      query: (postData) => ({
        url: '/payments',
        method: 'PUT',
        body: postData,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(dashboardApi.util.invalidateTags([type]));
        } catch (error) {
          console.error('Update failed:', error);
        }
      },
    }),
  }),
});

export const {
  useGetDashboardDataQuery,
  useLazyGetDashboardDataQuery,
  useGetTransactionsByTypeDateRangeQuery,
  useLazyGetTransactionsByTypeDateRangeQuery,
  useUpdateCategoryDataMutation,
  useUpdateDashboardPaymentsMutation,
} = dashboardApi;
