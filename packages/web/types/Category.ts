import type { CardIconProps } from './CardIcon';
import type { ListProps } from './List';

export type CategoryItemProps = ListProps & {
  icon: CardIconProps;
};

export type CategoryProps = {
  [key: string]: CategoryItemProps[];
};
