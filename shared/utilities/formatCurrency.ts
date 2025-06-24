import currencyLocaleMapping from '../constants/currencyLocaleMapping';

type ExtendedNumberFormatOptions = Intl.NumberFormatOptions & {
  roundingPriority?: 'auto' | 'morePrecision' | 'lessPrecision' | undefined;
  roundingIncrement?:
    | 1
    | 2
    | 5
    | 10
    | 20
    | 25
    | 50
    | 100
    | 200
    | 250
    | 500
    | 1000
    | 2000
    | 2500
    | 5000
    | undefined;
  roundingMode?:
    | 'ceil'
    | 'floor'
    | 'expand'
    | 'trunc'
    | 'halfCeil'
    | 'halfFloor'
    | 'halfExpand'
    | 'halfTrunc'
    | 'halfEven'
    | undefined;
  trailingZeroDisplay?: 'auto' | 'stripIfInteger' | undefined;
};

type FormatCurrencyProps = {
  value: number;
  currency: string;
  decimal?: number;
};

export const formatCurrency = ({
  value,
  currency = 'PHP',
  decimal = 0,
}: FormatCurrencyProps) => {
  const locale =
    currencyLocaleMapping[currency as keyof typeof currencyLocaleMapping];

  const options: ExtendedNumberFormatOptions = {
    style: 'currency',
    currency,
    minimumFractionDigits: decimal,
    maximumFractionDigits: decimal,
    trailingZeroDisplay: 'stripIfInteger',
    roundingMode: 'ceil',
  };

  return new Intl.NumberFormat(locale, options).format(value);
};
