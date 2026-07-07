import { zodResolver } from '@hookform/resolvers/zod';
import { excludedDateStringFormat } from '@shared/constants/dateStringFormat';
import type { ListProps } from '@shared/types/List';
import { toSelectItems } from '@shared/utilities/toSelectItem';
import CardButton from '@web/components/shared/CardButton';
import type { IconProps } from '@web/components/shared/CardIcon';
import ConfirmationDialog from '@web/components/shared/ConfirmationDialog';
import { DatePicker } from '@web/components/shared/DatePicker';
import {
  TypographyCaption,
  TypographyLabel,
} from '@web/components/shared/Typography';
import { Button } from '@web/components/ui/button';
import { Card, CardContent } from '@web/components/ui/card';
import { Checkbox } from '@web/components/ui/checkbox';
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from '@web/components/ui/combobox';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@web/components/ui/field';
import { Input } from '@web/components/ui/input';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@web/components/ui/input-group';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@web/components/ui/select';
import { Textarea } from '@web/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@web/components/ui/tooltip';
import { useAppSelector } from '@web/lib/hooks/use-redux';
import {
  type TransactionFormProps,
  transactionSchema,
} from '@web/lib/schemas/transaction';
import { cn } from '@web/lib/utils';
import type { CategoryItemProps } from '@web/types/Category';
import {
  CalendarIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  Trash2Icon,
  XIcon,
} from 'lucide-react';
import moment from 'moment';
import { useTranslations } from 'next-intl';
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
import { Controller, type Resolver, useForm, useWatch } from 'react-hook-form';

type ExcludedDatesProps = {
  _id: string;
  name: string;
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
  onValidationError?: () => void;
  formRef: RefObject<HTMLFormElement | null>;
  resetFormRef?: RefObject<TransactionDrawerFormRef | null>;
};

const CATEGORY_PREVIEW_LIMIT = 8;

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
  onValidationError,
  setIsTransactionDrawerOpen,
  formRef,
  resetFormRef,
}: TransactionDrawerFormProps) => {
  const t = useTranslations();
  const anchor = useComboboxAnchor();

  const { user } = useAppSelector((state) => state.auth);
  const userId = user?.id || '';

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

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [formattedAmount, setFormattedAmount] = useState(() =>
    resolvedDefaults.amount ? formatAmountDisplay(resolvedDefaults.amount) : '',
  );
  const [isShowingAllCategories, setIsShowingAllCategories] = useState(false);

  const form = useForm<TransactionFormProps>({
    resolver: (
      zodResolver as unknown as (
        schema: typeof transactionSchema,
      ) => Resolver<TransactionFormProps>
    )(transactionSchema),
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
    return () => {
      if (onStoreFormValues) {
        const currentValues = form.getValues();
        onStoreFormValues(currentValues);
      }
    };
  }, [form, onStoreFormValues]);

  const excludedDatesArray = useMemo(() => {
    if (!(startDate && endDate)) {
      return [] as ExcludedDatesProps[];
    }

    const totalMonths = moment(endDate)
      .startOf('month')
      .diff(moment(startDate).startOf('month'), 'months');

    return Array.from({ length: totalMonths + 1 }, (_, monthOffset) => {
      const date = moment(startDate).add(monthOffset, 'months').toDate();

      return {
        _id: date.toDateString(),
        name: moment(date).format(excludedDateStringFormat),
      };
    });
  }, [endDate, startDate]);

  useEffect(() => {
    if (startDate && endDate && endDate < startDate) {
      form.setValue('endDate', startDate);
    }
  }, [startDate, endDate, form]);

  const onSubmit = async (data: TransactionFormProps) => {
    try {
      const excludedDates = data.excludedDates
        ? data.excludedDates.map((date) => new Date(date._id))
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

      // Reset form after successful submission
      form.reset(resolvedDefaults);
      setFormattedAmount(
        resolvedDefaults.amount
          ? formatAmountDisplay(resolvedDefaults.amount)
          : '',
      );
      setIsDetailsOpen(false);
    } catch (error) {
      console.error('Error submitting transaction:', error);
      throw error;
    }
  };

  const onInvalidSubmit = () => {
    // This is called when form validation fails
    // Notify parent so it can reset loading state
    onValidationError?.();
  };

  const handleDeleteTransaction = async () => {
    const id = defaultValues?.id;
    if (deleteTransaction && id) {
      await deleteTransaction(id);
      setIsTransactionDrawerOpen(false);
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={form.handleSubmit(onSubmit, onInvalidSubmit)}
      className="flex flex-col gap-4"
    >
      <Card>
        <CardContent>
          <FieldGroup>
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel
                    htmlFor="form-name"
                    className="text-sm font-semibold"
                  >
                    {t('Page.dashboard.transactionDrawer.form.title.title')}
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-name"
                    aria-invalid={fieldState.invalid}
                    placeholder={t(
                      'Page.dashboard.transactionDrawer.form.placeholder.title',
                    )}
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="currency"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel
                    htmlFor="form-currency"
                    className="text-sm font-semibold"
                  >
                    {t('Page.dashboard.transactionDrawer.form.title.currency')}
                  </FieldLabel>
                  <Select
                    items={toSelectItems(currencies)}
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      id="form-currency"
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue
                        placeholder={t(
                          'Page.dashboard.transactionDrawer.form.placeholder.currency',
                        )}
                        aria-invalid={fieldState.invalid}
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
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="amount"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel
                    htmlFor="form-amount"
                    className="text-sm font-semibold"
                  >
                    {t('Page.dashboard.transactionDrawer.form.title.amount')}
                  </FieldLabel>
                  <InputGroup className="h-14">
                    <InputGroupInput
                      {...field}
                      id="form-amount"
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
                      autoComplete="off"
                      className="text-2xl font-semibold tracking-tight md:text-2xl"
                    />
                    <InputGroupAddon align="inline-end">
                      <InputGroupButton
                        size="icon-xs"
                        onClick={() => {
                          field.onChange(0);
                          setFormattedAmount('');
                        }}
                      >
                        <XIcon />
                      </InputGroupButton>
                    </InputGroupAddon>
                  </InputGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <FieldSeparator />

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                  <TypographyLabel>
                    {t('Page.dashboard.transactionDrawer.form.title.type')}
                  </TypographyLabel>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {typeOptions.map((option) => {
                    const isActive = option._id === type._id;

                    return (
                      <CardButton
                        key={option._id}
                        label={option.name}
                        size="md"
                        handleOnClick={() => onTypeChange(option)}
                        isActive={isActive}
                      />
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between gap-2">
                <TypographyLabel>
                  {t('Page.dashboard.transactionDrawer.form.title.category')}
                </TypographyLabel>
                <TypographyCaption>
                  {t('Page.dashboard.transactionDrawer.form.helper.category')}
                </TypographyCaption>
              </div>

              <Controller
                control={form.control}
                name="category"
                render={({ field, fieldState }) => {
                  const filteredCategories = categories.filter(
                    (category) =>
                      category.type._id === type._id && category.isActive,
                  );
                  const previewCategories = filteredCategories.slice(
                    0,
                    CATEGORY_PREVIEW_LIMIT,
                  );
                  const isSelectedOutsidePreview =
                    !!field.value &&
                    !previewCategories.some(
                      (category) => category._id === field.value,
                    );
                  const selectedCategory = isSelectedOutsidePreview
                    ? filteredCategories.find(
                        (category) => category._id === field.value,
                      )
                    : undefined;
                  const collapsedCategories =
                    isSelectedOutsidePreview && selectedCategory
                      ? [
                          ...previewCategories.slice(
                            0,
                            Math.max(CATEGORY_PREVIEW_LIMIT - 1, 0),
                          ),
                          selectedCategory,
                        ]
                      : previewCategories;
                  const displayedCategories = isShowingAllCategories
                    ? filteredCategories
                    : collapsedCategories;
                  const hasMoreCategories =
                    filteredCategories.length > CATEGORY_PREVIEW_LIMIT;

                  return (
                    <Field className="gap-4">
                      <div className="grid grid-cols-2 gap-2">
                        {displayedCategories.map((category) => {
                          const { _id, id, name, icon } = category;
                          const isTranslated = t.has(`Common.category.${id}`);
                          const label = isTranslated
                            ? t(`Common.category.${id}`)
                            : name;
                          const isSelected = field.value === _id;

                          return (
                            <Tooltip key={_id}>
                              <TooltipTrigger
                                render={
                                  <span>
                                    <CardButton
                                      label={label}
                                      handleOnClick={() =>
                                        field.onChange(isSelected ? '' : _id)
                                      }
                                      isActive={isSelected}
                                      size="md"
                                      icon={icon as IconProps}
                                    />
                                  </span>
                                }
                              />
                              {t.has(`Common.tooltip.category.${id}`) && (
                                <TooltipContent>
                                  <p>{t(`Common.tooltip.category.${id}`)}</p>
                                </TooltipContent>
                              )}
                            </Tooltip>
                          );
                        })}
                      </div>

                      {hasMoreCategories && (
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() =>
                            setIsShowingAllCategories(
                              (previousValue) => !previousValue,
                            )
                          }
                          className={`${isShowingAllCategories ? 'animate-[bounce-up_1s_ease-in-out_infinite]' : 'animate-[bounce-down_1s_ease-in-out_infinite]'}`}
                        >
                          <div className="text-muted-foreground flex flex-row items-center justify-between gap-2 lowercase">
                            {isShowingAllCategories ? (
                              <>
                                <ChevronUpIcon className="size-4" />
                                {t(
                                  'Page.dashboard.transactionDrawer.form.title.showLess',
                                )}
                                <ChevronUpIcon className="size-4" />
                              </>
                            ) : (
                              <>
                                <ChevronDownIcon className="size-4" />
                                {t(
                                  'Page.dashboard.transactionDrawer.form.title.showMore',
                                )}
                                <ChevronDownIcon className="size-4" />
                              </>
                            )}
                          </div>
                        </Button>
                      )}

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  );
                }}
              />
            </div>

            <FieldSeparator />

            <div className="flex flex-col gap-4">
              <Controller
                control={form.control}
                name="isRecurring"
                render={({ field, fieldState }) => (
                  <Field orientation="horizontal">
                    <Checkbox
                      id="form-isRecurring"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <FieldLabel htmlFor="form-isRecurring">
                      {t(
                        'Page.dashboard.transactionDrawer.form.title.isRecurring',
                      )}
                    </FieldLabel>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <TypographyCaption>
                {t('Page.dashboard.transactionDrawer.form.helper.isRecurring')}
              </TypographyCaption>

              <div className="grid grid-cols-1 gap-3">
                <Controller
                  control={form.control}
                  name="startDate"
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel
                        htmlFor="form-startDate"
                        className="text-sm font-semibold"
                      >
                        {isRecurring
                          ? t(
                              'Page.dashboard.transactionDrawer.form.title.startDate',
                            )
                          : t(
                              'Page.dashboard.transactionDrawer.form.title.date',
                            )}
                      </FieldLabel>
                      <DatePicker date={field.value} onChange={field.onChange}>
                        <Button
                          id="form-startDate"
                          variant="outline"
                          className="flex h-12 w-full items-center justify-between rounded-xl border-2 text-left font-semibold"
                        >
                          <TypographyLabel>
                            {moment(field?.value).format('MMM DD, YYYY')}
                          </TypographyLabel>
                          <CalendarIcon className="ml-auto size-4 opacity-60" />
                        </Button>
                      </DatePicker>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>

              {isRecurring && (
                <div className="grid grid-cols-1 gap-3">
                  <Controller
                    control={form.control}
                    name="endDate"
                    render={({ field, fieldState }) => (
                      <Field>
                        <FieldLabel
                          htmlFor="form-endDate"
                          className="text-sm font-semibold"
                        >
                          {t(
                            'Page.dashboard.transactionDrawer.form.title.endDate',
                          )}
                        </FieldLabel>
                        <DatePicker
                          date={field.value}
                          onChange={field.onChange}
                        >
                          <Button
                            id="form-endDate"
                            variant="outline"
                            className="flex h-12 w-full items-center justify-between rounded-xl border-2 text-left font-semibold"
                          >
                            <TypographyLabel>
                              {moment(field?.value).format('MMM DD, YYYY')}
                            </TypographyLabel>
                            <CalendarIcon className="ml-auto size-4 opacity-60" />
                          </Button>
                        </DatePicker>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  {excludedDatesArray.length > 1 && (
                    <Controller
                      control={form.control}
                      name="excludedDates"
                      render={({ field, fieldState }) => (
                        <Field>
                          <FieldLabel className="text-sm font-semibold">
                            {t(
                              'Page.dashboard.transactionDrawer.form.title.excludedDates',
                            )}
                          </FieldLabel>
                          <Combobox
                            value={(field.value ?? []).map(
                              (item: ExcludedDatesProps) => item._id,
                            )}
                            onValueChange={(values: string[]) => {
                              field.onChange(
                                values.map((v) =>
                                  excludedDatesArray.find(
                                    (item) => item._id === v,
                                  )!,
                                ),
                              );
                            }}
                            multiple
                          >
                            <ComboboxChips ref={anchor} className="w-full">
                              <ComboboxValue>
                                {(field.value ?? []).map(
                                  (item: ExcludedDatesProps) => (
                                    <ComboboxChip key={item._id}>
                                      {item.name}
                                    </ComboboxChip>
                                  ),
                                )}
                              </ComboboxValue>
                              <ComboboxChipsInput />
                            </ComboboxChips>
                            <ComboboxContent anchor={anchor}>
                              <ComboboxList>
                                {excludedDatesArray.map((item) => (
                                  <ComboboxItem key={item._id} value={item._id}>
                                    {item.name}
                                  </ComboboxItem>
                                ))}
                              </ComboboxList>
                            </ComboboxContent>
                          </Combobox>
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                  )}
                </div>
              )}
            </div>

            <FieldSeparator />

            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                  {isDetailsOpen
                    ? t(
                        'Page.dashboard.transactionDrawer.form.title.hideDetails',
                      )
                    : t(
                        'Page.dashboard.transactionDrawer.form.title.addDetails',
                      )}
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
                  <Controller
                    control={form.control}
                    name="description"
                    render={({ field, fieldState }) => (
                      <Field>
                        <FieldLabel
                          htmlFor="form-description"
                          className="text-sm font-semibold"
                        >
                          {t(
                            'Page.dashboard.transactionDrawer.form.title.description',
                          )}
                        </FieldLabel>
                        <Textarea
                          {...field}
                          id="form-description"
                          aria-invalid={fieldState.invalid}
                          placeholder={t(
                            'Page.dashboard.transactionDrawer.form.placeholder.description',
                          )}
                          rows={3}
                          // className="border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 min-h-24 w-full rounded-xl border px-3 py-2 text-sm shadow-xs transition outline-none focus-visible:ring-[3px]"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>
              )}
            </div>
          </FieldGroup>
        </CardContent>
      </Card>

      {defaultValues && deleteTransaction && (
        <div className="flex justify-end">
          <ConfirmationDialog
            title={t('Common.alertDialog.delete.title')}
            description={t('Common.alertDialog.delete.description')}
            ok={t('Common.alertDialog.delete.okButton')}
            handleSubmit={handleDeleteTransaction}
            isDestructive
          >
            <Button type="button" variant="destructive" size="icon">
              <Trash2Icon className="size-4" />
            </Button>
          </ConfirmationDialog>
        </div>
      )}
    </form>
  );
};

export default TransactionDrawerForm;
