import type { ListProps } from '@shared/types/List';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@web/components/ui/select';
import { cn } from '@web/lib/utils';

export type SelectBoxProps = {
  variant?: 'default' | 'ghost';
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
  const triggerClassName = cn(
    variant === 'ghost' &&
      'hover:bg-accent hover:text-accent-foreground border-transparent bg-transparent shadow-none focus-visible:ring-ring/50 dark:bg-transparent dark:hover:bg-accent',
    className,
  );

  return (
    <Select
      value={selectedItem._id.toString()}
      onValueChange={(value) => {
        const selected = items.find((item) => item._id.toString() === value);
        if (selected) setSelectedItem(selected);
      }}
    >
      <SelectTrigger className={triggerClassName}>
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
