import { useTranslations } from 'next-intl';
import moment from 'moment';

import { Button, ButtonGroup, Calendar as CalendarHeroUI } from '@heroui/react';

import {
  CalendarDate,
  getLocalTimeZone,
  parseDate,
} from '@internationalized/date';

type CalendarProps = {
  date: Date;
  onChange: (arg0: Date) => void;
  closeCalendar?: (arg0: boolean) => void;
};

export default function Calendar({
  date,
  onChange,
  closeCalendar,
}: CalendarProps) {
  const t = useTranslations();

  const handleOnChange = (date: Date | undefined) => {
    if (date) {
      onChange(date);
      closeCalendar?.(false);
    }
  };

  return (
    <CalendarHeroUI
      aria-label="Date (Uncontrolled)"
      value={parseDate(moment(date).format('yyyy-MM-DD'))}
      onChange={(date: CalendarDate) =>
        handleOnChange(date.toDate(getLocalTimeZone()))
      }
      topContent={
        <ButtonGroup
          fullWidth
          className="bg-content1 [&>button]:text-default-500 [&>button]:border-default-200/60 px-3 pt-3 pb-2"
          radius="full"
          size="sm"
          variant="bordered"
        >
          <Button
            onPress={() =>
              handleOnChange(moment(date).subtract(1, 'years').toDate())
            }
          >
            <p className="truncate">
              {`< ${moment(date).subtract(1, 'years').format('YYYY')}`}
            </p>
          </Button>
          <Button onPress={() => handleOnChange(new Date())}>
            <p className="truncate">{t('Common.datePicker.today')}</p>
          </Button>
          <Button
            onPress={() =>
              handleOnChange(moment(date).add(1, 'years').toDate())
            }
          >
            <p className="truncate">
              {`${moment(date).add(1, 'years').format('YYYY')} >`}
            </p>
          </Button>
        </ButtonGroup>
      }
      showMonthAndYearPickers
    />
  );
}
