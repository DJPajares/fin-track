import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import transactionPaymentsData from '@shared/mockData/transactionPayments.json';
import formatYearMonth from '@shared/utilities/formatYearMonth';

const useMockedData = process.env.NEXT_PUBLIC_USE_MOCKED_DATA === 'true';

const type = 'Dashboard';

type FormatQueryKeyProps = {
  date: Date;
  currency: string;
};

const formatQueryKey = ({ date, currency }: FormatQueryKeyProps) => {
  const yearMonth = formatYearMonth(new Date(date));

  return `${yearMonth}_${currency}`;
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
      transformResponse: (response: Record<string, unknown>) => {
        return useMockedData ? transactionPaymentsData : response.data;
      },
      providesTags: (result, error, { date, currency }) => {
        return [
          {
            type: type,
            id: formatQueryKey({ date, currency }),
          },
        ];
      },
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        const { date, currency } = queryArgs;

        const provider = formatQueryKey({ date, currency });

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
        { type: type, id: formatQueryKey({ date, currency }) },
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
  useUpdateCategoryDataMutation,
  useUpdateDashboardPaymentsMutation,
} = dashboardApi;
