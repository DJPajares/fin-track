import { ReactNode, useRef, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';

import { Input } from '../../../components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../../components/ui/popover';
import { Button } from '../../../components/ui/button';

import { useAppDispatch, useAppSelector } from '../../../lib/hooks/use-redux';
import {
  createCustomCategory,
  updateCategory,
} from '../../../lib/redux/feature/main/mainSlice';
import { categorySchema } from '../../../lib/schemas/category';
import { EyeOffIcon } from 'lucide-react';

import CardIcon, {
  iconMap,
  type IconProps,
} from '../../../components/shared/CardIcon';
import CustomDrawer from '@web/components/shared/CustomDrawer';

import type { ListProps } from '../../../types/List';
import type { CategoryItemProps } from '../../../types/Category';
import ConfirmationDialog from '@web/components/shared/ConfirmationDialog';

type EditCategoryDrawerProps = {
  type?: ListProps;
  category: CategoryItemProps;
  title: string;
  isNew?: boolean;
  children: ReactNode;
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
    resolver: zodResolver(categorySchema),
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
        type: type?._id || '',
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
          type: type?._id || '',
          isActive: data.isActive,
          userId,
        }),
      );
    } else {
      dispatch(
        updateCategory({
          ...data,
          type: type?._id || '',
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
      description={type?.name}
      triggerChildren={children}
    >
      <>
        <form onSubmit={form.handleSubmit(onSubmit)} ref={formRef}>
          <div className="flex flex-row items-center justify-center space-x-2 sm:space-x-4">
            <Controller
              name="icon"
              control={form.control}
              render={({ field }) => (
                <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="icon">
                      <CardIcon icon={field.value} />
                    </Button>
                  </PopoverTrigger>

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

            <ConfirmationDialog
              title={t('Common.alertDialog.hide.title')}
              description={t('Common.alertDialog.hide.description')}
              ok={t('Common.alertDialog.hide.okButton')}
              handleSubmit={handleCategoryRemoval}
              isDestructive
            >
              {!isNew && (
                <Button
                  variant="destructive"
                  size="icon"
                  aria-label={t('Common.alertDialog.hide.title')}
                >
                  <EyeOffIcon className="size-4" />
                </Button>
              )}
            </ConfirmationDialog>
          </div>
        </form>
      </>
    </CustomDrawer>
  );
};

export default EditCategoryDrawer;
