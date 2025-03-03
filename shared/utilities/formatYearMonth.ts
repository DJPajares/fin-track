const formatYearMonth = (date: Date) => {
  const year = new Date(date).getFullYear();
  const month = new Date(date).getMonth() + 1;
  const paddedMonth = month.toString().padStart(2, '0');
  const yearMonth = `${year}${paddedMonth}`;

  return yearMonth;
};

export default formatYearMonth;
