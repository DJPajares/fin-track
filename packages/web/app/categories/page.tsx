'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { PlusIcon } from 'lucide-react';

import { useAppDispatch, useAppSelector } from '../../lib/hooks/use-redux';
import { updateCategory } from '../../lib/redux/feature/main/mainSlice';

import { Separator } from '../../components/ui/separator';
import { Button } from '../../components/ui/button';
import CardIcon from '../../components/shared/CardIcon';
import { SelectBox } from '../../components/shared/SelectBox';
import EditCategoryDrawer from '../../app/categories/EditCategory/EditCategoryDrawer';

import type { CategoryItemProps } from '../../types/Category';
import type { ListProps } from '../../types/List';
import { Label } from '@web/components/ui/label';

const baseCategory: CategoryItemProps = {
  _id: '',
  id: '',
  name: '',
  type: {
    _id: '',
    name: '',
  },
  icon: 'default',
  active: true,
};

const defaultType = {
  _id: '',
  name: '',
};

const Categories = () => {
  const t = useTranslations();
  const dispatch = useAppDispatch();

  const { types, categories } = useAppSelector((state) => state.main);

  const [selectedType, setSelectedType] = useState<ListProps>(defaultType);

  useEffect(() => {
    if (types && types.length > 0) {
      setSelectedType(types[0]);
    }
  }, [types]);

  const handleAddSuggestedCategory = (category: CategoryItemProps) => {
    dispatch(
      updateCategory({
        ...category,
        active: true,
      }),
    );
  };

  return (
    <div className="mx-auto max-w-lg space-y-2">
      <div className="flex flex-row justify-end">
        <SelectBox
          variant="ghost"
          items={types}
          selectedItem={selectedType}
          setSelectedItem={setSelectedType}
          placeholder={t('Common.label.selectPlaceholder')}
          className="w-fit p-0 text-base font-semibold"
        />
      </div>

      <div className="space-y-4">
        <div className="space-y-1">
          <div className="flex flex-row items-center justify-between">
            <Label variant="title-md">
              {t('Page.categories.titleCategories').toLocaleUpperCase()}
            </Label>

            <EditCategoryDrawer
              type={selectedType}
              category={baseCategory}
              title={t('Page.categories.categoryDrawer.titleAdd')}
              isNew
            >
              <Button variant="ghost" size="rounded-icon">
                <PlusIcon className="size-4" />
              </Button>
            </EditCategoryDrawer>
          </div>

          <div className="bg-card rounded-lg">
            {categories
              .filter(
                (category) =>
                  category.type._id === selectedType._id && category.active,
              )
              .map((category, i, { length }) => (
                <div key={category._id}>
                  <EditCategoryDrawer
                    type={selectedType}
                    category={category}
                    title={t('Page.categories.categoryDrawer.titleEdit')}
                  >
                    <div className="hover:bg-border flex cursor-pointer flex-row items-center space-x-4 p-2">
                      <CardIcon icon={category.icon} />
                      <Label>{category.name}</Label>
                    </div>
                  </EditCategoryDrawer>

                  {i + 1 !== length && <Separator />}
                </div>
              ))}
          </div>
        </div>

        <div className="space-y-1">
          <Label variant="title-md" className="font-bold">
            {t('Page.categories.titleSuggestions').toLocaleUpperCase()}
          </Label>

          <div className="bg-card rounded-lg">
            {categories
              .filter(
                (category) =>
                  category.type._id === selectedType._id && !category.active,
              )
              .map((category, i, { length }) => (
                <div key={category._id}>
                  <div
                    className="hover:bg-border flex cursor-pointer flex-row items-center justify-between p-2"
                    onClick={() => handleAddSuggestedCategory(category)}
                  >
                    <div className="flex flex-row items-center space-x-4">
                      <CardIcon icon={category.icon} />
                      <Label className="italic">{category.name}</Label>
                    </div>

                    <Button variant="ghost" size="rounded-icon">
                      <PlusIcon className="size-4" />
                    </Button>
                  </div>

                  {i + 1 !== length && <Separator />}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
