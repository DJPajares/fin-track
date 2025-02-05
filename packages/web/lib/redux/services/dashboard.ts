import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import transactionPaymentsData from '@shared/mockData/transactionPayments.json';

const useMockedData = process.env.NEXT_PUBLIC_USE_MOCKED_DATA === 'true';

const transactionPaymentsUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/transactionPayments`;

export const dashboardApi = createApi({
  reducerPath: 'dashboardApi',
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_BASE_URL }),
  tagTypes: ['Dashboard'],
  endpoints: (builder) => ({
    getDashboardData: builder.query({
      queryFn: async ({ date, currency }) => {
        try {
          if (useMockedData) {
            return { data: transactionPaymentsData };
          } else {
            const response = await fetch(transactionPaymentsUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ date, currency }),
            });

            if (!response.ok) {
              throw new Error('API request failed');
            }

            const json = await response.json();
            return { data: json.data };
          }
        } catch (error) {
          console.error('Fetch failed', error);
          return { error: error.message };
        }
      },
      providesTags: (result, error, { date, currency }) => [
        { type: 'Dashboard', id: `${date}-${currency}` },
      ],
    }),
    updateCategoryData: builder.mutation({
      query: (updatedData) => ({
        url: `transactionPayments/update`,
        method: 'POST',
        body: updatedData,
      }),
      invalidatesTags: (_result, _error, { date, currency }) => [
        { type: 'Dashboard', id: `${date}-${currency}` },
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
          dispatch(dashboardApi.util.invalidateTags(['Dashboard']));
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
