import type { ListProps } from '../types/List';

export type SelectItemProps = {
  value: string;
  label: string;
};

export const toSelectItem = (item: ListProps): SelectItemProps => ({
  value: item._id,
  label: item.name,
});

export const toSelectItems = (items: ListProps[]): SelectItemProps[] =>
  items.map(toSelectItem);
