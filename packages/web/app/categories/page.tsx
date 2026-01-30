'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { PlusIcon } from 'lucide-react';

import { useAppDispatch, useAppSelector } from '../../lib/hooks/use-redux';
import { updateCategory } from '../../lib/redux/feature/main/mainSlice';

import { Separator } from '../../components/ui/separator';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import CardIcon from '../../components/shared/CardIcon';
import { SelectBox } from '../../components/shared/SelectBox';
import Loader from '@web/components/shared/Loader';
import EditCategoryDrawer from '../../app/categories/EditCategory/EditCategoryDrawer';

import type { CategoryItemProps } from '../../types/Category';
import type { ListProps } from '../../types/List';

const baseCategory: CategoryItemProps = {
  _id: '',
  id: '',
  name: '',
  type: {
    _id: '',
    name: '',
  },
  icon: 'default',
  isActive: true,
  scope: 'custom',
};

const defaultType = {
  _id: '',
  name: '',
};

const Categories = () => {
  const t = useTranslations();
  const dispatch = useAppDispatch();

  const userId = useAppSelector((state) => state.auth.user)?.id || '';
  const { types, categories, isLoading } = useAppSelector(
    (state) => state.main,
  );

  const [selectedType, setSelectedType] = useState<ListProps>(defaultType);

  const newTypes = types.map((type) => {
    const isTranslated = t.has(`Common.type.${type.id}`);

    return {
      _id: type._id,
      name: isTranslated ? t(`Common.type.${type.id}`) : type.name,
    };
  });

  useEffect(() => {
    if (types && types.length > 0) {
      setSelectedType(types[0]);
    }
  }, [types]);

  // Update selectedType name when translations change
  useEffect(() => {
    if (selectedType._id && newTypes.length > 0) {
      const updatedType = newTypes.find((t) => t._id === selectedType._id);
      if (updatedType && updatedType.name !== selectedType.name) {
        setSelectedType(updatedType);
      }
    }
  }, [newTypes, selectedType._id, selectedType.name]);

  const handleAddSuggestedCategory = (category: CategoryItemProps) => {
    const updatedCategory = {
      ...category,
      isActive: true,
      type: category.type._id,
      userId,
    };

    dispatch(updateCategory(updatedCategory));
  };

  if (isLoading) return <Loader />;

  return (
    <>
      <div className="flex flex-row justify-end">
        <SelectBox
          variant="ghost"
          items={newTypes}
          selectedItem={selectedType}
          setSelectedItem={setSelectedType}
          placeholder={t('Common.label.selectPlaceholder')}
          className="w-fit p-0 text-base font-semibold"
        />
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex flex-row items-center justify-between">
            <Label variant="title">
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
                  category.type._id === selectedType._id && category.isActive,
              )
              .map((category, i, { length }) => (
                <div key={category._id} className="px-2">
                  {category.scope === 'global' ? (
                    <div className="flex flex-row items-center gap-4 p-2 opacity-60">
                      <CardIcon icon={category.icon} />
                      <Label>{category.name}</Label>
                    </div>
                  ) : (
                    <EditCategoryDrawer
                      type={selectedType}
                      category={category}
                      title={t('Page.categories.categoryDrawer.titleEdit')}
                    >
                      <div className="hover:bg-border flex cursor-pointer flex-row items-center gap-4 p-2">
                        <CardIcon icon={category.icon} />
                        <Label className="font-semibold">{category.name}</Label>
                      </div>
                    </EditCategoryDrawer>
                  )}

                  {i + 1 !== length && <Separator />}
                </div>
              ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label variant="title">
            {t('Page.categories.titleSuggestions').toLocaleUpperCase()}
          </Label>

          <div className="bg-card rounded-lg">
            {categories
              .filter(
                (category) =>
                  category.type._id === selectedType._id && !category.isActive,
              )
              .map((category, i, { length }) => (
                <div key={category._id}>
                  <div
                    className="hover:bg-border flex cursor-pointer flex-row items-center justify-between p-2"
                    onClick={() => handleAddSuggestedCategory(category)}
                  >
                    <div className="flex flex-row items-center space-x-4">
                      <CardIcon icon={category.icon} />
                      <Label className="font-semibold italic">
                        {category.name}
                      </Label>
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
    </>
  );
};

export default Categories;
