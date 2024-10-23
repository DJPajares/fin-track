import {
  Dispatch,
  RefObject,
  SetStateAction,
  useEffect,
  useState
} from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Input } from '../ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';

import CardIcon, { iconMap, type IconProps } from '../shared/CardIcon';

import type { ListProps } from '@/types/List';
import type { CategoryItemProps } from '@/types/Category';
import { useAppDispatch } from '@/lib/hooks';
import { updateCategory } from '@/lib/feature/main/mainDataSlice';

type EditCategoryDrawerProps = {
  // isDrawerOpen: boolean;
  // setIsDrawerOpen: Dispatch<SetStateAction<boolean>>;
  type?: ListProps;
  category: CategoryItemProps;
  // setCategory: Dispatch<SetStateAction<CategoryItemProps>>;
  formRef: RefObject<HTMLFormElement>;
};

const iconMapArray = Object.keys(iconMap).map((key) => key);

const EditCategoryDrawer = ({
  // isDrawerOpen,
  // setIsDrawerOpen,
  type,
  category,
  // setCategory,
  formRef
}: EditCategoryDrawerProps) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const dispatch = useAppDispatch();

  useEffect(() => {
    form.setValue('icon', category.icon);
    form.setValue('name', category.name);
  }, [category]);

  const categorySchema = z.custom<CategoryItemProps>();
  // const categorySchema = z.object({
  //   _id: z.string(),
  //   name: z.string(),
  //   icon: 'activity' | 'users',
  //   active: z.string()
  // });

  const form = useForm<CategoryItemProps>({
    resolver: zodResolver(categorySchema),
    defaultValues: category
  });

  const handleChangeIcon = (icon: IconProps) => {
    // setTempCategory({ ...tempCategory, icon });
    form.setValue('icon', icon);
    setIsPopoverOpen(false);
  };

  const onSubmit: SubmitHandler<CategoryItemProps> = (data) => {
    // setCategory(data);

    const result = {
      type,
      category: data
    };

    console.log('result', result);

    dispatch(updateCategory(result));
  };

  return (
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
                {/* <CardIcon icon={category.icon} /> */}
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
    </form>
  );
};

export default EditCategoryDrawer;
