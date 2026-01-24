import { ReactNode, useState } from 'react';

import { Popover, PopoverContent, PopoverTrigger } from '@heroui/react';

import Calendar from '@web/components/shared/Calendar';

type DatePickerProps = {
  date: Date;
  onChange: (arg0: Date) => void;
  children: ReactNode;
};

export const DatePicker = ({ date, onChange, children }: DatePickerProps) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  return (
    <Popover isOpen={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent className="space-y-4 p-0">
        <Calendar date={date} onChange={onChange} />
      </PopoverContent>
    </Popover>
  );
};
