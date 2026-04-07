import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  type SelectTriggerProps,
  SelectValue,
} from '@web/components/ui/select';
import type { ListProps } from '@web/types/List';

export type SelectBoxProps = {
  variant?: SelectTriggerProps['variant'];
  items: ListProps[];
  selectedItem: ListProps;
  setSelectedItem: (item: ListProps) => void;
  placeholder?: string;
  className?: string;
};

export const SelectBox = ({
  variant = 'default',
  items,
  selectedItem,
  setSelectedItem,
  placeholder,
  className,
}: SelectBoxProps) => {
  return (
    <Select
      value={selectedItem._id.toString()}
      onValueChange={(value) => {
        const selected = items.find((item) => item._id.toString() === value);
        if (selected) setSelectedItem(selected);
      }}
    >
      <SelectTrigger variant={variant} className={className}>
        <SelectValue placeholder={placeholder}>{selectedItem.name}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>
            {items.map((item) => (
              <SelectItem key={item._id} value={item._id.toString()}>
                {item.name}
              </SelectItem>
            ))}
          </SelectLabel>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
