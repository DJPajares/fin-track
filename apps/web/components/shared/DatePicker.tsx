import { Popover, PopoverContent, PopoverTrigger } from '@heroui/react';
import Calendar from '@web/components/shared/Calendar';
import { ReactNode, useState } from 'react';

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
    <Popover isOpen={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent
        className="w-auto border-0 bg-transparent p-0 shadow-none"
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
