import { languages } from '../constants/languages';

const sortedLanguages = [...languages].sort((a, b) => {
  if (a.value === 'en') return -1;
  if (b.value === 'en') return 1;
  return a.label.localeCompare(b.label);
});

const filterRates = (
  acceptedRates: string[],
  baseRates: Record<string, number>,
) => {
  return Object.keys(baseRates).reduce(
    (acc: Record<string, number>, curr: string) => {
      if (acceptedRates.includes(curr)) {
        acc[curr] = baseRates[curr];
      }
      return acc;
    },
    {},
  );
};

export { sortedLanguages, filterRates };
