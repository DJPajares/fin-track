import {
  Popover,
  PopoverTrigger,
  PopoverContent
} from '../../components/ui/popover';
import { Calendar } from '../../components/ui/calendar';
import { ReactNode, useState } from 'react';
import { Button } from '../ui/button';

type DatePickerProps = {
  date: Date;
  onChange: (arg0: Date) => void;
  children: ReactNode;
};

export const DatePicker = ({ date, onChange, children }: DatePickerProps) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleOnChange = (date: Date | undefined) => {
    if (date) {
      onChange(date);
      setIsCalendarOpen(false);
    }
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
        <div className="flex flex-col mx-4 mb-4">
          <Button variant="default" onClick={() => handleOnChange(new Date())}>
            Today
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
