'use client';

import { KeyboardEvent, useCallback, useRef, useState } from 'react';
import { Badge } from '../../components/ui/badge';
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList
} from '../../components/ui/command';
import { Command as CommandPrimitive } from 'cmdk';
import { X } from 'lucide-react';

type MultiSelectBoxDataProps = {
  value: string;
  label: string;
};

type MultiSelectBoxProps = {
  dataArray: MultiSelectBoxDataProps[];
  value: MultiSelectBoxDataProps[];
  onChange: (value: MultiSelectBoxDataProps[]) => void;
  placeholder?: string;
};

const MultiSelectBox = ({
  dataArray,
  value,
  onChange,
  placeholder = 'Select options...'
}: MultiSelectBoxProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const handleUnselect = useCallback(
    (data: MultiSelectBoxDataProps) => {
      const newSelected = value.filter((s) => s.value !== data.value);
      onChange(newSelected);
    },
    [value, onChange]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (input) {
        if (e.key === 'Delete' || e.key === 'Backspace') {
          if (input.value === '') {
            const newSelected = [...value];
            newSelected.pop();
            onChange(newSelected);
          }
        }
        if (e.key === 'Escape') {
          input.blur();
        }
      }
    },
    [value, onChange]
  );

  const selectables = dataArray.filter(
    (data) => !value.some((selected) => selected.value === data.value)
  );

  return (
    <Command
      onKeyDown={handleKeyDown}
      className="overflow-visible bg-transparent"
    >
      <div className="group rounded-md border border-input px-3 py-2 text-base ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <div className="flex flex-wrap gap-1">
          {value.map((data, index) => (
            <Badge key={index} variant="secondary">
              {data.label}
              <button
                className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleUnselect(data);
                  }
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onClick={() => handleUnselect(data)}
              >
                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
              </button>
            </Badge>
          ))}
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder={placeholder}
            className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>
      <div className="relative mt-2">
        <CommandList>
          {open && selectables.length > 0 && (
            <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
              <CommandGroup className="max-h-36 overflow-auto">
                {selectables.map((data, index) => (
                  <CommandItem
                    key={index}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onSelect={() => {
                      setInputValue('');
                      onChange([...value, data]);
                    }}
                    className="cursor-pointer"
                  >
                    {data.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </div>
          )}
        </CommandList>
      </div>
    </Command>
  );
};

export { MultiSelectBox };
