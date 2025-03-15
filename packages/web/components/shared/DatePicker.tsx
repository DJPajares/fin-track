import { ReactNode, useState } from 'react';
import { useTranslations } from 'next-intl';
import moment from 'moment';

import {
  Button,
  ButtonGroup,
  Calendar,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@heroui/react';

import {
  CalendarDate,
  getLocalTimeZone,
  parseDate,
} from '@internationalized/date';

type DatePickerProps = {
  date: Date;
  onChange: (arg0: Date) => void;
  children: ReactNode;
};

export const DatePicker = ({ date, onChange, children }: DatePickerProps) => {
  const t = useTranslations();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleOnChange = (date: Date | undefined) => {
    if (date) {
      onChange(date);
      setIsCalendarOpen(false);
    }
  };

  return (
    <Popover isOpen={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent className="space-y-4 p-0">
        <Calendar
          aria-label="Date (Uncontrolled)"
          value={parseDate(moment(date).format('yyyy-MM-DD'))}
          onChange={(date: CalendarDate) =>
            handleOnChange(date.toDate(getLocalTimeZone()))
          }
          topContent={
            <ButtonGroup
              fullWidth
              className="bg-content1 [&>button]:text-default-500 [&>button]:border-default-200/60 px-3 pb-2 pt-3"
              radius="full"
              size="sm"
              variant="bordered"
            >
              <Button
                onPress={() =>
                  handleOnChange(
                    moment(new Date()).subtract(1, 'years').toDate(),
                  )
                }
              >
                <p className="truncate">{t('Common.datePicker.prevYear')}</p>
              </Button>
              <Button onPress={() => handleOnChange(new Date())}>
                <p className="truncate">{t('Common.datePicker.today')}</p>
              </Button>
              <Button
                onPress={() =>
                  handleOnChange(moment(new Date()).add(1, 'years').toDate())
                }
              >
                <p className="truncate">{t('Common.datePicker.nextYear')}</p>
              </Button>
            </ButtonGroup>
          }
          showMonthAndYearPickers
        />
      </PopoverContent>
    </Popover>
  );
};
