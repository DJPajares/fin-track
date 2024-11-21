'use client';

import { DatePicker } from '@/components/shared/DatePicker';
import { Button } from '@/components/ui/button';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import moment from 'moment';
import { useState } from 'react';

const Charts = () => {
  const [date, setDate] = useState(new Date());

  const handlePrevMonth = () => {
    const newDate = moment(date).add(-1, 'months');

    setDate(moment(newDate).toDate());
  };

  const handleNextMonth = () => {
    const newDate = moment(date).add(1, 'months');

    setDate(moment(newDate).toDate());
  };

  return (
    <div className="space-y-4 sm:space-y-8">
      <div className="flex flex-row justify-center items-center">
        <Button variant="ghost" size="icon" onClick={handlePrevMonth}>
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>

        <DatePicker date={date} onChange={setDate}>
          <Button variant="ghost" className="px-0">
            <p className="text-3xl sm:text-5xl font-extrabold sm:font-black hover:underline hover:bg-background">
              {moment(date).format('MMM yyyy')}
            </p>
          </Button>
        </DatePicker>

        <Button variant="ghost" size="icon" onClick={handleNextMonth}>
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Charts;
