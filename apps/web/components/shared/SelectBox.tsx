import { ListBox, Select, SelectVariants } from '@heroui/react';
import { Dispatch, SetStateAction } from 'react';

import type { ListProps } from '../../types/List';

export type SelectBoxProps = {
  variant?: SelectVariants['variant'];
  items: ListProps[];
  selectedItem: ListProps;
  setSelectedItem: Dispatch<SetStateAction<ListProps>>;
  placeholder?: string;
  className?: string;
};

export const SelectBox = ({
  variant = 'primary',
  items,
  selectedItem,
  setSelectedItem,
  placeholder,
  className,
}: SelectBoxProps) => {
  return (
    <Select
      variant={variant}
      value={selectedItem._id.toString()}
      onChange={(value) => {
        const selected = items.find((item) => item._id.toString() === value);
        if (selected) setSelectedItem(selected);
      }}
    >
      <Select.Trigger className={className}>
        <Select.Value>{selectedItem.name || placeholder}</Select.Value>
      </Select.Trigger>
      <Select.Popover>
        <ListBox>
          {items.map((item) => (
            <ListBox.Item key={item._id} textValue={item._id.toString()}>
              {item.name}
              <ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
    </Select>
  );
};
