import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import formatYearMonth from '@shared/utilities/formatYearMonth';

import DASHBOARD_DATA from '@shared/mockData/transactionPayments.json';
import TRANSACTIONS_BY_TYPE_DATA from '@shared/mockData/transactionsDateRangeByType.json';
import TRANSACTION_PAYMENTS_BY_CATEGORY from '@shared/mockData/transactionPaymentsByCategory.json';
import { TransactionProps } from '@web/types/TransactionPayment';
import { Moment } from 'moment';

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

export type TransactionPaymentsByCategoryProps = {
  startDate: Date;
  endDate: Date;
  currency: string;
  category: string;
};

export type TransactionPaymentsByCategoryResult = {
  date: string;
  year: number;
  month: number;
  yearMonth: string;
  categoryId: string;
  categoryName: string;
  currencyId: string;
  currencyName: string;
  paidAmount: number;
};

export type UpdateDashboardPaymentsDataProps = {
  _id: TransactionProps['paymentId'];
  transaction: TransactionProps['_id'];
  currency: TransactionProps['localAmount']['currency']['_id'];
  amount: TransactionProps['localAmount']['paidAmount'];
  date: Moment;
};

export type UpdateDashboardPaymentsProps = {
  payments: UpdateDashboardPaymentsDataProps[];
  userId: string;
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

const formatTransactionPaymentsByCategoryQueryKey = ({
  startDate,
  endDate,
  currency,
  category,
}: TransactionPaymentsByCategoryProps) => {
  const startYearMonth = formatYearMonth(new Date(startDate));
  const endYearMonth = formatYearMonth(new Date(endDate));

  return `${startYearMonth}_${endYearMonth}_${currency}_${category}`;
};

export const dashboardApi = createApi({
  reducerPath: 'dashboardApi',
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_BASE_URL }),
  tagTypes: [type],
  endpoints: (builder) => ({
    getDashboardData: builder.query({
      query: (body) => {
        return useMockedData
          ? { url: '', method: 'GET' } // Empty request since data is mocked
          : {
              url: '/transaction-payments',
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body,
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
    getTransactionPaymentsByCategory: builder.query({
      query: ({ startDate, endDate, currency, userId, category }) => {
        return useMockedData
          ? { url: '', method: 'GET' } // Empty request since data is mocked
          : {
              url: `/transaction-payments/monthly-by-category/${category}`,
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: { startDate, endDate, currency, userId },
            };
      },
      transformResponse: (
        response: unknown,
      ): TransactionPaymentsByCategoryResult[] => {
        return useMockedData
          ? TRANSACTION_PAYMENTS_BY_CATEGORY
          : (response as TransactionPaymentsByCategoryResult[]);
      },
      providesTags: (
        result,
        error,
        { startDate, endDate, currency, category },
      ) => {
        return [
          {
            type: type,
            id: formatTransactionPaymentsByCategoryQueryKey({
              startDate,
              endDate,
              currency,
              category,
            }),
          },
        ];
      },
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        const { startDate, endDate, currency, category } = queryArgs;

        const provider = formatTransactionPaymentsByCategoryQueryKey({
          startDate,
          endDate,
          currency,
          category,
        });

        return `${endpointName}_${provider}`;
      },
    }),
    getTransactionsByTypeDateRange: builder.query({
      query: (body) => {
        return useMockedData
          ? { url: '', method: 'GET' } // Empty request since data is mocked
          : {
              url: '/transactions/monthly-types',
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body,
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
        url: `transaction-payments/update`,
        method: 'POST',
        body: updatedData,
      }),
      invalidatesTags: (_result, _error, { date, currency }) => [
        { type: type, id: formatDashboardDataQueryKey({ date, currency }) },
      ],
    }),
    updateDashboardPayments: builder.mutation({
      query: (body: UpdateDashboardPaymentsProps) => ({
        url: '/payments',
        method: 'PUT',
        body,
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
  useGetTransactionPaymentsByCategoryQuery,
  useGetTransactionsByTypeDateRangeQuery,
  useLazyGetTransactionsByTypeDateRangeQuery,
  useUpdateCategoryDataMutation,
  useUpdateDashboardPaymentsMutation,
} = dashboardApi;
