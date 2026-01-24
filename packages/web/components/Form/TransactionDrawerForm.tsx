import {
  Dispatch,
  RefObject,
  SetStateAction,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import { addMonths, differenceInCalendarMonths, format } from 'date-fns';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useAppSelector } from '../../lib/hooks/use-redux';
import { cn } from '../../lib/utils';

import { Card, CardBody, Checkbox } from '@heroui/react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { MultiSelectBox } from '../shared/MultiSelectBox';
import ConfirmationDialog from '../shared/ConfirmationDialog';
import CardIcon from '../shared/CardIcon';
import Calendar from '../shared/Calendar';

import { CalendarIcon, ChevronDownIcon, Trash2Icon } from 'lucide-react';

import {
  type TransactionFormProps,
  transactionSchema,
} from '../../lib/schemas/transaction';

import type { ListProps } from '../../types/List';
import type { CategoryItemProps } from '../../types/Category';

type ExcludedDatesProps = {
  value: string;
  label: string;
};

export type SubmitTransactionProps = {
  name: string;
  category: string;
  currency: string;
  amount: string;
  description: string;
  isRecurring: boolean;
  startDate: Date;
  excludedDates: Date[];
  endDate?: Date;
  userId: string;
};

export type TransactionDrawerFormRef = {
  resetForm: () => void;
};

type TransactionDrawerFormProps = {
  type: ListProps;
  typeOptions: ListProps[];
  onTypeChange: (type: ListProps) => void;
  categories: CategoryItemProps[];
  currencies: ListProps[];
  defaultValues?: TransactionFormProps;
  submitTransaction: (data: SubmitTransactionProps) => Promise<void>;
  deleteTransaction?: (id: string) => Promise<void>;
  setIsTransactionDrawerOpen: Dispatch<SetStateAction<boolean>>;
  onStoreFormValues?: (values: TransactionFormProps) => void;
  formRef: RefObject<HTMLFormElement | null>;
  resetFormRef?: RefObject<TransactionDrawerFormRef | null>;
};

const TransactionDrawerForm = ({
  type,
  typeOptions,
  onTypeChange,
  categories,
  currencies,
  defaultValues,
  submitTransaction,
  deleteTransaction,
  onStoreFormValues,
  setIsTransactionDrawerOpen,
  formRef,
  resetFormRef,
}: TransactionDrawerFormProps) => {
  const t = useTranslations();

  const { user } = useAppSelector((state) => state.auth);
  const userId = user?.id || '';

  const [isStartDatePopoverOpen, setIsStartDatePopoverOpen] = useState(false);
  const [isEndDatePopoverOpen, setIsEndDatePopoverOpen] = useState(false);
  const [excludedDatesArray, setExcludedDatesArray] = useState<
    ExcludedDatesProps[]
  >([]);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [formattedAmount, setFormattedAmount] = useState('');

  const resolvedDefaults = useMemo(() => {
    const today = new Date();
    const start = defaultValues?.startDate ?? today;
    const end = defaultValues?.endDate ?? start;
    const currencyFallback =
      defaultValues?.currency || currencies[0]?._id || '';

    return {
      id: defaultValues?.id,
      category: defaultValues?.category ?? '',
      name: defaultValues?.name ?? '',
      currency: currencyFallback,
      amount: defaultValues?.amount ?? 0,
      description: defaultValues?.description ?? '',
      isRecurring: defaultValues?.isRecurring ?? false,
      startDate: start,
      endDate: end,
      excludedDates: defaultValues?.excludedDates ?? [],
    } satisfies TransactionFormProps;
  }, [currencies, defaultValues]);

  const formatAmountDisplay = useCallback((value: number | string) => {
    if (value === null || value === undefined) return '';
    const raw = typeof value === 'number' ? value.toString() : value;
    if (!raw) return '';

    const sanitized = raw.replace(/[^\d.]/g, '');
    if (!sanitized) return '';

    const [whole = '0', decimals] = sanitized.split('.');
    const formattedWhole = Number(whole || '0').toLocaleString('en-US');

    if (decimals !== undefined) {
      const trimmedDecimals = decimals.slice(0, 2);
      const hasTrailingDot = raw.endsWith('.') && trimmedDecimals.length === 0;
      return `${formattedWhole}${hasTrailingDot ? '.' : trimmedDecimals ? `.${trimmedDecimals}` : ''}`;
    }

    return formattedWhole;
  }, []);

  const parseAmountInput = useCallback((raw: string) => {
    const sanitized = raw.replace(/[^\d.]/g, '');
    if (!sanitized) {
      return { display: '', value: 0 };
    }

    const [whole = '0', decimals] = sanitized.split('.');
    const trimmedDecimals = decimals ? decimals.slice(0, 2) : '';
    const numericValue = Number(
      `${whole || '0'}${trimmedDecimals ? `.${trimmedDecimals}` : ''}`,
    );
    const hasTrailingDot = raw.endsWith('.') && trimmedDecimals.length === 0;
    const display = `${Number(whole || '0').toLocaleString('en-US')}${
      hasTrailingDot ? '.' : trimmedDecimals ? `.${trimmedDecimals}` : ''
    }`;

    return { display, value: Number.isNaN(numericValue) ? 0 : numericValue };
  }, []);

  const form = useForm<TransactionFormProps>({
    resolver: zodResolver(transactionSchema),
    defaultValues: resolvedDefaults,
  });

  useImperativeHandle(
    resetFormRef,
    () => ({
      resetForm: () => {
        form.reset(resolvedDefaults);
        setFormattedAmount(
          resolvedDefaults.amount
            ? formatAmountDisplay(resolvedDefaults.amount)
            : '',
        );
        setIsDetailsOpen(false);
      },
    }),
    [form, formatAmountDisplay, resolvedDefaults],
  );

  const startDate = useWatch({ control: form.control, name: 'startDate' });
  const endDate = useWatch({ control: form.control, name: 'endDate' });
  const isRecurring = useWatch({ control: form.control, name: 'isRecurring' });

  useEffect(() => {
    form.reset(resolvedDefaults);
    setFormattedAmount(
      resolvedDefaults.amount
        ? formatAmountDisplay(resolvedDefaults.amount)
        : '',
    );
  }, [form, formatAmountDisplay, resolvedDefaults]);

  useEffect(() => {
    return () => {
      if (onStoreFormValues) {
        const currentValues = form.getValues();
        onStoreFormValues(currentValues);
      }
    };
  }, [form, onStoreFormValues]);

  useEffect(() => {
    if (startDate && endDate && endDate < startDate) {
      form.setValue('endDate', startDate);
    }

    handleSettingExcludedDates({ startDate, endDate });
  }, [startDate, endDate, form]);

  const handleSettingExcludedDates = ({
    startDate,
    endDate,
  }: {
    startDate?: Date;
    endDate?: Date;
  }) => {
    if (!(startDate && endDate)) {
      setExcludedDatesArray([]);
      return;
    }

    const totalMonths = differenceInCalendarMonths(endDate, startDate);
    const nextExcludedDates: ExcludedDatesProps[] = [];

    for (let months = 0; months <= totalMonths; months++) {
      const date = addMonths(startDate, months);

      nextExcludedDates.push({
        value: date.toDateString(),
        label: format(date, 'MMM yyyy'),
      });
    }

    setExcludedDatesArray(nextExcludedDates);
  };

  const onSubmit = async (data: TransactionFormProps) => {
    const excludedDates = data.excludedDates
      ? data.excludedDates.map((date) => new Date(date.value))
      : [];

    const {
      name,
      category,
      currency,
      amount,
      description,
      startDate,
      endDate,
    } = data;

    const transactionData: SubmitTransactionProps = {
      name,
      category,
      currency,
      amount: amount.toString(),
      description: description || '',
      isRecurring,
      startDate,
      endDate: isRecurring ? endDate : startDate,
      excludedDates,
      userId,
    };

    await submitTransaction(transactionData);
  };

  const handleDeleteTransaction = async () => {
    const id = defaultValues?.id;
    if (deleteTransaction && id) {
      await deleteTransaction(id);
      setIsTransactionDrawerOpen(false);
    }
  };

  return (
    <Form {...form}>
      <form
        ref={formRef}
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <Card
          isBlurred
          className="bg-background/60 dark:bg-default-100/50 border-none"
          shadow="sm"
        >
          <CardBody className="flex flex-col gap-4 p-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">
                    {t('Page.dashboard.transactionDrawer.form.title.title')}
                  </FormLabel>

                  <FormControl>
                    <Input
                      placeholder={t(
                        'Page.dashboard.transactionDrawer.form.placeholder.title',
                      )}
                      autoComplete="off"
                      className="h-11 rounded-xl"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">
                    {t('Page.dashboard.transactionDrawer.form.title.currency')}
                  </FormLabel>

                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="h-12 rounded-xl border-2">
                      <SelectValue
                        placeholder={t(
                          'Page.dashboard.transactionDrawer.form.placeholder.currency',
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

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">
                    {t('Page.dashboard.transactionDrawer.form.title.amount')}
                  </FormLabel>

                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      inputMode="decimal"
                      placeholder="0.00"
                      value={formattedAmount}
                      onChange={(e) => {
                        const { display, value } = parseAmountInput(
                          e.target.value,
                        );
                        setFormattedAmount(display);
                        field.onChange(value);
                      }}
                      onBlur={(e) => {
                        const { value } = parseAmountInput(e.target.value);
                        setFormattedAmount(formatAmountDisplay(value));
                        field.onChange(value);
                      }}
                      className="h-14 rounded-xl border-2 text-2xl font-semibold tracking-tight"
                      autoComplete="off"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </CardBody>
        </Card>

        <Card
          isBlurred
          className="bg-background/60 dark:bg-default-100/50 border-none"
          shadow="sm"
        >
          <CardBody className="flex flex-col gap-4 p-5">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                  {t('Page.dashboard.transactionDrawer.form.title.type')}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {typeOptions.map((option) => {
                  const isActive = option._id === type._id;

                  return (
                    <button
                      key={option._id}
                      type="button"
                      onClick={() => onTypeChange(option)}
                      aria-pressed={isActive}
                      className={cn(
                        'flex items-center justify-center rounded-xl border px-3 py-2 text-sm font-semibold transition-colors',
                        isActive
                          ? 'border-primary bg-primary/10 text-primary shadow-sm'
                          : 'border-border/70 bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground',
                      )}
                    >
                      {option.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between gap-2">
              <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                {t('Page.dashboard.transactionDrawer.form.title.category')}
              </p>
              <p className="text-muted-foreground text-xs">
                {t('Page.dashboard.transactionDrawer.form.helper.category')}
              </p>
            </div>

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => {
                const filteredCategories = categories.filter(
                  (category) =>
                    category.type._id === type._id && category.active,
                );

                return (
                  <FormItem className="gap-4">
                    <div className="grid grid-cols-2 gap-2">
                      {filteredCategories.map((category) => {
                        const { _id, id, name, icon } = category;
                        const isTranslated = t.has(`Common.category.${id}`);
                        const label = isTranslated
                          ? t(`Common.category.${id}`)
                          : name;
                        const isSelected = field.value === _id;

                        return (
                          <button
                            key={_id}
                            type="button"
                            onClick={() => field.onChange(_id)}
                            className={cn(
                              'flex items-center gap-3 rounded-xl border px-3 py-2 text-left shadow-xs transition-colors',
                              isSelected
                                ? 'border-primary bg-primary/10 text-foreground'
                                : 'border-border/70 bg-muted/40 text-foreground hover:border-primary/40',
                            )}
                          >
                            <span className="bg-background flex size-10 items-center justify-center rounded-lg shadow-xs">
                              <CardIcon icon={icon} className="size-5" />
                            </span>

                            <span className="text-sm leading-tight font-semibold">
                              {label}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </CardBody>
        </Card>

        <Card
          isBlurred
          className="bg-background/60 dark:bg-default-100/50 border-none"
          shadow="sm"
        >
          <CardBody className="flex flex-col gap-4 p-5">
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
                      {t(
                        'Page.dashboard.transactionDrawer.form.title.isRecurring',
                      )}
                    </Checkbox>
                  </FormControl>
                  <p className="text-muted-foreground text-xs">
                    {t(
                      'Page.dashboard.transactionDrawer.form.helper.isRecurring',
                    )}
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-3">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold">
                      {isRecurring
                        ? t(
                            'Page.dashboard.transactionDrawer.form.title.startDate',
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
                            className="flex h-12 w-full items-center justify-between rounded-xl border-2 text-left font-semibold"
                          >
                            <Label className="font-semibold">
                              {field.value ? (
                                format(field.value, 'MMM dd, yyyy')
                              ) : (
                                <span>
                                  {isRecurring
                                    ? t(
                                        'Page.dashboard.transactionDrawer.form.title.startDate',
                                      )
                                    : t(
                                        'Page.dashboard.transactionDrawer.form.title.date',
                                      )}
                                </span>
                              )}
                            </Label>
                            <CalendarIcon className="ml-auto size-4 opacity-60" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          date={field.value}
                          onChange={field.onChange}
                          closeCalendar={setIsStartDatePopoverOpen}
                        />
                      </PopoverContent>
                    </Popover>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {isRecurring && (
              <div className="grid grid-cols-1 gap-3">
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold">
                        {t(
                          'Page.dashboard.transactionDrawer.form.title.endDate',
                        )}
                      </FormLabel>

                      <Popover
                        open={isEndDatePopoverOpen}
                        onOpenChange={setIsEndDatePopoverOpen}
                      >
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className="flex h-12 w-full items-center justify-between rounded-xl border-2 text-left font-semibold"
                            >
                              <Label className="font-semibold">
                                {field.value ? (
                                  format(field.value, 'MMM dd, yyyy')
                                ) : (
                                  <span>
                                    {t(
                                      'Page.dashboard.transactionDrawer.form.title.endDate',
                                    )}
                                  </span>
                                )}
                              </Label>
                              <CalendarIcon className="ml-auto size-4 opacity-60" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            date={field.value}
                            onChange={field.onChange}
                            closeCalendar={setIsEndDatePopoverOpen}
                          />
                        </PopoverContent>
                      </Popover>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                {excludedDatesArray.length > 1 && (
                  <FormField
                    control={form.control}
                    name="excludedDates"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold">
                          {t(
                            'Page.dashboard.transactionDrawer.form.title.excludedDates',
                          )}
                        </FormLabel>

                        <FormControl>
                          <MultiSelectBox
                            dataArray={excludedDatesArray}
                            value={field.value || []}
                            onChange={field.onChange}
                            placeholder={t(
                              'Page.dashboard.transactionDrawer.form.placeholder.excludedDates',
                            )}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            )}
          </CardBody>
        </Card>

        <Card
          isBlurred
          className="bg-background/60 dark:bg-default-100/50 border-none"
          shadow="sm"
        >
          <CardBody className="flex flex-col gap-4 p-5">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                {isDetailsOpen
                  ? t('Page.dashboard.transactionDrawer.form.title.hideDetails')
                  : t('Page.dashboard.transactionDrawer.form.title.addDetails')}
              </p>

              <Button
                variant="ghost"
                size="icon"
                type="button"
                onClick={() => setIsDetailsOpen((prev) => !prev)}
              >
                <ChevronDownIcon
                  className={cn(
                    'size-4 transition-transform',
                    isDetailsOpen ? 'rotate-180' : 'rotate-0',
                  )}
                />
              </Button>
            </div>

            {isDetailsOpen && (
              <div>
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold">
                        {t(
                          'Page.dashboard.transactionDrawer.form.title.description',
                        )}
                      </FormLabel>
                      <FormControl>
                        <textarea
                          {...field}
                          rows={3}
                          placeholder="Add an optional note"
                          className="border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 min-h-24 w-full rounded-xl border px-3 py-2 text-sm shadow-xs transition outline-none focus-visible:ring-[3px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </CardBody>
        </Card>

        {defaultValues && deleteTransaction && (
          <div className="flex justify-end">
            <ConfirmationDialog handleSubmit={handleDeleteTransaction}>
              <Button
                type="button"
                variant="destructive"
                size="rounded-icon"
                className="rounded-2xl"
              >
                <Trash2Icon className="size-4" />
              </Button>
            </ConfirmationDialog>
          </div>
        )}
      </form>
    </Form>
  );
};

export default TransactionDrawerForm;
