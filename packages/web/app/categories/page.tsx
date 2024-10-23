'use client';

import { useState } from 'react';
import { useAppSelector } from '@/lib/hooks';

import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Tab, Tabs } from '@nextui-org/react';
import CardIcon from '@/components/shared/CardIcon';
import EditCategoryDrawer from '@/components/categories/EditCategoryDrawer';

import { PlusIcon } from 'lucide-react';

import type { CategoryItemProps } from '@/types/Category';
import type { ListProps } from '@/types/List';

const Categories = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [categoryItemType, setCategoryItemType] = useState<ListProps>();
  const [categoryItem, setCategoryItem] = useState<CategoryItemProps>({
    _id: '',
    name: '',
    icon: 'default'
  });

  const { types, categories } = useAppSelector((state) => state.main);

  const handleEditCategory = (type: ListProps, category: CategoryItemProps) => {
    setCategoryItemType(type);
    setCategoryItem(category);
    setIsDrawerOpen(true);
  };

  const handleAddNewCategory = () => {
    setCategoryItem({
      _id: '',
      name: '',
      icon: 'default'
    });
    // Open the add/edit category
    setIsDrawerOpen(true);
  };

  const handleAddSuggestion = (category: CategoryItemProps) => {
    console.log(category);
  };

  return (
    <>
      <div className="space-y-4 sm:space-y-8">
        <Tabs
          variant="bordered"
          radius="full"
          color="secondary"
          className="flex flex-col items-center"
        >
          {types.map((type) => (
            <Tab key={type._id.toString()} title={type.name}>
              <div className="space-y-4">
                <div className="flex flex-row items-center justify-between">
                  <h6 className="font-semibold text-lg">CATEGORIES</h6>

                  <Button
                    variant="ghost"
                    size="sm_rounded_icon"
                    onClick={handleAddNewCategory}
                  >
                    <PlusIcon className="h-4 w-4" />
                  </Button>
                </div>

                <div className="bg-secondary rounded-lg">
                  {categories[type._id]
                    .filter((category) => category.active)
                    .map((category, i, { length }) => (
                      <div key={category._id}>
                        <div
                          className="flex flex-row items-center space-x-4 p-2 hover:bg-border cursor-pointer"
                          onClick={() => handleEditCategory(type, category)}
                        >
                          <CardIcon icon={category.icon} />
                          <p>{category.name}</p>
                        </div>

                        {i + 1 !== length && <Separator />}
                      </div>
                    ))}
                </div>

                <h6 className="font-semibold text-lg">SUGGESTIONS</h6>

                <div className="bg-secondary rounded-lg">
                  {categories[type._id]
                    .filter((category) => !category.active)
                    .map((category, i, { length }) => (
                      <div key={category._id}>
                        <div
                          className="flex flex-row items-center justify-between p-2"
                          onClick={() => handleAddSuggestion(category)}
                        >
                          <div className="flex flex-row items-center space-x-4">
                            <CardIcon icon={category.icon} />
                            <p>{category.name}</p>
                          </div>

                          <Button variant="ghost" size="sm_rounded_icon">
                            <PlusIcon className="h-4 w-4" />
                          </Button>
                        </div>

                        {i + 1 !== length && <Separator />}
                      </div>
                    ))}
                </div>
              </div>
            </Tab>
          ))}
        </Tabs>
      </div>

      <EditCategoryDrawer
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
        type={categoryItemType}
        category={categoryItem}
        setCategory={setCategoryItem}
      />
    </>
  );
};

export default Categories;
