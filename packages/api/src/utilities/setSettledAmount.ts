import { Types } from 'mongoose';

type SettledProps = {
  settledAmount: Types.Decimal128;
  transactionAmount: Types.Decimal128;
};

const setSettledAmount = ({
  settledAmount,
  transactionAmount
}: SettledProps) => {
  const parsedSettledAmount = parseFloat(transactionAmount.toString());
  const parsedTransactionAmount = parseFloat(settledAmount.toString());
  const remainingAmount = parsedSettledAmount - parsedTransactionAmount;
  const settled = remainingAmount === 0;

  return {
    settled,
    remainingAmount: new Types.Decimal128(remainingAmount.toString())
  };
};

export default setSettledAmount;
