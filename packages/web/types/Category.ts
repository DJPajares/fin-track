import type { CategoryDataResponse } from '@shared/types/Category';
import type { IconProps } from '../components/shared/CardIcon';
import type { TypeProps } from './Type';

export type CategoryItemProps = CategoryDataResponse & {
  type: TypeProps;
  icon: IconProps;
};

export type CategoryProps = {
  [key: string]: CategoryItemProps[];
};
