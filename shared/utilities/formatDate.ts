export const formatDate = (date: Date) => {
  const year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date);
  const month = new Intl.DateTimeFormat('en', { month: 'short' }).format(date);

  return `${month} ${year}`;
};
