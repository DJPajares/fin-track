import currencyLocaleMapping from '../constants/currencyLocaleMapping';

type FormatCurrencyProps = {
  value: number;
  currency: string;
  decimal?: number;
};

export const formatCurrency = ({
  value,
  currency = 'PHP',
  decimal = 0
}: FormatCurrencyProps) => {
  const locale =
    currencyLocaleMapping[currency as keyof typeof currencyLocaleMapping];

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: decimal
  }).format(value);
};
