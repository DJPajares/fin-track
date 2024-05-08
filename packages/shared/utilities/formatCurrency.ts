import currencyLocaleMapping from '../../../constants/currencyLocaleMapping';

type FormatCurrencyProps = {
  value: number;
  currency: string;
};

export const formatCurrency = ({ value, currency }: FormatCurrencyProps) => {
  const locale =
    currencyLocaleMapping[currency as keyof typeof currencyLocaleMapping];

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency
  }).format(value);
};
