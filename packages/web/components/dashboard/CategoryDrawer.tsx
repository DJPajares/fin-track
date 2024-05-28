import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Progress } from '@nextui-org/progress';
import { formatCurrency } from '../../../../shared/utilities/formatCurrency';
import type { TransactionPaymentCategoryProps } from '../../../../shared/types/transactionPaymentTypes';
import { CheckIcon, HandCoinsIcon } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';

type CategoryDrawerProps = {
  category: TransactionPaymentCategoryProps;
  currency: string;
  isDialogOpen: boolean;
  setIsDialogOpen: Dispatch<SetStateAction<boolean>>;
};

type CategoryDrawerContentProps = {
  category: TransactionPaymentCategoryProps;
  currency: string;
};

const Content = ({ category, currency }: CategoryDrawerContentProps) => (
  <div className="flex flex-col justify-between p-4">
    {Object.keys(category).length > 0 &&
      category.transactions.map((transaction: any) => (
        <div
          key={transaction._id}
          className="grid grid-cols-6 gap-2 items-center py-1"
        >
          <div className="col-span-2">
            <p className="text-sm sm:text-base sm:font-medium truncate hover:text-clip">
              {transaction.name}
            </p>
          </div>
          <div className="col-span-3 flex flex-col px-2">
            <div className="flex flex-row items-center justify-between pb-1">
              <p className="text-sm">
                {formatCurrency({
                  value: transaction.amount,
                  currency
                })}
              </p>
              <p className="text-xs">
                {Math.floor(
                  (transaction.paidAmount / transaction.amount) * 100
                )}
                %
              </p>
            </div>
            <Progress
              color="success"
              aria-label="Loading..."
              value={(transaction.paidAmount / transaction.amount) * 100}
              size="sm"
            />
          </div>
          <div className="flex flex-row justify-end">
            {/* <Button variant="outline" size="icon">
              <HandCoinsIcon className="h-4 w-4" />
            </Button> */}
            <Button variant="outline" size="icon">
              <CheckIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
  </div>
);

const CategoryDrawer = ({
  category,
  currency,
  isDialogOpen,
  setIsDialogOpen
}: CategoryDrawerProps) => (
  <Drawer
    open={isDialogOpen}
    onOpenChange={setIsDialogOpen}
    shouldScaleBackground
  >
    <DrawerContent>
      <div className="mx-auto w-full max-w-lg">
        <DrawerHeader>
          <DrawerTitle>{category.name}</DrawerTitle>
        </DrawerHeader>

        <Content category={category} currency={currency} />

        <DrawerFooter>
          <Button>Confirm</Button>
          <DrawerClose asChild>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </div>
    </DrawerContent>
  </Drawer>
);

export default CategoryDrawer;
