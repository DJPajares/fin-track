import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import transactionPaymentsData from '@shared/mockData/transactionPayments.json';
import formatDashboardQueryKey from '@shared/utilities/formatDashboardQueryKey';

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
          let errorMessage = 'Failed to fetch dashboard data';
          const errorStatus = 500;

          if (error instanceof Error) {
            errorMessage = error.message;
          }

          console.error('Fetch failed:', errorMessage);

          return {
            error: {
              status: errorStatus,
              statusText: errorMessage,
              data: errorMessage,
            },
          };
        }
      },
      providesTags: (result, error, { date, currency }) => {
        return [
          {
            type: 'Dashboard',
            id: formatDashboardQueryKey({ date, currency }),
          },
        ];
      },
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        const { date, currency } = queryArgs;

        const provider = formatDashboardQueryKey({ date, currency });

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
        { type: 'Dashboard', id: formatDashboardQueryKey({ date, currency }) },
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
