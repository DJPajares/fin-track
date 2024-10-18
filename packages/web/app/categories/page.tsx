'use client';

import CardIcon from '@/components/shared/CardIcon';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAppSelector } from '@/lib/hooks';
import { Tab, Tabs } from '@nextui-org/react';

const Categories = () => {
  const { types, categories } = useAppSelector((state) => state.main);

  return (
    <div className="space-y-4 sm:space-y-8">
      <Card>
        <Tabs variant="underlined" className="flex flex-col items-center pt-3">
          {types.map((type) => (
            <Tab key={type._id.toString()} title={type.name} className="px-4">
              <div className="space-y-4">
                <h6 className="font-semibold text-lg">CURRENT</h6>

                <>
                  {categories[type._id].map((category) => (
                    <div
                      key={category._id}
                      className="flex flex-row items-center space-x-4"
                    >
                      <CardIcon icon={category.icon} />
                      <p>{category.name}</p>
                    </div>
                  ))}
                </>

                <Separator />

                <h6 className="font-semibold text-lg">SUGGESTIONS</h6>
              </div>
            </Tab>
          ))}
        </Tabs>
      </Card>
    </div>
  );
};

export default Categories;
