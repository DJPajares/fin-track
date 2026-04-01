'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.filterRates = exports.sortedLanguages = void 0;
const languages_1 = require('../constants/languages');
const sortedLanguages = [...languages_1.languages].sort((a, b) => {
  if (a.value === 'en') return -1;
  if (b.value === 'en') return 1;
  return a.label.localeCompare(b.label);
});
exports.sortedLanguages = sortedLanguages;
const filterRates = (acceptedRates, baseRates) => {
  return Object.keys(baseRates).reduce((acc, curr) => {
    if (acceptedRates.includes(curr)) {
      acc[curr] = baseRates[curr];
    }
    return acc;
  }, {});
};
exports.filterRates = filterRates;
