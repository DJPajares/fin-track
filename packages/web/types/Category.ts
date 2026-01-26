import type { IconProps } from '../components/shared/CardIcon';
import type { ListProps } from './List';
import type { TypeProps } from './Type';

export type CategoryItemProps = ListProps & {
  id: string;
  type: TypeProps;
  icon: IconProps;
  isActive?: boolean;
  serializedName?: string;
};

export type CategoryProps = {
  [key: string]: CategoryItemProps[];
};
