import { zodResolver } from '@hookform/resolvers/zod';
import type { ListProps } from '@shared/types/List';
import CardIcon, {
  iconMap,
  type IconProps,
} from '@web/components/shared/CardIcon';
import ConfirmationDialog from '@web/components/shared/ConfirmationDialog';
import CustomDrawer from '@web/components/shared/CustomDrawer';
import { Button } from '@web/components/ui/button';
import { Input } from '@web/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@web/components/ui/popover';
import { useAppDispatch, useAppSelector } from '@web/lib/hooks/use-redux';
import {
  createCustomCategory,
  updateCategory,
} from '@web/lib/redux/feature/main/mainSlice';
import { categorySchema } from '@web/lib/schemas/category';
import type { CategoryItemProps } from '@web/types/Category';
import { EyeOffIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ReactElement, useRef, useState } from 'react';
import {
  Controller,
  type Resolver,
  SubmitHandler,
  useForm,
} from 'react-hook-form';

type EditCategoryDrawerProps = {
  type?: ListProps;
  category: CategoryItemProps;
  title: string;
  isNew?: boolean;
  children: ReactElement;
};

const iconMapArray = Object.keys(iconMap) as (keyof typeof iconMap)[];

const EditCategoryDrawer = ({
  type,
  category,
  title,
  isNew = false,
  children,
}: EditCategoryDrawerProps) => {
  const t = useTranslations();
  const dispatch = useAppDispatch();

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const userId = useAppSelector((state) => state.auth.user)?.id || '';

  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm<CategoryItemProps>({
    resolver: (
      zodResolver as unknown as (
        schema: typeof categorySchema,
      ) => Resolver<CategoryItemProps>
    )(categorySchema),
    defaultValues: category,
  });

  const handleChangeIcon = (icon: IconProps) => {
    form.setValue('icon', icon);
    setIsPopoverOpen(false);
  };

  const handleSubmit = async () => {
    if (formRef.current) formRef.current.requestSubmit();

    setIsDrawerOpen(false);
  };

  const handleCategoryRemoval = () => {
    const data = form.getValues();

    dispatch(
      updateCategory({
        ...data,
        type: type?.value || '',
        userId,
        isActive: false,
      }),
    );
  };

  const onSubmit: SubmitHandler<CategoryItemProps> = async (data) => {
    if (isNew) {
      dispatch(
        createCustomCategory({
          name: data.name,
          icon: data.icon,
          type: type?.value || '',
          isActive: data.isActive,
          userId,
        }),
      );
    } else {
      dispatch(
        updateCategory({
          ...data,
          type: type?.value || '',
          userId,
        }),
      );
    }
  };

  return (
    <CustomDrawer
      open={isDrawerOpen}
      onOpenChange={setIsDrawerOpen}
      handleSubmit={handleSubmit}
      title={title}
      description={type?.label}
      triggerChildren={children}
    >
      <form onSubmit={form.handleSubmit(onSubmit)} ref={formRef}>
        <div className="flex flex-row items-center justify-center gap-2">
          <Controller
            name="icon"
            control={form.control}
            render={({ field }) => (
              <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                <PopoverTrigger
                  render={
                    <Button variant="outline" size="icon">
                      <CardIcon icon={field.value} />
                    </Button>
                  }
                />

                <PopoverContent>
                  <div className="grid grid-cols-6 gap-2 align-middle">
                    {iconMapArray.map((icon) => (
                      <Button
                        key={icon}
                        variant="outline"
                        size="icon"
                        className={`${
                          field.value === icon &&
                          'bg-primary text-primary-foreground'
                        }`}
                        onClick={() => handleChangeIcon(icon)}
                      >
                        <CardIcon icon={icon} />
                      </Button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            )}
          />

          <Controller
            name="name"
            control={form.control}
            render={({ field }) => (
              <Input placeholder="Category name" {...field} />
            )}
          />

          {!isNew && (
            <ConfirmationDialog
              title={t('Common.alertDialog.hide.title')}
              description={t('Common.alertDialog.hide.description')}
              ok={t('Common.alertDialog.hide.okButton')}
              handleSubmit={handleCategoryRemoval}
              isDestructive
            >
              <Button
                variant="destructive"
                size="icon"
                aria-label={t('Common.alertDialog.hide.title')}
              >
                <EyeOffIcon className="size-4" />
              </Button>
            </ConfirmationDialog>
          )}
        </div>
      </form>
    </CustomDrawer>
  );
};

export default EditCategoryDrawer;
