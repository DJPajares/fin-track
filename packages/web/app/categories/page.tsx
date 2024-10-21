'use client';

import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tab, Tabs } from '@nextui-org/react';
import CardIcon from '@/components/shared/CardIcon';

import { useAppSelector } from '@/lib/hooks';

const Categories = () => {
  const { types, categories } = useAppSelector((state) => state.main);

  return (
    <div className="space-y-4 sm:space-y-8">
      <Card>
        <Tabs
          variant="bordered"
          radius="full"
          color="secondary"
          className="flex flex-col items-center pt-3"
        >
          {types.map((type) => (
            <Tab key={type._id.toString()} title={type.name} className="px-4">
              <div className="space-y-4">
                <h6 className="font-semibold text-lg">CURRENT</h6>

                <div className="bg-secondary rounded-lg">
                  {categories[type._id].map(
                    (category, i, { length }) =>
                      category.active && (
                        <div key={category._id}>
                          <div className="flex flex-row items-center space-x-4 p-2">
                            <CardIcon icon={category.icon} />
                            <p>{category.name}</p>
                          </div>
                          {i + 1 !== length && <Separator />}
                        </div>
                      )
                  )}
                </div>

                <h6 className="font-semibold text-lg">SUGGESTIONS</h6>

                <div className="bg-secondary rounded-lg">
                  {categories[type._id].map(
                    (category, i, { length }) =>
                      !category.active && (
                        <div key={category._id}>
                          <div className="flex flex-row items-center space-x-4 p-2">
                            <CardIcon icon={category.icon} />
                            <p>{category.name}</p>
                          </div>
                          {i + 1 !== length && <Separator />}
                        </div>
                      )
                  )}
                </div>
              </div>
            </Tab>
          ))}
        </Tabs>
      </Card>
    </div>
  );
};

export default Categories;
