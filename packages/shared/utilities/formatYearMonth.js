'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const formatYearMonth = (date) => {
  const year = new Date(date).getFullYear();
  const month = new Date(date).getMonth() + 1;
  const paddedMonth = month.toString().padStart(2, '0');
  const yearMonth = parseInt(`${year}${paddedMonth}`);
  return yearMonth;
};
exports.default = formatYearMonth;
