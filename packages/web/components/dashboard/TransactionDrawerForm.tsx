import { useEffect, useState } from 'react';
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
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@nextui-org/checkbox';
import { CalendarIcon, CheckIcon, ChevronsUpDownIcon } from 'lucide-react';
import {
  addMonths,
  differenceInCalendarMonths,
  format,
  setDate
} from 'date-fns';
import { MultiSelectBox } from '@/components/shared/MultiSelectBox';
import { z } from 'zod';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/lib/utils';
import type { DashboardSelectionItemsProps } from '../../../../shared/types/dashboardTypes';
import axios from 'axios';
import type { TransactionProps } from '../../../api/src/models/v1/transactionModel';
import type { TypeProps } from '../../../api/src/models/v1/typeModel';

type TransactionDrawerFormProps = {
  type: TypeProps;
  categories: DashboardSelectionItemsProps[];
  currencies: DashboardSelectionItemsProps[];
  currency: DashboardSelectionItemsProps;
  formRef: any;
};

type FormDataProps = z.infer<typeof formSchema>;

const formSchema = z.object({
  startDate: z.date(),
  endDate: z.date(),
  category: z.object({
    _id: z.string(),
    name: z.string()
  }),
  title: z.string(),
  currency: z.object({
    _id: z.string(),
    name: z.string()
  }),
  amount: z.number(),
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

const createTransaction = async (transactionData: TransactionProps) => {
  try {
    const { status, data } = await axios.post(transactionsUrl, transactionData);

    if (status === 200) return data.data;
  } catch (error) {
    console.error(error);
  }
};

const TransactionDrawerForm = ({
  type,
  categories,
  currencies,
  currency,
  formRef
}: TransactionDrawerFormProps) => {
  const [isStartDatePopoverOpen, setIsStartDatePopoverOpen] = useState(false);
  const [isEndDatePopoverOpen, setIsEndDatePopoverOpen] = useState(false);
  const [isCategoryPopoverOpen, setIsCategoryPopoverOpen] = useState(false);
  const [isCurrencyPopoverOpen, setIsCurrencyPopoverOpen] = useState(false);

  const form = useForm<FormDataProps>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startDate: new Date(),
      endDate: new Date(),
      category: {},
      title: '',
      currency,
      amount: 0,
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
  }, [startDate, endDate]);

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

    const transactionData = {
      name: values.title,
      category: values.category._id,
      currency: values.currency._id,
      amount: values.amount ? values.amount : undefined,
      description,
      isRecurring,
      startDate: values.startDate,
      endDate: isRecurring ? values.endDate : undefined,
      excludedDates
    };

    console.log(transactionData);
    // const result = await createTransaction(transactionData);

    // console.log(values);
  };

  return (
    <Form {...form}>
      <form
        ref={formRef}
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
      >
        <div className="flex flex-row items-center justify-end">
          {/* START DATE */}
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
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
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* END DATE */}
          {isRecurring && (
            <div className="pl-2">
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
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
                          initialFocus
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

        <div className="space-y-2">
          <div className="flex flex-row items-center space-x-2">
            {/* CATEGORY */}
            <div>
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <Popover
                      open={isCategoryPopoverOpen}
                      onOpenChange={setIsCategoryPopoverOpen}
                    >
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className="flex flex-row items-center justify-between w-36"
                          >
                            <p className="truncate hover:text-clip">
                              {field.value.name ? field.value.name : 'Category'}
                            </p>
                            <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        <Command>
                          <CommandInput
                            placeholder="Search category..."
                            // className="h-9"
                          />
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

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* TITLE */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-row items-center space-x-2">
            {/* CURRENCY */}
            <div>
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <Popover
                      open={isCurrencyPopoverOpen}
                      onOpenChange={setIsCurrencyPopoverOpen}
                    >
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className="flex flex-row items-center justify-between w-36"
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
                          <CommandInput
                            placeholder="Search currency..."
                            // className="h-9"
                          />
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
            </div>

            {/* AMOUNT */}
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Amount"
                      {...field}
                      value={field.value || ''}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === ''
                            ? ''
                            : // : parseFloat(e.target.value)
                              e.target.valueAsNumber
                        )
                      }
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-4">
          {/* EXCLUDED DATES */}
          {/* {isRecurring && excludedDates?.length > 0 && (
            <div className="flex flex-col space-y-2">
              <p className="font-medium">Excluded Dates:</p>
              <FormField
                control={form.control}
                name="excludedDates"
                render={({ field }) => (
                  <FormItem>
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
                <FormItem>
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
