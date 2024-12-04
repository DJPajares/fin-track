import { Dispatch, SetStateAction } from 'react';

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
  type SelectTriggerProps
} from '../ui/select';

import type { ListProps } from '../../types/List';

export type SelectBoxProps = {
  variant?: SelectTriggerProps['variant'];
  items: ListProps[];
  selectedItem: ListProps['_id'];
  setSelectedItem: Dispatch<SetStateAction<ListProps['_id']>>;
  placeholder?: string;
  className?: string;
};

export const SelectBox = ({
  variant = 'default',
  items,
  selectedItem,
  setSelectedItem,
  placeholder,
  className
}: SelectBoxProps) => {
  return (
    <Select
      value={selectedItem}
      onValueChange={(value) => {
        setSelectedItem(value);
      }}
    >
      <SelectTrigger variant={variant} className={className}>
        <SelectValue placeholder={placeholder}></SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>
            {items.map((item) => (
              <SelectItem
                key={item._id}
                value={item._id.toString()}
                defaultValue={selectedItem}
              >
                {item.name}
              </SelectItem>
            ))}
          </SelectLabel>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
