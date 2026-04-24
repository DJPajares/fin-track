import { fireEvent, render, screen } from '@testing-library/react';
import { addMonths, addYears, subYears } from 'date-fns';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import CustomCalendar from './Calendar';

const { calendarMock, mockSelectedDate } = vi.hoisted(() => ({
  calendarMock: vi.fn(),
  mockSelectedDate: new Date(2027, 0, 15),
}));

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string, values?: { count?: number }) => {
    if (key === 'Common.datePicker.today') {
      return 'Today';
    }

    if (key === 'Common.datePicker.inMonths') {
      return `+${values?.count} months`;
    }

    return key;
  },
}));

vi.mock('@web/components/ui/button', () => ({
  Button: ({
    children,
    ...props
  }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button {...props}>{children}</button>
  ),
}));

vi.mock('@web/components/ui/card', () => ({
  Card: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div {...props}>{children}</div>
  ),
  CardContent: ({
    children,
    ...props
  }: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>,
  CardFooter: ({
    children,
    ...props
  }: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>,
}));

vi.mock('@web/components/ui/calendar', () => ({
  Calendar: (props: {
    onSelect?: (date: Date | undefined) => void;
    captionLayout?: string;
    defaultMonth?: Date;
    startMonth?: Date;
    endMonth?: Date;
    selected?: Date;
    fixedWeeks?: boolean;
    className?: string;
  }) => {
    calendarMock(props);

    return (
      <div data-testid="calendar">
        <button onClick={() => props.onSelect?.(undefined)} type="button">
          select undefined
        </button>
        <button
          onClick={() => props.onSelect?.(mockSelectedDate)}
          type="button"
        >
          select date
        </button>
      </div>
    );
  },
}));

describe('CustomCalendar', () => {
  const selectedDate = new Date(2026, 9, 10);

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 3, 24, 12, 0, 0));
    calendarMock.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('passes date-driven calendar props for dropdown navigation and selected month', () => {
    render(<CustomCalendar date={selectedDate} onChange={vi.fn()} />);

    expect(calendarMock).toHaveBeenCalledOnce();

    const props = calendarMock.mock.calls[0]?.[0];
    expect(props).toMatchObject({
      captionLayout: 'dropdown',
      defaultMonth: selectedDate,
      selected: selectedDate,
      fixedWeeks: true,
      className: 'p-0 [--cell-size:--spacing(9.5)]',
    });
    expect(props.startMonth).toEqual(new Date(2016, 0, 1));
    expect(props.endMonth).toEqual(new Date(2036, 11, 31));
  });

  it('renders translated month presets and year shortcuts', () => {
    render(<CustomCalendar date={selectedDate} onChange={vi.fn()} />);

    expect(screen.getByRole('button', { name: '2025' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Today' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '2027' })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: '+2 months' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: '+6 months' }),
    ).toBeInTheDocument();
  });

  it('uses the selected date as the anchor for year and month shortcut buttons', async () => {
    const onChange = vi.fn();
    const closeCalendar = vi.fn();

    render(
      <CustomCalendar
        date={selectedDate}
        onChange={onChange}
        closeCalendar={closeCalendar}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: '2025' }));
    expect(onChange).toHaveBeenLastCalledWith(subYears(selectedDate, 1));

    fireEvent.click(screen.getByRole('button', { name: '2027' }));
    expect(onChange).toHaveBeenLastCalledWith(addYears(selectedDate, 1));

    fireEvent.click(screen.getByRole('button', { name: '+2 months' }));
    expect(onChange).toHaveBeenLastCalledWith(addMonths(selectedDate, 2));

    fireEvent.click(screen.getByRole('button', { name: '+6 months' }));
    expect(onChange).toHaveBeenLastCalledWith(addMonths(selectedDate, 6));

    expect(closeCalendar).toHaveBeenCalledTimes(4);
    expect(closeCalendar).toHaveBeenNthCalledWith(1, false);
  });

  it('uses the current system date for the Today shortcut', async () => {
    const onChange = vi.fn();
    const closeCalendar = vi.fn();

    render(
      <CustomCalendar
        date={selectedDate}
        onChange={onChange}
        closeCalendar={closeCalendar}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Today' }));

    expect(onChange).toHaveBeenCalledWith(new Date(2026, 3, 24, 12, 0, 0));
    expect(closeCalendar).toHaveBeenCalledWith(false);
  });

  it('ignores undefined calendar selections', async () => {
    const onChange = vi.fn();
    const closeCalendar = vi.fn();

    render(
      <CustomCalendar
        date={selectedDate}
        onChange={onChange}
        closeCalendar={closeCalendar}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'select undefined' }));

    expect(onChange).not.toHaveBeenCalled();
    expect(closeCalendar).not.toHaveBeenCalled();
  });

  it('forwards valid calendar selections and tolerates a missing close handler', async () => {
    const onChange = vi.fn();

    render(<CustomCalendar date={selectedDate} onChange={onChange} />);

    fireEvent.click(screen.getByRole('button', { name: 'select date' }));

    expect(onChange).toHaveBeenCalledOnce();
    expect(onChange).toHaveBeenCalledWith(mockSelectedDate);
  });
});
