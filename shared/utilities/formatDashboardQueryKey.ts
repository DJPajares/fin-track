import formatYearMonth from '@shared/utilities/formatYearMonth';

export type FormatDashboardQueryKey = {
  date: Date;
  currency: string;
};

const formatDashboardQueryKey = ({
  date,
  currency,
}: FormatDashboardQueryKey) => {
  const yearMonth = formatYearMonth(new Date(date));

  return `${yearMonth}_${currency}`;
};

export default formatDashboardQueryKey;
