import {
  Popover,
  PopoverTrigger,
  PopoverContent
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { ReactNode, useState } from 'react';

type DatePickerProps = {
  date: Date;
  onChange: (arg0: string) => void;
  children: ReactNode;
};

export const DatePicker = ({ date, onChange, children }: DatePickerProps) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleOnChange = (date: string) => {
    onChange(date);
    setIsCalendarOpen(false);
  };

  return (
    <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          defaultMonth={date}
          selected={date}
          onSelect={(date) => handleOnChange(date)}
        />
      </PopoverContent>
    </Popover>
  );
};
