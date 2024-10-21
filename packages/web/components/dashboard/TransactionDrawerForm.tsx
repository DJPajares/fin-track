import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { z } from 'zod';
import { useForm, useWatch } from 'react-hook-form';
import moment from 'moment';
import { useAppSelector } from '@/lib/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/lib/utils';

import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@nextui-org/react';
import { CalendarIcon, CheckIcon, ChevronsUpDownIcon } from 'lucide-react';
import { MultiSelectBox } from '@/components/shared/MultiSelectBox';

import fetchTransactionPayments from '@/providers/fetchTransactionPayments';
import { dateStringFormat } from '../../../../shared/constants/dateStringFormat';

import type {
  DashboardDataResult,
  DashboardSelectionItemsProps
} from '@/types/Dashboard';
import type { ListProps } from '@/types/List';

type TransactionDrawerFormProps = {
  type: ListProps;
  categories: DashboardSelectionItemsProps[];
  currencies: DashboardSelectionItemsProps[];
  setDashboardData: Dispatch<SetStateAction<DashboardDataResult>>;
  setIsTransactionDrawerOpen: Dispatch<SetStateAction<boolean>>;
  formRef: any;
};

type FormDataProps = z.infer<typeof formSchema>;

type TransactionProps = {
  name: string;
  category: string;
  currency: string;
  amount: number;
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
  category: z.object({
    _id: z.string().min(1, {
      message: 'Please select a category'
    }),
    name: z.string()
  }),
  // title: z.string({
  //   required_error: 'Please enter a title'
  // }),
  title: z.string().min(1, {
    message: 'Please enter a title'
  }),
  currency: z.object({
    _id: z.string(),
    name: z.string({
      required_error: 'Please select a currency'
    })
  }),
  amount: z.coerce.number({
    required_error: 'Please enter an amount'
  }),
  isRecurring: z.boolean()
  // excludedDates: z
  //   .object({
  //     value: z.string(),
  //     label: z.string()
  //   })
  //   .array()
  //   .optional()
});

const transactionsUrl = 'http://localhost:3001/api/v1/transactions';

const TransactionDrawerForm = ({
  type,
  categories,
  currencies,
  setDashboardData,
  setIsTransactionDrawerOpen,
  formRef
}: TransactionDrawerFormProps) => {
  const [date, setDate] = useState(new Date());
  const [isStartDatePopoverOpen, setIsStartDatePopoverOpen] = useState(false);
  const [isEndDatePopoverOpen, setIsEndDatePopoverOpen] = useState(false);
  const [isCategoryPopoverOpen, setIsCategoryPopoverOpen] = useState(false);
  const [isCurrencyPopoverOpen, setIsCurrencyPopoverOpen] = useState(false);

  const dashboard = useAppSelector((state) => state.dashboard);

  const currency = dashboard.currency;

  useEffect(() => {
    setDate(moment(dashboard.date, dateStringFormat).toDate());
  }, [dashboard]);

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
        setIsTransactionDrawerOpen(false);
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
      category: {
        _id: '',
        name: ''
      },
      title: '',
      currency,
      // amount: 0,
      isRecurring: false
      // excludedDates: []
    }
  });

  // Watch form fields that are used for conditions
  const startDate = useWatch({ control: form.control, name: 'startDate' });
  const endDate = useWatch({ control: form.control, name: 'endDate' });
  const isRecurring = useWatch({ control: form.control, name: 'isRecurring' });
  // const excludedDates = useWatch({
  //   control: form.control,
  //   name: 'excludedDates'
  // });

  // console.log(categories[type._id]);

  useEffect(() => {
    if (startDate && endDate && endDate < startDate) {
      form.setValue('endDate', startDate);
    }

    // handleSettingExcludedDates({ startDate, endDate });
  }, [startDate, endDate, form]);

  // const handleSettingExcludedDates = ({ startDate, endDate }) => {
  //   let excludedDatesArray = [];

  //   if (startDate && endDate) {
  //     const startDateDay1 = setDate(startDate, 1);
  //     const endDateDay1 = setDate(endDate, 1);

  //     const totalMonths = differenceInCalendarMonths(
  //       endDateDay1,
  //       startDateDay1
  //     );

  //     for (let months = 0; months <= totalMonths; months++) {
  //       const date = addMonths(startDateDay1, months);

  //       const data = {
  //         value: date,
  //         label: format(date, 'MMM yyyy')
  //       };

  //       excludedDatesArray.push(data);
  //     }
  //   }

  //   // form.setValue('excludedDates', excludedDatesArray);
  //   // setExcludedDates(excludedDatesArray);
  // };

  const onSubmit = async (values: FormDataProps) => {
    // no states
    const description = '';
    const excludedDates = [] as Date[];

    const transactionData: TransactionProps = {
      name: values.title,
      category: values.category._id,
      currency: values.currency._id,
      amount: values.amount,
      description,
      isRecurring,
      startDate: values.startDate,
      endDate: isRecurring ? values.endDate : values.startDate,
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
        {/* <div className="flex flex-row items-center justify-end">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>{isRecurring ? 'Start date' : 'Date'}</FormLabel>

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

            {isRecurring && (
              <div className="pl-2">
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>End date</FormLabel>

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
          </div> */}

        {/* CATEGORY */}
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Category</FormLabel>

              <Popover
                open={isCategoryPopoverOpen}
                onOpenChange={setIsCategoryPopoverOpen}
              >
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="justify-between w-36"
                    >
                      <p className="truncate hover:text-clip">
                        {field.value.name ? field.value.name : 'Select...'}
                      </p>
                      <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Search category..." />
                    <CommandEmpty>No categories found</CommandEmpty>
                    <CommandGroup>
                      <CommandList>
                        {categories.map((category) => (
                          <CommandItem
                            key={category._id}
                            value={category.name}
                            onSelect={() => {
                              form.setValue('category', category);
                              setIsCategoryPopoverOpen(false);
                            }}
                          >
                            <CheckIcon
                              className={cn(
                                'mr-2 h-4 w-4',
                                field.value.name === category.name
                                  ? 'opacity-100'
                                  : 'opacity-0'
                              )}
                            />
                            {category.name}
                          </CommandItem>
                        ))}
                      </CommandList>
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>

              {/* <FormMessage /> */}
            </FormItem>
          )}
        />

        {/* TITLE */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Title</FormLabel>

              <FormControl>
                <Input placeholder="e.g. Electricity bill" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* AMOUNT */}
        <div className="flex flex-row items-center space-x-2">
          <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Currency</FormLabel>

                <Popover
                  open={isCurrencyPopoverOpen}
                  onOpenChange={setIsCurrencyPopoverOpen}
                >
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="justify-between"
                      >
                        <p className="truncate hover:text-clip">
                          {field.value.name ? field.value.name : 'Currency'}
                        </p>
                        <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput placeholder="Search currency..." />
                      <CommandEmpty>No currencies found</CommandEmpty>
                      <CommandGroup>
                        <CommandList>
                          {currencies.map((currency) => (
                            <CommandItem
                              key={currency._id}
                              value={currency.name}
                              onSelect={() => {
                                // handleCurrencySelection({
                                //   selectedCurrency: currency
                                // })
                                form.setValue('currency', currency);
                                setIsCurrencyPopoverOpen(false);
                              }}
                            >
                              <CheckIcon
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  field.value.name === currency.name
                                    ? 'opacity-100'
                                    : 'opacity-0'
                                )}
                              />
                              {currency.name}
                            </CommandItem>
                          ))}
                        </CommandList>
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Amount</FormLabel>

                <FormControl>
                  <Input
                    type="number"
                    placeholder="0"
                    {...field}
                    value={field.value || ''}
                  />
                </FormControl>

                {/* <FormMessage /> */}
              </FormItem>
            )}
          />
        </div>

        {/* DATES */}
        <div className="flex flex-row items-center space-x-2">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>{isRecurring ? 'Start date' : 'Date'}</FormLabel>

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

          {isRecurring && (
            <div className="pl-2">
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>End date</FormLabel>

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

        <div className="pt-4">
          {/* EXCLUDED DATES */}
          {/* {isRecurring && excludedDates?.length > 0 && (
              <div className="flex flex-col space-y-2">
                <p className="font-medium">Excluded Dates:</p>
                <FormField
                  control={form.control}
                  name="excludedDates"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormControl>
                        <MultiSelectBox dataArray={field.value} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )} */}

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
                      Recurring?
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
