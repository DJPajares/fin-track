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
  if (fromCurrency === toCurrency) {
    return value;
  }

  // if (!rates[fromCurrency] || !rates[toCurrency]) {
  //   throw new Error('Currency rate not available');
  // }

  let convertedValue: number;

  if (fromCurrency === 'USD') {
    convertedValue = value * rates[toCurrency];
  } else if (toCurrency === 'USD') {
    convertedValue = value / rates[fromCurrency];
  } else {
    convertedValue = (value / rates[fromCurrency]) * rates[toCurrency];
  }

  return convertedValue;
};

export default convertCurrency;
