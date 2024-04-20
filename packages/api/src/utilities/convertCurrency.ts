type RateProps = Record<string, number>;

const convertCurrency = (
  value: number,
  fromCurrency: string,
  toCurrency: string,
  rates: RateProps
): number => {
  const valueInUsd = value / rates[fromCurrency];

  const convertedValue =
    toCurrency === 'USD' ? valueInUsd : valueInUsd * rates[toCurrency];

  return convertedValue;
};

export default convertCurrency;
