type RateProps = Record<string, number>;

const convertCurrency = (
  value: number,
  fromCurrency: string,
  toCurrency: string,
  rates: RateProps
): number => {
  let convertedValue = rates[fromCurrency];

  if (toCurrency !== 'USD') {
    const valueInUsd = value / rates[fromCurrency];
    convertedValue = valueInUsd * rates[toCurrency];
  }

  return convertedValue;
};

export default convertCurrency;
