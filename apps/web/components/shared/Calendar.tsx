import { Button } from '@web/components/ui/button';
import { Calendar } from '@web/components/ui/calendar';
import { Card, CardContent, CardFooter } from '@web/components/ui/card';
import { addMonths, addYears, subYears } from 'date-fns';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

type CalendarProps = {
  date: Date;
  onChange: (arg0: Date) => void;
  closeCalendar?: (arg0: boolean) => void;
};

export default function CustomCalendar({
  date,
  onChange,
  closeCalendar,
}: CalendarProps) {
  const t = useTranslations();
  const currentYear = date.getFullYear();
  const startMonth = new Date(currentYear - 10, 0, 1);
  const endMonth = new Date(currentYear + 10, 11, 31);

  const presets = [
    {
      label: `${currentYear - 1}`,
      icon: <ChevronLeftIcon className="size-4" />,
      iconPosition: 'left',
      getDate: () => subYears(date, 1),
    },
    {
      label: t('Common.datePicker.today'),
      getDate: () => new Date(),
    },
    {
      label: `${currentYear + 1}`,
      icon: <ChevronRightIcon className="size-4" />,
      iconPosition: 'right',
      getDate: () => addYears(date, 1),
    },
    {
      label: t('Common.datePicker.inMonths', { count: 2 }),
      getDate: () => addMonths(date, 2),
    },
    {
      label: t('Common.datePicker.inMonths', { count: 6 }),
      getDate: () => addMonths(date, 6),
    },
  ];

  const handleOnChange = (date: Date | undefined) => {
    if (date) {
      onChange(date);
      closeCalendar?.(false);
    }
  };

  return (
    <Card className="mx-auto w-fit max-w-75" size="sm">
      <CardContent>
        <Calendar
          mode="single"
          captionLayout="dropdown"
          defaultMonth={date}
          startMonth={startMonth}
          endMonth={endMonth}
          selected={date}
          onSelect={handleOnChange}
          fixedWeeks
          className="p-0 [--cell-size:--spacing(9.5)]"
        />
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2 border-t">
        {presets.map((preset) => (
          <Button
            key={preset.label}
            variant="outline"
            size="sm"
            className="flex-1 gap-1"
            onClick={() => {
              const newDate = preset.getDate();
              handleOnChange(newDate);
            }}
          >
            {preset.iconPosition === 'left' && preset.icon}
            {preset.label}
            {preset.iconPosition === 'right' && preset.icon}
          </Button>
        ))}
      </CardFooter>
    </Card>
  );
}
