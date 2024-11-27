'use client';

import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import { updateCategory } from '../../lib/feature/main/mainSlice';

import { Tab, Tabs } from '@nextui-org/react';
import { Separator } from '../../components/ui/separator';
import { Button } from '../../components/ui/button';
import CardIcon from '../../components/shared/CardIcon';
import EditCategoryDrawer from '../../app/categories/EditCategory/EditCategoryDrawer';

import { PlusIcon } from 'lucide-react';

import type { CategoryItemProps } from '../../types/Category';
import { useTranslations } from 'next-intl';

const baseCategory: CategoryItemProps = {
  _id: '',
  name: '',
  type: {
    _id: '',
    name: ''
  },
  icon: 'default',
  active: true
};

const Categories = () => {
  const t = useTranslations();
  const dispatch = useAppDispatch();

  const { types, categories } = useAppSelector((state) => state.main);

  const handleAddSuggestedCategory = (category: CategoryItemProps) => {
    dispatch(
      updateCategory({
        ...category,
        active: true
      })
    );
  };

  return (
    <div className="space-y-4 sm:space-y-8">
      <Tabs
        variant="bordered"
        radius="full"
        size="lg"
        color="primary"
        className="flex flex-col items-center"
        classNames={{
          tabContent:
            'group-data-[selected=true]:text-primary-foreground text-sm font-bold uppercase'
        }}
      >
        {types.map((type) => (
          <Tab key={type._id.toString()} title={type.name}>
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex flex-row items-center justify-between">
                  <h6 className="font-semibold text-lg">
                    {t('Page.categories.titleCategories').toLocaleUpperCase()}
                  </h6>

                  <EditCategoryDrawer
                    type={type}
                    category={baseCategory}
                    title={t('Page.categories.categoryDrawer.titleAdd')}
                    okButton={t('Common.button.add')}
                    isNew
                  >
                    <Button variant="ghost" size="sm_rounded_icon">
                      <PlusIcon className="h-4 w-4" />
                    </Button>
                  </EditCategoryDrawer>
                </div>

                <div className="bg-accent rounded-lg">
                  {categories
                    .filter(
                      (category) =>
                        category.type._id === type._id && category.active
                    )
                    .map((category, i, { length }) => (
                      <div key={category._id}>
                        <EditCategoryDrawer
                          type={type}
                          category={category}
                          title={t('Page.categories.categoryDrawer.titleEdit')}
                          okButton={t('Common.button.update')}
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
              </div>

              <div className="space-y-1">
                <h6 className="font-semibold text-lg">
                  {t('Page.categories.titleSuggestions').toLocaleUpperCase()}
                </h6>

                <div className="bg-accent rounded-lg">
                  {categories
                    .filter(
                      (category) =>
                        category.type._id === type._id && !category.active
                    )
                    .map((category, i, { length }) => (
                      <div key={category._id}>
                        <div
                          className="flex flex-row items-center justify-between p-2 hover:bg-border cursor-pointer"
                          onClick={() => handleAddSuggestedCategory(category)}
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
            </div>
          </Tab>
        ))}
      </Tabs>
    </div>
  );
};

export default Categories;
