import { IconProps } from '../components/shared/CardIcon';

export type TransactionProps = {
  _id: string;
  name: string;
  typeId: string;
  typeName: string;
  categoryId: string;
  categoryName: string;
  categoryIcon: IconProps;
  currencyId: string;
  currencyName: string;
  amount: number;
  description: string;
  startDate: Date;
  endDate: Date;
  isRecurring?: boolean;
  excludedDates?: [Date];
};
