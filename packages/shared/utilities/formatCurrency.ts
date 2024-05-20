import currencyLocaleMapping from '../../../constants/currencyLocaleMapping';

type FormatCurrencyProps = {
  value: number;
  currency: string;
};

export const formatCurrency = ({
  value,
  currency = 'PHP'
}: FormatCurrencyProps) => {
  const locale =
    currencyLocaleMapping[currency as keyof typeof currencyLocaleMapping];

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency
  }).format(value);
};
