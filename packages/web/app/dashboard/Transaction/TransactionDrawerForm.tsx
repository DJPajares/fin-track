import {
  Dispatch,
  RefObject,
  SetStateAction,
  useEffect,
  useMemo,
  useState
} from 'react';
import axios from 'axios';
import { addMonths, differenceInCalendarMonths, format } from 'date-fns';
import { z } from 'zod';
import { useForm, useWatch } from 'react-hook-form';
import moment from 'moment';
import { useAppSelector } from '../../../lib/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';

import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '../../../components/ui/popover';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../../../components/ui/form';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../../../components/ui/select';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { Calendar } from '../../../components/ui/calendar';
import { Checkbox } from '@nextui-org/react';
import { MultiSelectBox } from '../../../components/shared/MultiSelectBox';

import { CalendarIcon } from 'lucide-react';

import fetchTransactionPayments from '../../../providers/fetchTransactionPayments';

import { dateStringFormat } from '@shared/constants/dateStringFormat';

import type { DashboardDataResult } from '../../../types/Dashboard';
import type { ListProps } from '../../../types/List';
import type { CategoryItemProps } from '../../../types/Category';

type TransactionDrawerFormProps = {
  type: ListProps;
  categories: CategoryItemProps[];
  currencies: ListProps[];
  setDashboardData: Dispatch<SetStateAction<DashboardDataResult>>;
  setIsTransactionDrawerOpen: Dispatch<SetStateAction<boolean>>;
  formRef: RefObject<HTMLFormElement | null>;
};

type ExcludedDatesProps = {
  value: string;
  label: string;
};

type FormDataProps = z.infer<typeof formSchema>;

type TransactionProps = {
  name: string;
  category: string;
  currency: string;
  amount: string;
  description: string;
  isRecurring: boolean;
  startDate: Date;
  excludedDates: Date[];
  endDate?: Date;
};

const formSchema = z.object({
  startDate: z.date({
    required_error: 'Please select a start date.'
  }),
  endDate: z.date(),
  category: z.string().min(1, {
    message: 'Please select a category'
  }),
  title: z.string().min(1, {
    message: 'Please enter a title'
  }),
  currency: z.string().min(1, {
    message: 'Please select a currency'
  }),
  amount: z.coerce.number({
    required_error: 'Please enter an amount'
  }),
  isRecurring: z.boolean(),
  excludedDates: z
    .object({
      value: z.string(),
      label: z.string()
    })
    .array()
    .optional()
});

const transactionsUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/transactions`;

const TransactionDrawerForm = ({
  type,
  categories,
  currencies,
  setDashboardData,
  setIsTransactionDrawerOpen,
  formRef
}: TransactionDrawerFormProps) => {
  const t = useTranslations();
  const dashboard = useAppSelector((state) => state.dashboard);

  const currency = dashboard.currency;

  const date = useMemo(() => {
    const convertedDate = moment(dashboard.date, dateStringFormat).toDate();

    return convertedDate;
  }, [dashboard.date]);

  const [isStartDatePopoverOpen, setIsStartDatePopoverOpen] = useState(false);
  const [isEndDatePopoverOpen, setIsEndDatePopoverOpen] = useState(false);
  const [excludedDatesArray, setExcludedDatesArray] = useState<
    ExcludedDatesProps[]
  >([]);

  const createTransaction = async (transactionData: TransactionProps) => {
    try {
      const { status, data } = await axios.post(
        transactionsUrl,
        transactionData
      );

      if (status === 200) {
        const result = await fetchTransactionPayments({
          date,
          currency: currency.name
        });

        setDashboardData(result);
        // setIsTransactionDrawerOpen(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const form = useForm<FormDataProps>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startDate: date,
      endDate: date,
      category: '',
      title: '',
      currency: currency._id,
      // amount: 0,
      isRecurring: false,
      excludedDates: []
    }
  });

  const startDate = useWatch({ control: form.control, name: 'startDate' });
  const endDate = useWatch({ control: form.control, name: 'endDate' });
  const isRecurring = useWatch({ control: form.control, name: 'isRecurring' });

  useEffect(() => {
    if (startDate && endDate && endDate < startDate) {
      form.setValue('endDate', startDate);
    }

    handleSettingExcludedDates({ startDate, endDate });
  }, [startDate, endDate, form]);

  const handleSettingExcludedDates = ({
    startDate,
    endDate
  }: {
    startDate: Date;
    endDate: Date;
  }) => {
    let excludedDatesArray = [];

    if (startDate && endDate) {
      const totalMonths = differenceInCalendarMonths(endDate, startDate);

      for (let months = 0; months <= totalMonths; months++) {
        const date = addMonths(startDate, months);

        const data = {
          value: date.toDateString(),
          label: format(date, 'MMM yyyy')
        };

        excludedDatesArray.push(data);
      }

      setExcludedDatesArray(excludedDatesArray);
    }
  };

  const onSubmit = async (data: FormDataProps) => {
    // no states
    const description = '';

    const excludedDates = data.excludedDates
      ? data.excludedDates.map((date) => new Date(date.value))
      : [];

    const transactionData: TransactionProps = {
      name: data.title,
      category: data.category,
      currency: data.currency,
      amount: data.amount.toString(),
      description,
      isRecurring,
      startDate: data.startDate,
      endDate: isRecurring ? data.endDate : data.startDate,
      excludedDates
    };

    await createTransaction(transactionData);
  };

  return (
    <Form {...form}>
      <form
        ref={formRef}
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        {/* CATEGORY */}
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>
                {t('Page.dashboard.transactionDrawer.form.title.category')}
              </FormLabel>

              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue
                    placeholder={t(
                      'Page.dashboard.transactionDrawer.form.placeholder.category'
                    )}
                  />
                </SelectTrigger>

                <SelectContent>
                  <SelectGroup>
                    {categories
                      .filter(
                        (category) =>
                          category.type._id === type._id && category.active
                      )
                      .map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                          {category.name}
                        </SelectItem>
                      ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* TITLE */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>
                {t('Page.dashboard.transactionDrawer.form.title.title')}
              </FormLabel>

              <FormControl>
                <Input
                  placeholder={t(
                    'Page.dashboard.transactionDrawer.form.placeholder.title'
                  )}
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* AMOUNT */}
        <div className="flex flex-row items-center space-x-2">
          <div>
            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>
                    {t('Page.dashboard.transactionDrawer.form.title.currency')}
                  </FormLabel>

                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t(
                          'Page.dashboard.transactionDrawer.form.placeholder.currency'
                        )}
                      />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectGroup>
                        {currencies.map((currency) => (
                          <SelectItem key={currency._id} value={currency._id}>
                            {currency.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex-1">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>
                    {t('Page.dashboard.transactionDrawer.form.title.amount')}
                  </FormLabel>

                  <FormControl>
                    {/* <Input
                      type="number"
                      inputMode="decimal"
                      placeholder="0"
                      {...field}
                      value={field.value || ''}
                    /> */}
                    <Input
                      type="number"
                      inputMode="decimal"
                      placeholder="0"
                      {...field}
                      value={field.value || ''}
                      onChange={field.onChange}
                      autoComplete="false"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* DATES */}
        <div className="flex flex-row space-x-2">
          <div className="flex-1">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>
                    {isRecurring
                      ? t(
                          'Page.dashboard.transactionDrawer.form.title.startDate'
                        )
                      : t('Page.dashboard.transactionDrawer.form.title.date')}
                  </FormLabel>

                  <Popover
                    open={isStartDatePopoverOpen}
                    onOpenChange={setIsStartDatePopoverOpen}
                  >
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className="text-left font-normal"
                        >
                          <p className="pr-2">
                            {field.value ? (
                              format(field.value, 'MMM yyyy')
                            ) : (
                              <span>{isRecurring ? 'Start date' : 'Date'}</span>
                            )}
                          </p>
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        defaultMonth={field.value}
                        selected={field.value}
                        onSelect={(date) => {
                          field.onChange(date);
                          setIsStartDatePopoverOpen(false);
                        }}
                      />
                    </PopoverContent>
                  </Popover>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {isRecurring && (
            <div className="flex-1">
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>
                      {t('Page.dashboard.transactionDrawer.form.title.endDate')}
                    </FormLabel>

                    <Popover
                      open={isEndDatePopoverOpen}
                      onOpenChange={setIsEndDatePopoverOpen}
                    >
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className="text-left font-normal"
                          >
                            <p className="pr-2">
                              {field.value ? (
                                format(field.value, 'MMM yyyy')
                              ) : (
                                <span>End date</span>
                              )}
                            </p>
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          defaultMonth={field.value}
                          selected={field.value}
                          onSelect={(date) => {
                            field.onChange(date);
                            setIsEndDatePopoverOpen(false);
                          }}
                          disabled={(date) =>
                            startDate ? date < startDate : false
                          }
                        />
                      </PopoverContent>
                    </Popover>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </div>

        <div>
          {/* EXCLUDED DATES */}
          {isRecurring && excludedDatesArray.length > 1 && (
            <FormField
              control={form.control}
              name="excludedDates"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>
                    {t(
                      'Page.dashboard.transactionDrawer.form.title.excludedDates'
                    )}
                  </FormLabel>

                  <FormControl>
                    <MultiSelectBox
                      dataArray={excludedDatesArray}
                      value={field.value || []}
                      onChange={field.onChange}
                      placeholder={t(
                        'Page.dashboard.transactionDrawer.form.placeholder.excludedDates'
                      )}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* RECURRING */}
          <div className="flex flex-row items-center justify-start">
            <FormField
              control={form.control}
              name="isRecurring"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormControl>
                    <Checkbox
                      isSelected={field.value}
                      onValueChange={field.onChange}
                    >
                      {t(
                        'Page.dashboard.transactionDrawer.form.title.isRecurring'
                      )}
                    </Checkbox>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </form>
    </Form>
  );
};

export default TransactionDrawerForm;
