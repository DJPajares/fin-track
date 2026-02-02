import { ReactNode, useState } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@web/components/ui/popover';
import Calendar from '@web/components/shared/Calendar';

type DatePickerProps = {
  date: Date;
  onChange: (arg0: Date) => void;
  children: ReactNode;
};

export const DatePicker = ({ date, onChange, children }: DatePickerProps) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleDateChange = (selectedDate: Date) => {
    onChange(selectedDate);
    setIsCalendarOpen(false);
  };

  return (
    <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        className="w-auto border-0 bg-transparent p-0 shadow-none"
        align="center"
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
      >
        <Calendar
          date={date}
          onChange={handleDateChange}
          closeCalendar={setIsCalendarOpen}
        />
      </PopoverContent>
    </Popover>
  );
};
