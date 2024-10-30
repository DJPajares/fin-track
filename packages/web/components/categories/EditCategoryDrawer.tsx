import { ReactNode, useRef, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '../ui/drawer';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '../ui/alert-dialog';
import { Input } from '../ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';

import { useAppDispatch } from '@/lib/hooks';
import {
  addCategory,
  deleteCategory,
  updateCategory
} from '@/lib/feature/main/mainDataSlice';

import CardIcon, { iconMap, type IconProps } from '../shared/CardIcon';

import type { ListProps } from '@/types/List';
import type { CategoryItemProps } from '@/types/Category';
import { Trash2Icon } from 'lucide-react';

type EditCategoryDrawerProps = {
  type?: ListProps;
  category: CategoryItemProps;
  title?: string;
  okButton?: string;
  isNew?: boolean;
  children: ReactNode;
};

const iconMapArray = Object.keys(iconMap) as (keyof typeof iconMap)[];

const EditCategoryDrawer = ({
  type,
  category,
  title = 'Edit Category',
  okButton = 'Update',
  isNew = false,
  children
}: EditCategoryDrawerProps) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const dispatch = useAppDispatch();

  const formRef = useRef<HTMLFormElement>(null);

  // useEffect(() => {
  //   form.setValue('icon', category.icon);
  //   form.setValue('name', category.name);
  // }, [category]);

  const categorySchema = z.custom<CategoryItemProps>();

  const form = useForm<CategoryItemProps>({
    resolver: zodResolver(categorySchema),
    defaultValues: category
  });

  const handleChangeIcon = (icon: IconProps) => {
    form.setValue('icon', icon);
    setIsPopoverOpen(false);
  };

  const handleConfirmSubmit = () => {
    if (formRef.current) formRef.current.requestSubmit();

    setIsDrawerOpen(false);
  };

  const handleCategoryRemoval = () => {
    // to-do: remove completely if not part of the master list (stored in category collection/table)
    dispatch(deleteCategory(category));
  };

  const onSubmit: SubmitHandler<CategoryItemProps> = (data) => {
    if (isNew) {
      dispatch(
        addCategory({
          ...data,
          type: {
            _id: type ? type._id : '',
            name: type ? type.name : ''
          }
        })
      );
    } else {
      dispatch(updateCategory(data));
    }
  };

  return (
    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>

      <DrawerContent className="mx-auto w-full max-w-lg max-h-screen">
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{type?.name}</DrawerDescription>
        </DrawerHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-row items-center p-4 space-x-2 sm:space-x-4"
          ref={formRef}
        >
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

                <PopoverContent className="w-full">
                  <div className="grid grid-cols-6 align-middle gap-2">
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
              <Input
                placeholder="Category name"
                // value={field.value}
                // onChange={field.onChange}
                {...field}
              />
            )}
          />

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="icon">
                <Trash2Icon className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleCategoryRemoval}>
                  Ok
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </form>

        <DrawerFooter>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button>{okButton}</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleConfirmSubmit}>
                  Ok
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default EditCategoryDrawer;
