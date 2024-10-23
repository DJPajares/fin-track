'use client';

import { useAppDispatch, useAppSelector } from '@/lib/hooks';

import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Tab, Tabs } from '@nextui-org/react';
import CardIcon from '@/components/shared/CardIcon';
import EditCategoryDrawer from '@/components/categories/EditCategoryDrawer';

import { PlusIcon } from 'lucide-react';

import type { CategoryItemProps } from '@/types/Category';
import { updateCategory } from '@/lib/feature/main/mainDataSlice';
import { ListProps } from '@/types/List';

const baseCategory: CategoryItemProps = {
  _id: '123',
  name: '',
  icon: 'default',
  active: true
};

const Categories = () => {
  const { types, categories } = useAppSelector((state) => state.main);

  const dispatch = useAppDispatch();

  const handleAddSuggestedCategory = (
    type: ListProps,
    category: CategoryItemProps
  ) => {
    const newCategory = {
      type,
      category: {
        ...category,
        active: true
      }
    };

    console.log('category', category);
    console.log('newCategory', newCategory);

    dispatch(updateCategory(newCategory));
  };

  return (
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

                <EditCategoryDrawer
                  type={type}
                  category={baseCategory}
                  title="Add New Category"
                  okButton="Add"
                >
                  <Button variant="ghost" size="sm_rounded_icon">
                    <PlusIcon className="h-4 w-4" />
                  </Button>
                </EditCategoryDrawer>
              </div>

              <div className="bg-secondary rounded-lg">
                {categories[type._id]
                  .filter((category) => category.active)
                  .map((category, i, { length }) => (
                    <div key={category._id}>
                      <EditCategoryDrawer
                        type={type}
                        category={category}
                        title="Edit Category"
                        okButton="Update"
                      >
                        <div className="flex flex-row items-center space-x-4 p-2 hover:bg-border cursor-pointer">
                          <CardIcon icon={category.icon} />
                          <p>{category.name}</p>
                        </div>
                      </EditCategoryDrawer>

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
                        onClick={() =>
                          handleAddSuggestedCategory(type, category)
                        }
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
  );
};

export default Categories;
