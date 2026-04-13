'use client';

import CardIcon from '@web/components/shared/CardIcon';
import ConfirmationDialog from '@web/components/shared/ConfirmationDialog';
import Loader from '@web/components/shared/Loader';
import { SelectBox } from '@web/components/shared/SelectBox';
import { TypographyLabel } from '@web/components/shared/Typography';
import { Button } from '@web/components/ui/button';
import { Separator } from '@web/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@web/components/ui/tooltip';
import { useAppDispatch, useAppSelector } from '@web/lib/hooks/use-redux';
import {
  fetchCategories,
  updateCategory,
} from '@web/lib/redux/feature/main/mainSlice';
import type { CategoryItemProps } from '@web/types/Category';
import { PlusIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';

import EditCategoryDrawer from './EditCategory/EditCategoryDrawer';

const baseCategory: CategoryItemProps = {
  _id: '',
  id: '',
  name: '',
  type: {
    _id: '',
    name: '',
    value: '',
    label: '',
  },
  icon: 'default',
  isActive: true,
  scope: 'custom',
};

const defaultType = {
  value: '',
  label: '',
};

const Categories = () => {
  const t = useTranslations();
  const dispatch = useAppDispatch();

  const userId = useAppSelector((state) => state.auth.user)?.id || '';
  const { types, categories, isLoading } = useAppSelector(
    (state) => state.main,
  );

  const [selectedTypeId, setSelectedTypeId] = useState('');

  const newTypes = types.map((type) => {
    const isTranslated = t.has(`Common.type.${type.id}`);

    return {
      value: type.value,
      label: isTranslated ? t(`Common.type.${type.id}`) : type.label,
    };
  });

  const selectedType = useMemo(() => {
    return (
      newTypes.find((type) => type.value === selectedTypeId) ??
      newTypes[0] ??
      defaultType
    );
  }, [newTypes, selectedTypeId]);

  const handleAddSuggestedCategory = async (category: CategoryItemProps) => {
    const updatedCategory = {
      ...category,
      isActive: true,
      type: category.type.value,
      userId,
    };

    await dispatch(updateCategory(updatedCategory));
    // Refetch categories to ensure state is in sync after backend creates a custom category
    dispatch(fetchCategories({ userId }));
  };

  if (isLoading) return <Loader />;

  return (
    <>
      <div className="flex flex-row justify-end">
        <SelectBox
          variant="ghost"
          items={newTypes}
          selectedItem={selectedType}
          setSelectedItem={(item) => setSelectedTypeId(item.value)}
          placeholder={t('Common.label.selectPlaceholder')}
          className="w-fit text-base font-semibold"
        />
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex flex-row items-center justify-between">
            <TypographyLabel>
              {t('Page.categories.titleCategories').toLocaleUpperCase()}
            </TypographyLabel>

            <EditCategoryDrawer
              type={selectedType}
              category={baseCategory}
              title={t('Page.categories.categoryDrawer.titleAdd')}
              isNew
            >
              <Button variant="ghost">
                <PlusIcon className="size-4" />
              </Button>
            </EditCategoryDrawer>
          </div>

          <div className="bg-card rounded-lg">
            {categories
              .filter(
                (category) =>
                  category.type._id === selectedType.value && category.isActive,
              )
              .map((category, i, { length }) => (
                <div key={category._id} className="px-2">
                  {category.scope === 'global' ? (
                    <div>
                      <Tooltip>
                        <TooltipTrigger
                          className="opacity-60"
                          render={
                            <div className="flex flex-row items-center gap-2 py-2 opacity-60">
                              <CardIcon icon={category.icon} />
                              <TypographyLabel>
                                {t(`Common.category.${category.id}`)}
                              </TypographyLabel>
                            </div>
                          }
                        />
                        {t.has(`Common.tooltip.category.${category.id}`) && (
                          <TooltipContent>
                            <p>{t(`Common.tooltip.category.${category.id}`)}</p>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </div>
                  ) : (
                    <EditCategoryDrawer
                      type={selectedType}
                      category={category}
                      title={t('Page.categories.categoryDrawer.titleEdit')}
                    >
                      <div className="hover:bg-border flex cursor-pointer flex-row items-center gap-2 py-2">
                        <CardIcon icon={category.icon} />
                        <TypographyLabel>{category.name}</TypographyLabel>
                      </div>
                    </EditCategoryDrawer>
                  )}

                  {i + 1 !== length && <Separator />}
                </div>
              ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <TypographyLabel>
            {t('Page.categories.titleSuggestions').toLocaleUpperCase()}
          </TypographyLabel>

          <div className="bg-card rounded-lg">
            {categories
              .filter(
                (category) =>
                  category.type._id === selectedType.value &&
                  !category.isActive,
              )
              .map((category, i, { length }) => (
                <div key={category._id}>
                  <ConfirmationDialog
                    title={t('Common.alertDialog.save.title')}
                    description={t('Common.alertDialog.save.description')}
                    ok={t('Common.alertDialog.save.okButton')}
                    handleSubmit={() => handleAddSuggestedCategory(category)}
                  >
                    <div className="hover:bg-border flex cursor-pointer flex-row items-center justify-between p-2">
                      <div className="flex cursor-pointer flex-row items-center justify-between gap-2">
                        <CardIcon icon={category.icon} />
                        <TypographyLabel className="italic">
                          {category.name}
                        </TypographyLabel>
                      </div>

                      <Button variant="ghost" size="icon-sm">
                        <PlusIcon className="size-4" />
                      </Button>
                    </div>
                  </ConfirmationDialog>

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
