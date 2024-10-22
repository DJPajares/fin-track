import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import CustomDrawer from '../shared/CustomDrawer';
import { CategoryItemProps } from '@/types/Category';
import { Input } from '../ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import CardIcon, { iconMap, IconProps } from '../shared/CardIcon';
import { ListProps } from '@/types/List';

type EditCategoryDrawerProps = {
  isDrawerOpen: boolean;
  setIsDrawerOpen: Dispatch<SetStateAction<boolean>>;
  type?: ListProps;
  category: CategoryItemProps;
  setCategory: Dispatch<SetStateAction<CategoryItemProps>>;
};

const iconMapArray = Object.keys(iconMap).map((key) => key);

const EditCategoryDrawer = ({
  isDrawerOpen,
  setIsDrawerOpen,
  type,
  category,
  setCategory
}: EditCategoryDrawerProps) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [categoryItem, setCategoryItem] = useState(category);

  useEffect(() => {
    setCategoryItem(category);
  }, [category]);

  const handleChangeIcon = (icon: IconProps) => {
    setCategoryItem({ ...categoryItem, icon });
    setIsPopoverOpen(false);
  };

  return (
    <CustomDrawer
      isDrawerOpen={isDrawerOpen}
      setIsDrawerOpen={setIsDrawerOpen}
      title={type ? type.name : 'Edit Category'}
      footerOk="Update"
    >
      <div className="flex flex-row items-center p-4 space-x-2 sm:space-x-4">
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon">
              <CardIcon icon={categoryItem.icon} />
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
                    categoryItem.icon === icon &&
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

        <Input placeholder="Category name" defaultValue={categoryItem.name} />
      </div>
    </CustomDrawer>
  );
};

export default EditCategoryDrawer;
