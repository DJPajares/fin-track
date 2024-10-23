'use client';

import { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';

import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Tab, Tabs } from '@nextui-org/react';
import CardIcon from '@/components/shared/CardIcon';
import EditCategoryDrawer from '@/components/categories/EditCategoryDrawer';

import { PlusIcon } from 'lucide-react';

import type { CategoryItemProps } from '@/types/Category';
import type { ListProps } from '@/types/List';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/ui/drawer';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { updateCategory } from '@/lib/feature/main/mainDataSlice';

const Categories = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [openDrawerId, setOpenDrawerId] = useState<string | null>(null); // Track which category's drawer is open

  const { types, categories } = useAppSelector((state) => state.main);

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    console.log('categories', categories);
  }, [categories]);

  // const handleEditCategory = (type: ListProps, category: CategoryItemProps) => {
  //   setCategoryItemType(type);
  //   setCategoryItem(category);
  //   // setIsDrawerOpen(true);
  // };

  const handleEditCategory = (type: ListProps, category: CategoryItemProps) => {
    // Set the currently opened drawer's id
    // setOpenDrawerId(category._id);
  };

  // const closeDrawer = () => {
  //   setOpenDrawerId(null); // Close the drawer
  // };

  const handleAddNewCategory = () => {
    // Open the add/edit category
    // setIsDrawerOpen(true);
  };

  const handleAddSuggestion = (category: CategoryItemProps) => {
    console.log(category);
  };

  const handleSubmitButton = () => {
    if (formRef.current) formRef.current.requestSubmit();

    // console.log('categoryItem', categoryItem);
    // dispatch(updateCategory(categoryItem));
    // closeDrawer();
    // setIsDrawerOpen(false);
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
                        <Drawer>
                          <DrawerTrigger asChild>
                            <div
                              className="flex flex-row items-center space-x-4 p-2 hover:bg-border cursor-pointer"
                              // onClick={() => handleEditCategory(type, category)}
                            >
                              <CardIcon icon={category.icon} />
                              <p>{category.name}</p>
                            </div>
                          </DrawerTrigger>

                          <DrawerContent className="mx-auto w-full max-w-lg overflow-y-scroll max-h-screen">
                            <DrawerHeader>
                              <DrawerTitle>Edit Category</DrawerTitle>
                              <DrawerDescription>
                                {category.name}
                              </DrawerDescription>
                            </DrawerHeader>

                            <EditCategoryDrawer
                              type={type}
                              category={category}
                              formRef={formRef}
                            />

                            <DrawerFooter>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button>Ok</Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Are you sure?
                                    </AlertDialogTitle>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={handleSubmitButton}
                                    >
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

      {/* <EditCategoryDrawer
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
        type={categoryItemType}
        category={categoryItem}
        setCategory={setCategoryItem}
      /> */}
    </>
  );
};

export default Categories;
