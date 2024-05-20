type ConvertCurrencyProps = {
  value: number;
  fromCurrency: string;
  toCurrency: string;
  rates: Record<string, number>;
};

const convertCurrency = ({
  value,
  fromCurrency,
  toCurrency,
  rates
}: ConvertCurrencyProps): number => {
  const valueInUsd = value / rates[fromCurrency];

  const convertedValue =
    toCurrency === 'USD' ? valueInUsd : valueInUsd * rates[toCurrency];

  return convertedValue;
};

export default convertCurrency;
